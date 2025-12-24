import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AISystems from "./pages/AISystems";
import RiskAssessment from "./pages/RiskAssessment";
import Compliance from "./pages/Compliance";
import AgentCouncil from "./pages/AgentCouncil";
import Watchdog from "./pages/Watchdog";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      {/* Main routes */}
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ai-systems" component={AISystems} />
      <Route path="/risk-assessment" component={RiskAssessment} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/agent-council" component={AgentCouncil} />
      <Route path="/watchdog" component={Watchdog} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
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
