import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { CeremonialIntro } from './components/CeremonialIntro';
import { EnhancedNavigation } from './components/EnhancedNavigation';
import { PremiumNavigation } from './components/PremiumNavigation';
// Lazy-loaded pages for code splitting
const HomeCinematic = lazy(() => import('./pages/HomeCinematic').then(m => ({ default: m.HomeCinematic })));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const MaterialsScience = lazy(() => import('./pages/MaterialsScience'));
const CommunityImpact = lazy(() => import('./pages/CommunityImpact'));
const ResearchLab = lazy(() => import('./pages/ResearchLab'));
const Timeline = lazy(() => import('./pages/Timeline'));
const SearchablePatentClaims = lazy(() => import('./components/SearchablePatentClaims'));
const AdvancedFeatures = lazy(() => import('./pages/AdvancedFeatures').then(m => ({ default: m.AdvancedFeatures })));
const EnergyHarvesting = lazy(() => import('./pages/EnergyHarvesting').then(m => ({ default: m.EnergyHarvesting })));
const Manufacturing = lazy(() => import('./pages/Manufacturing').then(m => ({ default: m.Manufacturing })));
const Applications = lazy(() => import('./pages/Applications').then(m => ({ default: m.Applications })));
const AnnotationsPage = lazy(() => import('./pages/AnnotationsPage').then(m => ({ default: m.AnnotationsPage })));
const SoundPreferencesPage = lazy(() => import('./pages/SoundPreferencesPage').then(m => ({ default: m.SoundPreferencesPage })));
const QuantumResearchEnhanced = lazy(() => import('./pages/QuantumResearchEnhanced'));
const TrainingDashboard = lazy(() => import('./pages/TrainingDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
import { useLocation } from 'wouter';
import { SoundPreferencesProvider } from './contexts/SoundPreferencesContext';
import { VoicePreferencesProvider } from './contexts/VoicePreferencesContext';
import { GestureNavigationProvider } from './contexts/GestureNavigationContext';
const GestureControlPage = lazy(() => import('./pages/GestureControlPage'));
const ProjectGallery = lazy(() => import('./pages/ProjectGallery'));
const CareerTimeline = lazy(() => import('./pages/CareerTimeline'));
const DomainConfiguration = lazy(() => import('./pages/DomainConfiguration'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ProjectShowcase = lazy(() => import('./pages/ProjectShowcase'));
import { PremiumTestimonials } from './components/PremiumTestimonials';
import { PremiumFooter } from './components/PremiumFooter';
import { TraiCinematicEffects } from './components/TraiCinematicEffects';
const VideoProjectShowcase = lazy(() => import('./pages/VideoProjectShowcase'));
const HomeSovereign = lazy(() => import('./pages/HomeSovereign'));
const TrueMelangePhi = lazy(() => import('./pages/TrueMelangePhi'));
const QueenCalifiaPage = lazy(() => import('./pages/QueenCalifia'));
const MelaNationPage = lazy(() => import('./pages/MelaNation'));
const MeLaNiNaPage = lazy(() => import('./pages/MeLaNiNa'));
const FounderPage = lazy(() => import('./pages/FounderPage'));
const PeoplesFoundation = lazy(() => import('./pages/PeoplesFoundation'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const HKAssistant = lazy(() => import('./components/HKAssistant'));
const CommandPalette = lazy(() =>
  import('./components/CommandPalette').then(module => ({
    default: module.CommandPalette,
  }))
);
import { GamificationHUD } from './components/GamificationHUD';
import { SovereignAudioEngine } from './components/SovereignAudioEngine';
import { ScrollProgressIndicator } from './components/ScrollProgressIndicator';
const GamificationPage = lazy(() => import('./pages/GamificationPage').then(m => ({ default: m.GamificationPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const ApiDocsPage = lazy(() => import('./pages/ApiDocsPage').then(m => ({ default: m.ApiDocsPage })));
const AIInsightsPage = lazy(() => import('./pages/AIInsightsPage').then(m => ({ default: m.AIInsightsPage })));
const AdvancedFeaturesShowcase = lazy(() => import('./pages/AdvancedFeaturesShowcase').then(m => ({ default: m.AdvancedFeaturesShowcase })));
import { useSessionId } from './hooks/useSessionId';

// Page loading fallback
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
        <Route path="/cinematic" component={HomeCinematic} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/materials" component={MaterialsScience} />
        <Route path="/community" component={CommunityImpact} />
        <Route path="/research" component={ResearchLab} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/patent-claims" component={SearchablePatentClaims} />
        <Route path="/advanced-features" component={AdvancedFeatures} />
        <Route path="/energy" component={EnergyHarvesting} />
        <Route path="/manufacturing" component={Manufacturing} />
        <Route path="/quantum" component={QuantumResearchEnhanced} />
        <Route path="/applications" component={Applications} />
        <Route path="/dashboard" component={TrainingDashboard} />
        <Route path="/annotations" component={AnnotationsPage} />
        <Route path="/gesture-control" component={GestureControlPage} />
        <Route path="/sound-preferences" component={SoundPreferencesPage} />
        <Route path="/projects" component={ProjectGallery} />
        <Route path="/career-timeline" component={CareerTimeline} />
        <Route path="/quantum-enhanced" component={QuantumResearchEnhanced} />
        <Route path="/neural-training" component={TrainingDashboard} />
        <Route path="/domain" component={DomainConfiguration} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/project/:id" component={ProjectDetail} />
        <Route path="/projects-showcase" component={ProjectShowcase} />
        <Route path="/video-showcase" component={VideoProjectShowcase} />
        <Route path="/gamification" component={GamificationPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/api-docs" component={ApiDocsPage} />
        <Route path="/ai-insights" component={AIInsightsPage} />
        <Route path="/showcase" component={AdvancedFeaturesShowcase} />
        <Route path="/true-melange" component={TrueMelangePhi} />
        <Route path="/queen-califia" component={QueenCalifiaPage} />
        <Route path="/mela-nation" component={MelaNationPage} />
          <Route path="/melanina" component={MeLaNiNaPage} />
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
  const [hkAssistantOpen, setHkAssistantOpen] = useState(false);
  const [hkAssistantLoaded, setHkAssistantLoaded] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandPaletteLoaded, setCommandPaletteLoaded] = useState(false);
  const [location, setLocation] = useLocation();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const sessionId = useSessionId();
  // Intro plays on initial page load only — not on client-side navigation between pages
  const [introPhase, setIntroPhase] = useState<'sovereign' | 'cinematic' | 'done'>(() => {
    // If the user landed directly on a subpage (not root), skip the intro
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
      const rootPath = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

      if (currentPath !== rootPath) {
        return 'done';
      }
    }
    return 'sovereign';
  });

  useEffect(() => {
    // Force dark theme
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (hkAssistantOpen) {
      setHkAssistantLoaded(true);
    }
  }, [hkAssistantOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setCommandPaletteLoaded(true);
    }
  }, [commandPaletteOpen]);

  // Cmd+K / Ctrl+K to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTabChange = (tabId: string) => {
    const routeMap: Record<string, string> = {
      'hero': '/',
      'sovereign': '/',
      'materials': '/materials',
      'energy': '/energy',
      'manufacturing': '/manufacturing',
      'quantum': '/quantum',
      'applications': '/applications',
      'patents': '/patent-claims',
      'community': '/community',
      'research': '/research',
      'timeline': '/timeline',
      'advanced': '/advanced-features',
      'about': '/',
      
      'search': '/search',
      'gamification': '/gamification',
      'ai-insights': '/ai-insights',
      'api-docs': '/api-docs',
      'true-melange': '/true-melange',
      'queen-califia': '/queen-califia',
      'founder': '/founder',
      'peoples-foundation': '/peoples-foundation',
      'contact': '/contact',
      'mela-nation': '/mela-nation',
      'melanina': '/melanina',
    };
    const route = routeMap[tabId] || '/';
    setLocation(route);
  };

  const getCurrentTab = (): string => {
    if (location === '/') return 'hero';
    if (location === '/materials') return 'materials';
    if (location === '/energy') return 'energy';
    if (location === '/manufacturing') return 'manufacturing';
    if (location === '/quantum') return 'quantum';
    if (location === '/applications') return 'applications';
    if (location === '/community') return 'community';
    if (location === '/research') return 'research';
    if (location === '/timeline') return 'timeline';
    if (location === '/patent-claims') return 'patents';
    if (location === '/advanced-features') return 'advanced';
    if (location === '/search') return 'search';
    if (location === '/gamification') return 'gamification';
    if (location === '/ai-insights') return 'ai-insights';
    return 'hero';
  };

  return (
      <ErrorBoundary>
      <SoundPreferencesProvider>
        <VoicePreferencesProvider>
          <GestureNavigationProvider>
            <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            {/* Command Palette (Cmd+K) */}
            {commandPaletteLoaded && (
              <Suspense fallback={null}>
                <CommandPalette
                  isOpen={commandPaletteOpen}
                  onClose={() => setCommandPaletteOpen(false)}
                />
              </Suspense>
            )}

            {/* Ceremonial intro — plays every visit */}
            {introPhase === 'sovereign' && (
              <CeremonialIntro onComplete={() => setIntroPhase('done')} />
            )}

            {/* Main Content */}
            <>
              <PremiumNavigation
                activeTab={getCurrentTab()}
                onTabChange={handleTabChange}
                isMuted={!audioEnabled}
                onMuteToggle={() => setAudioEnabled(!audioEnabled)}
                onSearchOpen={() => setCommandPaletteOpen(true)}
                sessionId={sessionId}
              />

              <main className="pt-16 min-h-screen bg-background">
                <Router />
              </main>

              {/* Premium Footer */}
              <PremiumFooter />

            {/* Sovereign Audio Engine — synthesized ambient sound */}
            <ScrollProgressIndicator />
              <SovereignAudioEngine enabled={audioEnabled} onToggle={() => setAudioEnabled(a => !a)} />

              {/* H.K. Assistant Button */}
              <motion.button
                onClick={() => setHkAssistantOpen(!hkAssistantOpen)}
                className="fixed bottom-4 left-4 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #B87333)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.5)',
                }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 50px rgba(212,175,55,0.8)' }}
                whileTap={{ scale: 0.9 }}
                title="Open H.K. Assistant"
              >
                <span className="text-xl font-black text-black">◉</span>
              </motion.button>

              {/* H.K. Assistant */}
              {hkAssistantLoaded && (
                <Suspense fallback={null}>
                  <HKAssistant
                    isOpen={hkAssistantOpen}
                    onClose={() => setHkAssistantOpen(false)}
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
