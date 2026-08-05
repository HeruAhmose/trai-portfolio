import { useEffect, useCallback } from 'react';
import { useRouter } from 'wouter';
import { analyticsService } from '@/services/analytics';
import { useUserPreferences } from './useUserPreferences';

/**
 * Hook for seamless navigation with analytics tracking
 * Integrates project detail routes, voice commands, and preferences
 */
export const useSeamlessNavigation = () => {
  const [location, navigate] = useRouter() as any;
  const { preferences, addToVisitHistory } = useUserPreferences();

  // Track page views
  useEffect(() => {
    analyticsService.trackPageView(location, document.referrer);
  }, [location]);

  // Navigate to project detail with tracking
  const navigateToProject = useCallback(
    (projectId: string, source: string = 'direct') => {
      analyticsService.trackProjectVisit(projectId, source);
      addToVisitHistory(projectId);
      navigate(`/project/${projectId}`);
    },
    [navigate, addToVisitHistory]
  );

  // Navigate to home
  const navigateHome = useCallback(() => {
    analyticsService.trackPageView('/');
    navigate('/');
  }, [navigate]);

  // Navigate to admin dashboard
  const navigateToAdmin = useCallback(() => {
    analyticsService.trackPageView('/admin');
    navigate('/admin');
  }, [navigate]);

  // Handle voice command navigation
  const handleVoiceCommand = useCallback(
    (command: string) => {
      const startTime = Date.now();
      let success = false;

      try {
        switch (command) {
          case 'next':
            navigateToProject('materials', 'voice');
            success = true;
            break;
          case 'prev':
            navigateToProject('cybersecurity', 'voice');
            success = true;
            break;
          case 'home':
            navigateHome();
            success = true;
            break;
          case 'admin':
            navigateToAdmin();
            success = true;
            break;
          default:
            success = false;
        }

        const duration = Date.now() - startTime;
        analyticsService.trackVoiceCommand(command, success, duration);
      } catch (error) {
        analyticsService.trackError('voice_navigation_error', String(error));
      }
    },
    [navigateToProject, navigateHome, navigateToAdmin]
  );

  // Handle preference-based navigation
  const navigateWithPreferences = useCallback(
    (projectId: string) => {
      const startTime = Date.now();

      // Apply animation preferences
      if (preferences.animationIntensity === 'low') {
        // Reduced animations
      } else if (preferences.animationIntensity === 'high') {
        // Full animations
      }

      // Track 3D interaction if enabled
      if (preferences.enable3D) {
        const duration = Date.now() - startTime;
        analyticsService.track3DInteraction(projectId, 'navigate', duration);
      }

      navigateToProject(projectId, 'preferences');
    },
    [preferences, navigateToProject]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'h':
            e.preventDefault();
            navigateHome();
            break;
          case 'a':
            e.preventDefault();
            navigateToAdmin();
            break;
          case 'n':
            e.preventDefault();
            navigateToProject('materials', 'keyboard');
            break;
          case 'p':
            e.preventDefault();
            navigateToProject('cybersecurity', 'keyboard');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigateHome, navigateToAdmin, navigateToProject]);

  return {
    currentLocation: location,
    navigateToProject,
    navigateHome,
    navigateToAdmin,
    handleVoiceCommand,
    navigateWithPreferences,
  };
};
