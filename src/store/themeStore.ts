import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    () => ({
      isDarkMode: true,
    }),
    {
      name: 'theme-storage',
    }
  )
);