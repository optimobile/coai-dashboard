import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import WatchdogTraining from "./pages/WatchdogTraining";
import WatchdogHub from "./pages/WatchdogHub";
import WatchdogIncidentReport from "./pages/WatchdogIncidentReport";
import CEASAICertification from "./pages/CEASAICertification";
import RegulatoryPlatform from "./pages/RegulatoryPlatform";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/watchdog/training" component={WatchdogTraining} />
      <Route path="/watchdog/hub" component={WatchdogHub} />
      <Route path="/watchdog/report" component={WatchdogIncidentReport} />
      <Route path="/ceasai/certification" component={CEASAICertification} />
      <Route path="/regulatory/platform" component={RegulatoryPlatform} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
