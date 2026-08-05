import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { GestureType } from '@/hooks/useGestureRecognition';

interface GestureAction {
  gesture: GestureType;
  route?: string;
  action?: () => void;
  label: string;
}

interface GestureNavigationContextType {
  gestureActions: Map<GestureType, GestureAction>;
  registerGestureAction: (gesture: GestureType, action: GestureAction) => void;
  unregisterGestureAction: (gesture: GestureType) => void;
  executeGestureAction: (gesture: GestureType) => void;
  currentRoute: string;
}

const GestureNavigationContext = createContext<GestureNavigationContextType | undefined>(undefined);

export const GestureNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, navigate] = useLocation();
  const [gestureActions, setGestureActions] = useState<Map<GestureType, GestureAction>>(
    new Map([
      [
        'swipe_left',
        {
          gesture: 'swipe_left',
          label: 'Previous Section',
          action: () => navigate('/'),
        },
      ],
      [
        'swipe_right',
        {
          gesture: 'swipe_right',
          label: 'Next Section',
          action: () => navigate('/quantum'),
        },
      ],
      [
        'peace_sign',
        {
          gesture: 'peace_sign',
          label: 'Go Home',
          action: () => navigate('/'),
        },
      ],
      [
        'thumbs_up',
        {
          gesture: 'thumbs_up',
          label: 'Like',
          action: () => console.log('Liked!'),
        },
      ],
      [
        'thumbs_down',
        {
          gesture: 'thumbs_down',
          label: 'Dislike',
          action: () => console.log('Disliked!'),
        },
      ],
      [
        'ok_sign',
        {
          gesture: 'ok_sign',
          label: 'Confirm',
          action: () => console.log('Confirmed!'),
        },
      ],
      [
        'point_forward',
        {
          gesture: 'point_forward',
          label: 'Select',
          action: () => console.log('Selected!'),
        },
      ],
      [
        'palm_open',
        {
          gesture: 'palm_open',
          label: 'Stop',
          action: () => console.log('Stopped!'),
        },
      ],
      [
        'fist',
        {
          gesture: 'fist',
          label: 'Menu',
          action: () => navigate('/'),
        },
      ],
    ])
  );

  const registerGestureAction = useCallback((gesture: GestureType, action: GestureAction) => {
    setGestureActions((prev) => new Map(prev).set(gesture, action));
  }, []);

  const unregisterGestureAction = useCallback((gesture: GestureType) => {
    setGestureActions((prev) => {
      const newMap = new Map(prev);
      newMap.delete(gesture);
      return newMap;
    });
  }, []);

  const executeGestureAction = useCallback(
    (gesture: GestureType) => {
      const action = gestureActions.get(gesture);
      if (action) {
        if (action.route) {
          navigate(action.route);
        } else if (action.action) {
          action.action();
        }
      }
    },
    [gestureActions, navigate]
  );

  return (
    <GestureNavigationContext.Provider
      value={{
        gestureActions,
        registerGestureAction,
        unregisterGestureAction,
        executeGestureAction,
        currentRoute: location,
      }}
    >
      {children}
    </GestureNavigationContext.Provider>
  );
};

export const useGestureNavigation = () => {
  const context = useContext(GestureNavigationContext);
  if (!context) {
    throw new Error('useGestureNavigation must be used within GestureNavigationProvider');
  }
  return context;
};
