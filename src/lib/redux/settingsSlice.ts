// lib/store/settingsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { defaultSettings } from '../defaultSettings';
export type SettingsState = typeof defaultSettings

const initialState: SettingsState =defaultSettings;

// Fetch settings from API
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/user/settings', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      if (data.success) return data.settings as SettingsState;
      throw new Error(data.error || 'Unknown error');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Save the entire settings object to the backend
export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async (settings: SettingsState, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      const data = await res.json();
      if (data.success) return data.settings as SettingsState;
      throw new Error(data.error || 'Unknown error');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Set the entire state (used for preloading or after server fetch)
    setSettings(state, action: PayloadAction<SettingsState>) {
      return action.payload;
    },
    // Update a single field (optional – useful for local edits, but we can also just use replaceSettings)
    updateSetting(state, action: PayloadAction<{ key: keyof SettingsState; value: any }>) {
      (state as any)[action.payload.key] = action.payload.value;
    },
    // Replace all settings with a new object (like after user edits)
    replaceSettings(state, action: PayloadAction<SettingsState>) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.fulfilled, (state, action) => action.payload)
      .addCase(saveSettings.fulfilled, (state, action) => action.payload);
  },
});

export const { setSettings, updateSetting, replaceSettings } = settingsSlice.actions;
export default settingsSlice.reducer;