import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import PlatformPage from "./pages/PlatformPage";
import LoginPage from "./pages/LoginPage";
import FAQPage from "./pages/FAQPage";
import ThankYouPage from "./pages/ThankYouPage";
import SleepQuizPage from "./pages/SleepQuizPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/sleep-quiz" element={<SleepQuizPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
