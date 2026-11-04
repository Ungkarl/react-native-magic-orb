import { useSyncExternalStore } from 'react';
import { AppState } from 'react-native';

function subscribe(onChange: () => void) {
  const subscription = AppState.addEventListener('change', onChange);
  return () => subscription.remove();
}

function getSnapshot() {
  // 'unknown' happens briefly at startup on iOS; treat it as active so the orb starts.
  return AppState.currentState !== 'background';
}

/** True while the app is in the foreground. */
export function useAppActive() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
