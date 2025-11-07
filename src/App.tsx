import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { NotificationProvider } from "./contexts/NotificationContext";
import { CandidatesProvider } from "./contexts/CandidatesContext";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobApplication from "./pages/JobApplication";
import JobRequisitions from "./pages/JobRequisitions";
import Candidates from "./pages/Candidates";
import Interviews from "./pages/Interviews";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <CandidatesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/jobs" element={<DashboardLayout><Jobs /></DashboardLayout>} />
              <Route path="/job-application" element={<DashboardLayout><JobApplication /></DashboardLayout>} />
              <Route path="/job-requisitions" element={<DashboardLayout><JobRequisitions /></DashboardLayout>} />
              <Route path="/candidates" element={<DashboardLayout><Candidates /></DashboardLayout>} />
              <Route path="/interviews" element={<DashboardLayout><Interviews /></DashboardLayout>} />
              <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
              <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CandidatesProvider>
    </NotificationProvider>
  </QueryClientProvider>
);

export default App;
