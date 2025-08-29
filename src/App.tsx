// src/app.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "@/components/ScrollToTop";
import MainNav from "./components/MainNav";
import Index from "./pages/Index";
import PlatformPage from "./pages/PlatformPage";
import FAQPage from "./pages/FAQPage";
import ThankYouPage from "./pages/ThankYouPage";
import SleepQuizPage from "./pages/SleepQuizPage";
import AdminPage from "./pages/AdminPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import SleepAnalyzerPage from "./pages/SleepAnalyzerPage";
import SleepPlannerPage from "./pages/SleepPlannerPage";
import SleepPlannerResultsPage from "./pages/SleepPlannerResultsPage";
import PlanSharePage from "./pages/PlanSharePage";
import ConsultationPage from "./pages/ConsultationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Use hash routing only on *.lovable.app (Lovable doesn't provide SPA rewrites)
const isLovableHost =
  typeof window !== "undefined" && /\.lovable\.app$/.test(window.location.hostname);

const Router = isLovableHost ? HashRouter : BrowserRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <ScrollToTop />
          <MainNav />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/sleep-quiz" element={<SleepQuizPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/sleep-analyzer" element={<SleepAnalyzerPage />} />
            <Route path="/sleep-planner" element={<SleepPlannerPage />} />
            <Route path="/sleep-planner/results" element={<SleepPlannerResultsPage />} />
            <Route path="/plan/:slug" element={<PlanSharePage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
