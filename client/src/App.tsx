import {
  useCallback,
  useEffect,
  lazy,
  Suspense,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CeremonialIntro } from "./components/CeremonialIntro";
import { PremiumNavigation } from "./components/PremiumNavigation";
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const MaterialsScience = lazy(() => import("./pages/MaterialsScience"));
const CommunityImpact = lazy(() => import("./pages/CommunityImpact"));
const ResearchLab = lazy(() => import("./pages/ResearchLab"));
const Timeline = lazy(() => import("./pages/Timeline"));
const SearchablePatentClaims = lazy(
  () => import("./components/SearchablePatentClaims")
);
const EnergyHarvesting = lazy(() =>
  import("./pages/EnergyHarvesting").then(m => ({
    default: m.EnergyHarvesting,
  }))
);
const Manufacturing = lazy(() =>
  import("./pages/Manufacturing").then(m => ({ default: m.Manufacturing }))
);
const Applications = lazy(() =>
  import("./pages/Applications").then(m => ({ default: m.Applications }))
);
const QuantumResearchEnhanced = lazy(
  () => import("./pages/QuantumResearchEnhanced")
);
const NotFound = lazy(() => import("./pages/NotFound"));
import { useLocation } from "wouter";
import { SoundPreferencesProvider } from "./contexts/SoundPreferencesContext";
import { VoicePreferencesProvider } from "./contexts/VoicePreferencesContext";
import { GestureNavigationProvider } from "./contexts/GestureNavigationContext";
import { PremiumFooter } from "./components/PremiumFooter";
const HomeSovereign = lazy(() => import("./pages/HomeSovereign"));
const TrueMelangePhi = lazy(() => import("./pages/TrueMelangePhi"));
const QueenCalifiaPage = lazy(() => import("./pages/QueenCalifia"));
const MelaNationPage = lazy(() => import("./pages/MelaNation"));
const MeLaNiNaPage = lazy(() => import("./pages/MeLaNiNa"));
const NuTaMeriPage = lazy(() => import("./pages/NuTaMeri"));
const TraiCoinPage = lazy(() => import("./pages/TraiCoin"));
const FounderPage = lazy(() => import("./pages/FounderPage"));
const PeoplesFoundation = lazy(() => import("./pages/PeoplesFoundation"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const HKAssistant = lazy(() => import("./components/HKAssistant"));
const CommandPalette = lazy(() =>
  import("./components/CommandPalette").then(module => ({
    default: module.CommandPalette,
  }))
);
import { SovereignAudioEngine } from "./components/SovereignAudioEngine";
import { ScrollProgressIndicator } from "./components/ScrollProgressIndicator";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-[#d6a33a]/30 border-t-[#d6a33a] rounded-full animate-spin" />
      <span className="text-white/40 text-sm font-mono">Loading...</span>
    </div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={HomeSovereign} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/materials" component={MaterialsScience} />
        <Route path="/community" component={CommunityImpact} />
        <Route path="/research" component={ResearchLab} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/patent-claims" component={SearchablePatentClaims} />
        <Route path="/energy" component={EnergyHarvesting} />
        <Route path="/manufacturing" component={Manufacturing} />
        <Route path="/quantum" component={QuantumResearchEnhanced} />
        <Route path="/applications" component={Applications} />
        <Route path="/true-melange" component={TrueMelangePhi} />
        <Route path="/queen-califia" component={QueenCalifiaPage} />
        <Route path="/mela-nation" component={MelaNationPage} />
        <Route path="/melanina" component={MeLaNiNaPage} />
        <Route path="/nu-ta-meri" component={NuTaMeriPage} />
        <Route path="/trai-coin" component={TraiCoinPage} />
        <Route path="/founder" component={FounderPage} />
        <Route path="/peoples-foundation" component={PeoplesFoundation} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const hkLauncherRef = useRef<HTMLButtonElement>(null);
  const [hkAssistantOpen, setHkAssistantOpen] = useState(false);
  const [hkAssistantLoaded, setHkAssistantLoaded] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandPaletteLoaded, setCommandPaletteLoaded] = useState(false);
  const [location, setLocation] = useLocation();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [introPhase, setIntroPhase] = useState<
    "sovereign" | "cinematic" | "done"
  >(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
      const rootPath = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
      if (currentPath !== rootPath) return "done";
    }
    return "sovereign";
  });

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const closeHkAssistant = useCallback(() => {
    setHkAssistantOpen(false);
    window.requestAnimationFrame(() => hkLauncherRef.current?.focus());
  }, []);
  useEffect(() => {
    if (hkAssistantOpen) setHkAssistantLoaded(true);
  }, [hkAssistantOpen]);
  useEffect(() => {
    if (commandPaletteOpen) setCommandPaletteLoaded(true);
  }, [commandPaletteOpen]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTabChange = (tabId: string) => {
    const routeMap: Record<string, string> = {
      hero: "/",
      sovereign: "/",
      materials: "/materials",
      energy: "/energy",
      manufacturing: "/manufacturing",
      quantum: "/quantum",
      applications: "/applications",
      patents: "/patent-claims",
      community: "/community",
      research: "/research",
      timeline: "/timeline",
      "case-studies": "/case-studies",
      "true-melange": "/true-melange",
      "queen-califia": "/queen-califia",
      founder: "/founder",
      "peoples-foundation": "/peoples-foundation",
      contact: "/contact",
      "mela-nation": "/mela-nation",
      melanina: "/melanina",
      "nu-ta-meri": "/nu-ta-meri",
      "trai-coin": "/trai-coin",
    };
    const route = routeMap[tabId] || "/";
    const transition = (window as any).TRAIOrganismV5?.transitionInternal;
    if (typeof transition === "function") {
      void transition(() => setLocation(route), { label: tabId });
      return;
    }
    setLocation(route);
  };

  const getCurrentTab = (): string => {
    if (location === "/") return "hero";
    if (location === "/materials") return "materials";
    if (location === "/energy") return "energy";
    if (location === "/manufacturing") return "manufacturing";
    if (location === "/quantum") return "quantum";
    if (location === "/applications") return "applications";
    if (location === "/community") return "community";
    if (location === "/research") return "research";
    if (location === "/timeline") return "timeline";
    if (location === "/patent-claims") return "patents";
    if (location === "/case-studies") return "case-studies";
    if (location === "/mela-nation") return "mela-nation";
    if (location === "/melanina") return "melanina";
    if (location === "/nu-ta-meri") return "nu-ta-meri";
    if (location === "/trai-coin") return "trai-coin";
    return "hero";
  };

  return (
    <ErrorBoundary>
      <SoundPreferencesProvider>
        <VoicePreferencesProvider>
          <GestureNavigationProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                {commandPaletteLoaded && (
                  <Suspense fallback={null}>
                    <CommandPalette
                      isOpen={commandPaletteOpen}
                      onClose={() => setCommandPaletteOpen(false)}
                    />
                  </Suspense>
                )}
                {introPhase === "sovereign" && (
                  <CeremonialIntro onComplete={() => setIntroPhase("done")} />
                )}
                <>
                  <PremiumNavigation
                    activeTab={getCurrentTab()}
                    onTabChange={handleTabChange}
                    isMuted={!audioEnabled}
                    onMuteToggle={() => setAudioEnabled(!audioEnabled)}
                    onSearchOpen={() => setCommandPaletteOpen(true)}
                  />
                  <main className="pt-16 min-h-screen bg-background">
                    <Router />
                  </main>
                  <PremiumFooter />
                  <ScrollProgressIndicator />
                  <SovereignAudioEngine
                    enabled={audioEnabled}
                    onToggle={() => setAudioEnabled(a => !a)}
                  />
                  <motion.button
                    ref={hkLauncherRef}
                    onClick={() => setHkAssistantOpen(!hkAssistantOpen)}
                    className="fixed bottom-4 left-4 z-[2147482400] flex h-14 items-center gap-2 rounded-full px-4 shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #B87333)",
                      boxShadow: "0 0 30px rgba(212,175,55,0.5)",
                    }}
                    whileHover={{
                      scale: 1.06,
                      boxShadow: "0 0 50px rgba(212,175,55,0.8)",
                    }}
                    whileTap={{ scale: 0.94 }}
                    title="Open H.K. Assistant"
                    aria-label={
                      hkAssistantOpen
                        ? "Close H.K. Assistant"
                        : "Open H.K. Assistant"
                    }
                    aria-expanded={hkAssistantOpen}
                  >
                    <span className="text-base font-black tracking-[0.12em] text-black">
                      H.K.
                    </span>
                    <span className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-black/70 sm:inline">
                      Assistant
                    </span>
                  </motion.button>
                  {hkAssistantLoaded && (
                    <Suspense fallback={null}>
                      <HKAssistant
                        isOpen={hkAssistantOpen}
                        onClose={closeHkAssistant}
                      />
                    </Suspense>
                  )}
                </>
              </TooltipProvider>
            </ThemeProvider>
          </GestureNavigationProvider>
        </VoicePreferencesProvider>
      </SoundPreferencesProvider>
    </ErrorBoundary>
  );
}

export default App;
