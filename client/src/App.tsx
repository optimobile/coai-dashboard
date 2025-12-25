import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AISystems from "./pages/AISystems";
import RiskAssessment from "./pages/RiskAssessment";
import Compliance from "./pages/Compliance";
import AgentCouncil from "./pages/AgentCouncil";
import Watchdog from "./pages/Watchdog";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import WatchdogSignup from "./pages/WatchdogSignup";
import Training from "./pages/Training";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import CoursePlayer from "./pages/CoursePlayer";
import Certification from "./pages/Certification";
import CertificationExam from "./pages/CertificationExam";
import CertificationResults from "./pages/CertificationResults";
import MyCertificates from "./pages/MyCertificates";
import ExamReview from "./pages/ExamReview";
import Workbench from "./pages/Workbench";
import PublicHome from "./pages/PublicHome";
import Admin from "./pages/Admin";
import ApiDocs from "./pages/ApiDocs";
import ApiKeys from "./pages/ApiKeys";
import PDCACycles from "./pages/PDCACycles";
import Billing from "./pages/Billing";
import PublicDashboard from "./pages/PublicDashboard";
import ComplianceScorecard from "./pages/ComplianceScorecard";
import KnowledgeBase from "./pages/KnowledgeBase";
import EnterpriseOnboarding from "./pages/EnterpriseOnboarding";
import Pricing from "./pages/Pricing";
import WatchdogLeaderboard from "./pages/WatchdogLeaderboard";
import RegulatorDashboard from "./pages/RegulatorDashboard";
import Blog from "./pages/Blog";
import Recommendations from "./pages/Recommendations";
import MarketingHome from "./pages/MarketingHome";
import Standards from "./pages/Standards";
import Resources from "./pages/Resources";
import About from "./pages/About";
import NewHome from "./pages/NewHome";
import VerifyCertificate from "./pages/VerifyCertificate";
import AgentCouncilFeature from "./pages/features/AgentCouncilFeature";
import PDCAFrameworkFeature from "./pages/features/PDCAFrameworkFeature";
import TrainingCertificationFeature from "./pages/features/TrainingCertificationFeature";
import WatchdogJobsFeature from "./pages/features/WatchdogJobsFeature";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Main routes */}
      <Route path="/" component={NewHome} />
      <Route path="/marketing" component={MarketingHome} />
      <Route path="/standards" component={Standards} />
      <Route path="/resources" component={Resources} />
      <Route path="/about" component={About} />
      <Route path="/old-home" component={Home} />
      <Route path="/landing" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ai-systems" component={AISystems} />
      <Route path="/risk-assessment" component={RiskAssessment} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/agent-council" component={AgentCouncil} />
      <Route path="/watchdog" component={Watchdog} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route path="/settings/billing" component={Billing} />
      <Route path="/watchdog-signup" component={WatchdogSignup} />
      <Route path="/training" component={Training} />
      <Route path="/courses" component={Courses} />
      <Route path="/my-courses" component={MyCourses} />
      <Route path="/courses/:id/learn" component={CoursePlayer} />
      <Route path="/verify-certificate/:id" component={VerifyCertificate} />
      <Route path="/features/33-agent-council" component={AgentCouncilFeature} />
      <Route path="/features/pdca-framework" component={PDCAFrameworkFeature} />
      <Route path="/features/training-certification" component={TrainingCertificationFeature} />
      <Route path="/features/watchdog-jobs" component={WatchdogJobsFeature} />
      <Route path="/certification" component={Certification} />
      <Route path="/certification/exam" component={CertificationExam} />
      <Route path="/certification/results" component={CertificationResults} />
      <Route path="/certificates" component={MyCertificates} />
      <Route path="/certification/review" component={ExamReview} />
      <Route path="/workbench" component={Workbench} />
      <Route path="/public" component={PublicHome} />
      <Route path="/admin" component={Admin} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/api-keys" component={ApiKeys} />
      <Route path="/pdca" component={PDCACycles} />
      <Route path="/transparency" component={PublicDashboard} />
      <Route path="/scorecard/:systemId" component={ComplianceScorecard} />
      <Route path="/knowledge-base" component={KnowledgeBase} />
      <Route path="/enterprise-onboarding" component={EnterpriseOnboarding} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/leaderboard" component={WatchdogLeaderboard} />
      <Route path="/regulator" component={RegulatorDashboard} />
      <Route path="/blog" component={Blog} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
