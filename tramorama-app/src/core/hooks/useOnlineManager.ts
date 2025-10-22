import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { AppState } from 'react-native';

let onlineListenerAttached = false;

export const useOnlineManager = () => {
  useEffect(() => {
    if (onlineListenerAttached) {
      return;
    }

    onlineListenerAttached = true;

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
      onlineManager.setOnline(isOnline);
    });

    return () => {
      unsubscribe();
      onlineListenerAttached = false;
    };
  }, []);
};

export const useAppFocusManager = () => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);
};
