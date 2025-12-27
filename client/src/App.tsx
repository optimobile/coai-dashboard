import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

// Add Plausible analytics script
if (typeof window !== 'undefined' && !window.plausible) {
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = 'https://plausible.io/js/script.js';
  script.setAttribute('data-domain', window.location.hostname);
  document.head.appendChild(script);
  (window as any).plausible = (window as any).plausible || function() { (window as any).plausible.q = (window as any).plausible.q || []; (window as any).plausible.q.push(arguments); };
}
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
import TrainingV2 from "./pages/Training-v2";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import CoursePlayer from "./pages/CoursePlayer";
import Certification from "./pages/Certification";
import CertificationV2 from "./pages/Certification-v2";
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
import WatchdogPublic from "./pages/WatchdogPublic";
import CouncilDetail from "./pages/CouncilDetail";
import Resources from "./pages/Resources";
import About from "./pages/About";
import NewHomeV2 from "./pages/NewHome-v2";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ComplianceMonitoring from "./pages/ComplianceMonitoring";
import BulkAISystemImport from "./pages/BulkAISystemImport";
import Jobs from "./pages/Jobs";
import ReferralLandingPage from "./pages/ReferralLandingPage";
import NotificationSettings from "./pages/NotificationSettings";
import MyApplications from "./pages/MyApplications";
import VerifyCertificate from "./pages/VerifyCertificate";
import AgentCouncilFeature from "./pages/features/AgentCouncilFeature";
import PDCAFrameworkFeature from "./pages/features/PDCAFrameworkFeature";
import TrainingCertificationFeature from "./pages/features/TrainingCertificationFeature";
import WatchdogJobsFeature from "./pages/features/WatchdogJobsFeature";
import StudentProgress from "./pages/StudentProgress";
import CoursesRedesigned from "./pages/CoursesRedesigned";
import CourseDetail from "./pages/CourseDetail";
import CEASAI from "./pages/CEASAI";
import WatchdogSubmit from "./pages/WatchdogSubmit";
import AdvisoryBoard from "./pages/AdvisoryBoard";
import Accreditation from "./pages/Accreditation";
import SOAIPDCAFramework from "./pages/SOAIPDCAFramework";
import PDCASimulator from "./pages/PDCASimulator";
import CertificateVerification from "./pages/CertificateVerification";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import Enterprise from "./pages/Enterprise";
import RegulatoryAuthority from "./pages/RegulatoryAuthority";
import GovernmentPortal from "./pages/GovernmentPortal";
import EnterpriseIntegration from "./pages/EnterpriseIntegration";
import ISO17065 from "./pages/ISO17065";
import EUNotifiedBody from "./pages/EUNotifiedBody";
import NISTRecognition from "./pages/NISTRecognition";
import TC260Alignment from "./pages/TC260Alignment";
import APIKeyManagement from "./pages/APIKeyManagement";
import WebhookMonitoring from "./pages/WebhookMonitoring";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import ComplianceAssessmentWizard from "./pages/ComplianceAssessmentWizard";
import RegulatoryPortal from "./pages/RegulatoryPortal";
import CouncilVotingEngine from "./pages/CouncilVotingEngine";
import GovernmentAdminDashboard from "./pages/GovernmentAdminDashboard";
import NotificationPreferences from "./pages/NotificationPreferences";
import RegionSettings from "./pages/RegionSettings";
import { DashboardIntegrated } from "./pages/DashboardIntegrated";
import { ComplianceRoadmapPage } from "./pages/ComplianceRoadmapPage";
import { AlertManagementPage } from "./pages/AlertManagementPage";
import { WebhookManagementPage } from "./pages/WebhookManagementPage";
import { AlertToastProvider } from "./components/AlertToastProvider";
import { Analytics } from "./pages/Analytics";
import { AuditTrail } from "./pages/AuditTrail";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);
  
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light">
          <AuthProvider>
          <AlertToastProvider>
            <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <ScrollToTop />
              <Header />
              <main className="flex-1">
                <Switch>
                  {/* Main routes */}
                  <Route path="/" component={NewHomeV2} />
                  <Route path="/login" component={Login} />
                  <Route path="/signup" component={Signup} />
                  <Route path="/referral" component={ReferralLandingPage} />
                  <Route path="/marketing" component={MarketingHome} />
                  <Route path="/standards" component={Standards} />
                  <Route path="/resources" component={Resources} />
                  <Route path="/about" component={About} />
                  <Route path="/old-home" component={Home} />
                  <Route path="/landing" component={Landing} />
                  <Route path="/dashboard" component={Dashboard} />
                  <Route path="/dashboard/executive" component={DashboardIntegrated} />
                  <Route path="/dashboard/roadmap" component={ComplianceRoadmapPage} />
                  <Route path="/dashboard/alerts" component={AlertManagementPage} />
                  <Route path="/settings/webhooks" component={WebhookManagementPage} />
                  <Route path="/ai-systems" component={AISystems} />
                  <Route path="/risk-assessment" component={RiskAssessment} />
                  <Route path="/compliance" component={Compliance} />
                  <Route path="/agent-council" component={AgentCouncil} />
                  <Route path="/council-detail" component={CouncilDetail} />
                  <Route path="/watchdog" component={Watchdog} />
      <Route path="/watchdog-hub" component={WatchdogPublic} />
                  <Route path="/reports" component={Reports} />
                  <Route path="/settings" component={Settings} />
                  <Route path="/settings/billing" component={Billing} />
                  <Route path="/settings/notifications" component={NotificationSettings} />
                  <Route path="/watchdog-signup" component={WatchdogSignup} />
      <Route path="/watchdog/report" component={WatchdogPublic} />
                  <Route path="/training" component={TrainingV2} />
                  <Route path="/courses" component={CoursesRedesigned} />
                  <Route path="/course/:id" component={CourseDetail} />
                  <Route path="/ceasai" component={CEASAI} />
                  <Route path="/watchdog/submit" component={WatchdogSubmit} />
                  <Route path="/advisory-board" component={AdvisoryBoard} />
                  <Route path="/my-courses" component={MyCourses} />
                  <Route path="/dashboard/progress" component={StudentProgress} />
                  <Route path="/courses/:id/learn" component={CoursePlayer} />
                  <Route path="/verify-certificate/:id" component={VerifyCertificate} />
                  <Route path="/features/33-agent-council" component={AgentCouncilFeature} />
                  <Route path="/features/pdca-framework" component={PDCAFrameworkFeature} />
                  <Route path="/features/training-certification" component={TrainingCertificationFeature} />
                  <Route path="/features/watchdog-jobs" component={WatchdogJobsFeature} />
                  <Route path="/certification" component={CertificationV2} />
                  <Route path="/exam" component={CertificationExam} />
                  <Route path="/certification/exam" component={CertificationExam} />
                  <Route path="/certification/results" component={CertificationResults} />
                  <Route path="/certificates" component={MyCertificates} />
                  <Route path="/certification/review" component={ExamReview} />
                  <Route path="/workbench" component={Workbench} />
                  <Route path="/jobs" component={Jobs} />
                  <Route path="/my-applications" component={MyApplications} />
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
             <Route path="/watchdog-leaderboard" component={WatchdogLeaderboard} />
      <Route path="/public-watchdog" component={WatchdogPublic} />               <Route path="/regulator" component={RegulatorDashboard} />
                  <Route path="/blog" component={Blog} />
                  <Route path="/recommendations" component={Recommendations} />
                  <Route path="/accreditation" component={Accreditation} />
                  <Route path="/soai-pdca" component={SOAIPDCAFramework} />
                  <Route path="/pdca-simulator" component={PDCASimulator} />
                  <Route path="/verify-certificate" component={CertificateVerification} />
                  <Route path="/enterprise" component={Enterprise} />
                  <Route path="/enterprise-dashboard" component={EnterpriseDashboard} />
                  <Route path="/compliance-monitoring" component={ComplianceMonitoring} />
                  <Route path="/bulk-import" component={BulkAISystemImport} />
                  <Route path="/regulatory-authority" component={RegulatoryAuthority} />
                  <Route path="/regulatory/iso-17065" component={ISO17065} />
                  <Route path="/regulatory/eu-notified-body" component={EUNotifiedBody} />
                  <Route path="/regulatory/nist-recognition" component={NISTRecognition} />
                  <Route path="/regulatory/tc260-alignment" component={TC260Alignment} />
                  <Route path="/government-portal" component={GovernmentPortal} />
                  <Route path="/enterprise-integration" component={EnterpriseIntegration} />
                  <Route path="/admin/api-keys" component={APIKeyManagement} />
                  <Route path="/admin/webhooks" component={WebhookMonitoring} />
                  <Route path="/admin/government" component={GovernmentAdminDashboard} />
                  <Route path="/notification-preferences" component={NotificationPreferences} />
                  <Route path="/region-settings" component={RegionSettings} />
                  <Route path="/payment-success" component={PaymentSuccess} />
                  <Route path="/payment-failure" component={PaymentFailure} />
                  <Route path="/compliance-assessment" component={ComplianceAssessmentWizard} />
                  <Route path="/regulatory-portal" component={RegulatoryPortal} />
                  <Route path="/council-voting" component={CouncilVotingEngine} />
                  <Route path="/analytics" component={Analytics} />
                  <Route path="/audit" component={AuditTrail} />
                  <Route path="/404" component={NotFound} />
                  {/* Final fallback route */}
                  <Route component={NotFound} />
                </Switch>
              </main>
              <Footer />
            </div>
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
            </TooltipProvider>
          </AlertToastProvider>
        </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
