import { useState } from "react";
import { QuizIntro } from "@/components/quiz/QuizIntro";
import { QuizStep } from "@/components/quiz/QuizStep";
import { EmailCapture } from "@/components/quiz/EmailCapture";
import { QuizResult } from "@/components/quiz/QuizResult";
import { SEO } from "@/components/SEO";
import { getQuestions, determineResultType } from "@/utils/quizLogic";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";

type QuizPhase = 'intro' | 'questions' | 'email' | 'result';

export default function SleepQuizPage() {
  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resultType, setResultType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const questions = getQuestions();

  const startQuiz = () => {
    setPhase('questions');
    setCurrentQuestion(0);
  };

  const handleOptionSelect = (option: string) => {
    const question = questions[currentQuestion];
    const questionId = question.id;

    if (question.isMultiSelect) {
      const currentSelections = (responses[questionId] as string[]) || [];
      const maxSelections = question.maxSelections || 999;
      
      if (currentSelections.includes(option)) {
        // Remove selection
        setResponses(prev => ({
          ...prev,
          [questionId]: currentSelections.filter(sel => sel !== option)
        }));
      } else if (currentSelections.length < maxSelections) {
        // Add selection
        setResponses(prev => ({
          ...prev,
          [questionId]: [...currentSelections, option]
        }));
      }
    } else {
      setResponses(prev => ({
        ...prev,
        [questionId]: option
      }));
    }
  };

  const getNextVisibleQuestion = (currentIndex: number): number => {
    for (let i = currentIndex + 1; i < questions.length; i++) {
      const question = questions[i];
      if (!question.showIf || question.showIf(responses)) {
        return i;
      }
    }
    return questions.length; // End of quiz
  };

  const getPreviousVisibleQuestion = (currentIndex: number): number => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      const question = questions[i];
      if (!question.showIf || question.showIf(responses)) {
        return i;
      }
    }
    return 0; // Start of quiz
  };

  const handleNext = () => {
    const nextQuestion = getNextVisibleQuestion(currentQuestion);
    if (nextQuestion >= questions.length) {
      setPhase('email');
    } else {
      setCurrentQuestion(nextQuestion);
    }
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;
    const prevQuestion = getPreviousVisibleQuestion(currentQuestion);
    setCurrentQuestion(prevQuestion);
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const currentQuestionData = getCurrentQuestion();
  const selectedOptions = currentQuestionData.isMultiSelect 
    ? (responses[currentQuestionData.id] as string[]) || []
    : responses[currentQuestionData.id] ? [responses[currentQuestionData.id] as string] : [];

  const canProceed = currentQuestionData.isOptional || selectedOptions.length > 0;

  const getVisibleQuestionNumber = () => {
    let visibleQuestions = 0;
    for (let i = 0; i <= currentQuestion; i++) {
      const question = questions[i];
      if (!question.showIf || question.showIf(responses)) {
        visibleQuestions++;
      }
    }
    return visibleQuestions;
  };

  const getTotalVisibleQuestions = () => {
    return questions.filter(q => !q.showIf || q.showIf(responses)).length;
  };

  const handleEmailSubmit = async (name: string, email: string) => {
    setIsSubmitting(true);
    setUserName(name);
    setUserEmail(email);

    try {
      // Determine result type based on responses
      const result = determineResultType({
        babyAge: responses['baby-age'] as string,
        napsPerDay: responses['naps-per-day'] as string,
        nightWakings: responses['night-wakings'] as string,
        sleepStruggles: responses['sleep-struggles'] as string[],
        triedStrategies: responses['tried-strategies'] as string,
        sleepTrainingConcerns: responses['sleep-training-concerns'] as string
      });

      setResultType(result);

      // Save to database
      const { error } = await supabase
        .from('quiz_responses')
        .insert({
          user_id: user?.id || null,
          email,
          first_name: name,
          baby_age: responses['baby-age'] as string,
          naps_per_day: responses['naps-per-day'] as string || null,
          night_wakings: responses['night-wakings'] as string,
          sleep_struggles: responses['sleep-struggles'] as string[],
          tried_strategies: responses['tried-strategies'] as string,
          sleep_training_concerns: responses['sleep-training-concerns'] as string || null,
          result_type: result
        });

      if (error) {
        console.error('Error saving quiz response:', error);
        toast({
          title: "Something went wrong",
          description: "We couldn't save your quiz results, but you can still view them.",
          variant: "destructive"
        });
      }

      setPhase('result');
    } catch (error) {
      console.error('Error processing quiz:', error);
      toast({
        title: "Something went wrong", 
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO 
        title="Baby Sleep Quiz - Find Your Baby's Sleep Type | Sleepy Little One"
        description="Take our 60-second quiz to discover what's disrupting your baby's sleep and get a personalized 3-step plan to fix it gently."
        canonical="https://www.sleepylittleone.com/sleep-quiz"
      />
      
      {phase === 'intro' && <QuizIntro onStart={startQuiz} />}
      
      {phase === 'questions' && (
        <QuizStep
          currentStep={getVisibleQuestionNumber()}
          totalSteps={getTotalVisibleQuestions()}
          question={currentQuestionData.question}
          options={currentQuestionData.options}
          selectedOptions={selectedOptions}
          onOptionSelect={handleOptionSelect}
          onNext={handleNext}
          onBack={handleBack}
          isMultiSelect={currentQuestionData.isMultiSelect}
          canProceed={canProceed}
        />
      )}
      
      {phase === 'email' && (
        <EmailCapture 
          onSubmit={handleEmailSubmit}
          isLoading={isSubmitting}
        />
      )}
      
      {phase === 'result' && (
        <QuizResult 
          resultType={resultType}
          userName={userName}
        />
      )}
    </div>
  );
}