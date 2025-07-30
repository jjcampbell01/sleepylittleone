import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQEntry {
  question: string;
  answer: string;
}

const FAQPage = () => {
  const faqEntries: FAQEntry[] = [
    {
      question: "My six‑month‑old fights the first of three naps. Should I change our wake windows?",
      answer: "Around six months, many babies can stay awake a bit longer than they did as newborns. If your little one consistently resists the first nap, try extending the first wake window by about 15 minutes while watching for sleepy cues like yawning or eye‑rubbing. In Understanding Naps we show you how to adjust wake windows gradually and how to read your baby's signals so you can find the sweet spot between under‑tired and overtired."
    },
    {
      question: "When should we move from three naps to two?",
      answer: "Most babies drop from three to two naps sometime between 6–9 months. Signs they're ready include skipping the late‑afternoon nap, taking short naps despite plenty of sleep opportunity, or suddenly struggling to fall asleep at bedtime. In Understanding Naps we walk you through extending wake windows in small steps, capping naps when needed and making the transition without causing overtiredness."
    },
    {
      question: "What if my baby starts rolling during sleep training?",
      answer: "Rolling is a big milestone! Once your baby shows signs of rolling, discontinue swaddling and make sure the sleep space is firm and free of loose items. During the day, provide plenty of supervised tummy‑time so they master rolling both ways. At night, let them find their own comfortable position rather than constantly flipping them back, unless they are distressed. Safe sleep practices are covered in Creating Peaceful Nights."
    },
    {
      question: "My 10‑month‑old's naps are inconsistent—should I lengthen wake windows?",
      answer: "As babies approach 10–12 months, they often need a little more awake time to build enough \"sleep pressure.\" Try lengthening wake windows by 15‑minute increments and keep a consistent pre‑nap routine. If bedtime pushes later but your child is still well‑rested, that's okay. This topic is covered in our nap‑planning strategies inside Understanding Naps."
    },
    {
      question: "My 10‑month‑old cries at bedtime—do I intervene?",
      answer: "Some babies need to \"power down\" before sleep. Brief fussing or crying (under 10–15 minutes) can simply be their way of releasing energy. As long as your child's needs have been met and the cry doesn't sound distressed, allow them that space. If crying is intense or prolonged, check for overtiredness, hunger or discomfort. We discuss bedtime behaviours and calming routines in Creating Peaceful Nights."
    },
    {
      question: "Why does my baby wake up at 5 a.m., and how can I get a later start?",
      answer: "Early waking can happen for many reasons: naps that end too late, going to bed too early or too late, or an overly stimulating sleep environment. Start by stretching the bedtime wake window by 10–15 minutes and reviewing nap lengths. Ensure the room stays dark and quiet until your desired morning wake time. You'll find detailed troubleshooting for early‑morning wake‑ups in Navigating Sleep Challenges."
    },
    {
      question: "How do I handle the four‑month sleep regression?",
      answer: "The four‑month regression is when your baby's sleep cycles mature. Stick with your soothing bedtime routine and keep wake windows age‑appropriate (usually 60–90 minutes at this age). Swaddling can still help some babies who aren't rolling yet; however, be prepared to transition out of the swaddle once rolling starts. Our module Navigating Sleep Challenges includes gentle settling techniques to get through regressions."
    },
    {
      question: "My baby's caregiver wakes them too early from naps—will this ruin our progress?",
      answer: "A few short naps at grandma's house won't undo all your hard work. Treat outside care like daycare: do your best but don't expect perfection. If naps are cut short, you can offer an earlier bedtime or a short catnap at home. Your consistent routine will help your baby recalibrate quickly."
    },
    {
      question: "My 7‑month‑old moans at 5 a.m.—is this early waking?",
      answer: "Babies often make noises as they transition between sleep cycles, especially in the early morning hours. If your little one is just moaning or moving lightly and not crying, wait a few minutes to see if they resettle. Intervening too quickly can accidentally start the day. We talk about active sleep versus fully awake behaviour in Navigating Sleep Challenges."
    },
    {
      question: "Should my 14‑month‑old drop to one nap?",
      answer: "Many toddlers switch to one nap between 15–18 months. If your child still takes two solid naps and sleeps well overnight, there's no need to rush. Once naps become short or bedtime moves significantly later, start nudging the morning nap later and gradually shorten it until one midday nap emerges. Our transition plans in Understanding Naps make this process smooth."
    },
    {
      question: "How can I support my baby's sleep while traveling?",
      answer: "Practice naps and bedtime in the travel crib at home so it feels familiar. Bring along familiar sleep cues (like a white‑noise machine and bedtime book) and keep the bedtime routine consistent. Expect some setbacks and plan for extra soothing. Once you're home, return to your normal routine and your baby will typically readjust quickly."
    },
    {
      question: "Do I need to dream feed my 5‑month‑old?",
      answer: "Dream feeds are optional. Some families find that feeding their baby right before the parents go to bed helps everyone get a longer first stretch of sleep. Other babies sleep just as well without it. If your child is getting enough calories during the day and is gaining weight appropriately, you can phase out dream feeds. We explain how to identify and drop unnecessary night feeds in Creating Peaceful Nights."
    },
    {
      question: "My 6‑week‑old only naps for 30–40 minutes—is that normal?",
      answer: "Yes! Newborns often nap for just one sleep cycle (30–45 minutes) and stay awake for only an hour or so. Short naps at this age are developmentally appropriate. Focus on age‑appropriate wake windows and a consistent pre‑nap routine; nap lengthens over time. See Understanding Naps for a breakdown of nap expectations by age."
    },
    {
      question: "If my 15‑week‑old wakes but isn't crying, should I pick them up?",
      answer: "If your baby wakes and is happily cooing or looking around, it's fine to give them a few minutes in the crib. This encourages independent play and self‑soothing. If they start to fuss or cry, respond and provide support."
    },
    {
      question: "How do I wean the pacifier and teach sleep independence?",
      answer: "Start by offering the pacifier at the beginning of sleep, but avoid replacing it every time it falls out. Encourage your child to find their fingers or another self‑soothing method. Over several nights, you can remove the pacifier altogether. Our gradual weaning strategy in Creating Peaceful Nights pairs pacifier reduction with teaching your baby to fall asleep on their own."
    },
    {
      question: "I need to leave early for work. Is a 6:00 a.m. wake‑up okay for my 8‑month‑old?",
      answer: "Absolutely. The key is ensuring your baby meets their total sleep needs (which generally range from 12–16 hours at this age). Adjust bedtime and naps to make sure they're getting enough rest, and don't worry if wake‑up has to be a bit earlier for your family's schedule."
    },
    {
      question: "Is a bedtime feed necessary if my baby isn't interested?",
      answer: "A bedtime feed isn't mandatory. Many families find success offering the last feed 30–45 minutes before bed to avoid creating a feed‑to‑sleep association. As long as your baby is eating well during the day and growing appropriately, you can move that feed earlier and allow them to fall asleep without nursing or a bottle."
    },
    {
      question: "My six‑month‑old fights the first nap. Should I lengthen wake windows?",
      answer: "At six months, most babies can handle 2–2½ hours of awake time. If your baby resists the first nap, lengthen the first wake window in small increments (10–15 minutes) until they're ready to sleep. We offer detailed sample schedules and adjustment tips in Understanding Naps."
    },
    {
      question: "My 8‑month‑old wakes at 4 a.m. How do we stop the \"early‑bird\" routine?",
      answer: "Gradually shift bedtime later by 10–15 minutes every couple of days until you find the time that yields a later morning. Check that daytime naps aren't running too long and that wake windows are age‑appropriate. A consistent routine and a dark, quiet bedroom are your allies here. You'll find more early‑waking solutions in Navigating Sleep Challenges."
    },
    {
      question: "When is it time for my 15‑month‑old to drop to one nap?",
      answer: "The 2‑to‑1 nap transition often happens between 15 and 18 months. If your toddler consistently refuses one of the naps or bedtime becomes very late, start shortening the morning nap and moving it later. Over a week or two, merge the two naps into one midday nap. Our module Understanding Naps includes a step‑by‑step plan for this transition."
    },
    {
      question: "My 4‑month‑old rolls onto her tummy and cries. Should I flip her back?",
      answer: "Once your baby can roll both ways, you can let her choose her sleeping position. If she rolls and cries because she's stuck, gently help her practise rolling during the day so she's more confident. Avoid swaddling once rolling begins and keep the sleep environment safe and free of loose objects."
    },
    {
      question: "My 10‑week‑old has inconsistent nights. Should I extend feeding intervals?",
      answer: "At this age, babies still need frequent feedings, often every 2–3 hours, day and night. Stretching feeds too far can lead to overtiredness and more night waking. Follow your baby's hunger cues, ensure they're well‑fed during the day and focus on establishing soothing bedtime routines."
    },
    {
      question: "My 6‑month‑old wakes at 5:30 a.m. Should I get them up?",
      answer: "If your goal is a 6 a.m. start, you can leave your baby in the crib until that time as long as they're content. Keeping the room dark and minimizing stimulation signals that it's still night. Review daytime sleep totals to ensure naps aren't taking away from night sleep, and adjust bedtime accordingly."
    },
    {
      question: "Will gentle sleep training work for my sensitive baby?",
      answer: "Yes! Our approach is flexible and responsive. We teach you to observe your baby's temperament and adjust the pace accordingly. Some sensitive babies may protest more at first, but with consistency and compassion they learn to sleep independently. Navigating Sleep Challenges includes strategies specifically for sensitive or high‑needs babies."
    },
    {
      question: "My 9‑month‑old seems to need a lot of sleep—is that okay?",
      answer: "Total sleep needs vary, but most nine‑month‑olds sleep 12–16 hours in 24 hours. If your baby consistently sleeps much more than that yet still seems tired, consider offering more calories during the day and gently lengthening wake windows to ensure they're tired enough to sleep soundly. Always consult your pediatrician if you're concerned about excessive sleep."
    },
    {
      question: "We finally got our baby to fall asleep independently. What next?",
      answer: "Celebrate this milestone! Continue following your bedtime routine and respecting wake windows to reinforce the new skill. Babies thrive with consistency, so keep doing what works and savour the progress."
    },
    {
      question: "How do we handle daylight saving time changes?",
      answer: "About a week before the time change, shift your baby's naps and bedtime by 10–15 minutes each day toward the new time. Exposure to natural daylight in the morning and a consistent routine help reset their internal clock. Detailed DST adjustment plans are included in Navigating Sleep Challenges."
    },
    {
      question: "My in‑laws don't follow our sleep rules. Will that undo our progress?",
      answer: "Occasional deviations from your routine—like naps at grandma's house—won't undo your hard work. Treat it like daycare: accept that naps might not be perfect and then return to your routine at home. Consistency the majority of the time is what matters most."
    },
    {
      question: "Our 12‑month‑old wakes at 4 a.m. How can we push wake‑time later?",
      answer: "Gradually lengthen wake windows during the day, ensure naps aren't too long or too late, and shift bedtime later if necessary. Keep the room dark and quiet at 4 a.m. to discourage starting the day. In Navigating Sleep Challenges we offer age‑specific schedules and gradual approaches to nudging wake‑times later."
    },
    {
      question: "How do I transition my baby from a motion bassinet to a crib?",
      answer: "Start by using the crib for daytime naps while still letting your baby sleep in the bassinet at night. Remove any motion or swaddling aids as soon as your baby shows signs of rolling. After a few days, move nighttime sleep to the crib. A familiar bedtime routine will help them feel secure in the new environment."
    },
    {
      question: "Does sleep training mean we can never leave the house?",
      answer: "Absolutely not. While consistency is important, it's also healthy for your family to get out. Plan outings around wake windows, and if a nap happens in the car or stroller occasionally, that's fine. We recommend offering at least one nap at home when possible and returning to your usual routine afterwards."
    },
    {
      question: "Our holiday travel derailed sleep training. Is the progress lost?",
      answer: "Temporary setbacks happen to everyone. Once you're home, immediately return to your usual routines and wake windows. Most babies readjust within a week or two. Stay confident—consistency is key."
    },
    {
      question: "Which night feed should I drop first?",
      answer: "It's often easiest to keep the feed early in the evening and drop very early‑morning feeds last because sleep pressure is lowest just before dawn. Reduce the volume or duration of the feed you want to eliminate over several nights while boosting daytime calories. Our Creating Peaceful Nights module includes detailed night‑weaning guidance."
    },
    {
      question: "My 4‑month‑old rolls at bedtime and wakes—how can I help?",
      answer: "Practise rolling during playtime so your baby becomes confident on their tummy. Remove swaddling once rolling begins and ensure the sleep space is clear and flat. At bedtime, stick to your soothing routine and allow your baby to find a comfortable position without flipping them every time they roll."
    },
    {
      question: "Do I need to sit in a dark room holding my baby to help them nap?",
      answer: "A dark room can signal sleep, but you don't need to hold your baby in the dark for long periods. Follow age‑appropriate wake windows, use a brief wind‑down routine, and place your baby in their crib awake. This teaches them to settle independently while still benefiting from a calm, dark environment."
    }
  ];

  // Structured data for FAQPage schema
  const faqStructuredData = {
    mainEntity: faqEntries.map(entry => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer
      }
    }))
  };

  return (
    <>
      <SEO
        title="FAQ"
        description="Gentle, expert-backed answers to your most common baby sleep questions. Based on the Sleepy Little One method, for ages 5–24 months."
        canonical="https://www.sleepylittleone.com/faq"
      />
      
      <StructuredData
        type="FAQPage"
        data={faqStructuredData}
      />

      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white drop-shadow-2xl mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/90 drop-shadow-lg">
              Gentle, expert-backed answers to your most common baby sleep questions
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqEntries.map((entry, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/20 rounded-lg shadow-floating bg-white/10 backdrop-blur-sm">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-white/5 transition-colors">
                  <h3 className="text-lg font-semibold text-white pr-4 drop-shadow-sm">
                    {entry.question}
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-white/85 leading-relaxed drop-shadow-sm">
                    {entry.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default FAQPage;