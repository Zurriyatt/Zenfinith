// components/SettingsProvider.tsx
'use client';
import { Provider } from 'react-redux';
import { useEffect, useRef } from 'react';
import ThemeApplier from './themeApplier';
import { makeStore,AppStore } from '@/lib/redux/store';
import { setSettings,fetchSettings } from '@/lib/redux/settingsSlice';
import type { SettingsState } from '@/lib/redux/settingsSlice';

export default function SettingsProvider({
  children,
  preloadedSettings,
}: {
  children: React.ReactNode;
  preloadedSettings?: SettingsState;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(
      preloadedSettings ? { settings: preloadedSettings } : undefined
    );
  }

  useEffect(() => {
    // If we didn't get preloaded settings, fetch them now
    if (!preloadedSettings) {
      storeRef.current?.dispatch(fetchSettings());
    }
  }, [preloadedSettings]);

  return <Provider store={storeRef.current}>
    <ThemeApplier/>
    {children}</Provider>;
}