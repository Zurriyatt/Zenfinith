import { configureStore } from '@reduxjs/toolkit';
import { defaultSettings } from '../defaultSettings';
import settingsReducer, { type SettingsState } from './settingsSlice';

export const makeStore = (preloadedSettings?: { settings?: SettingsState }) => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: preloadedSettings?.settings ?? defaultSettings,
    },
  });
};

// Types remain the same
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;