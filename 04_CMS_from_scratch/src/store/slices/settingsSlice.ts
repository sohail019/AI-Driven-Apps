import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface SettingsState {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  language: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
  };
}

const initialState: SettingsState = {
  theme: "system",
  sidebarCollapsed: false,
  language: "en",
  notifications: {
    enabled: true,
    sound: true,
  },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarState: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications.enabled = action.payload;
    },
    toggleNotificationSound: (state, action: PayloadAction<boolean>) => {
      state.notifications.sound = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarState,
  setLanguage,
  toggleNotifications,
  toggleNotificationSound,
} = settingsSlice.actions;

export default settingsSlice.reducer;
