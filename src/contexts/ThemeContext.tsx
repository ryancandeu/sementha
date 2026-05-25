import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, sharedTheme } from '../theme';

interface ThemeContextData {
  theme: any;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem('@sementha:theme');
        if (savedTheme === 'dark') {
          setIsDarkMode(true);
        }
      } catch (error) {
        console.log("Erro ao carregar o tema", error);
      } finally {
        setIsThemeLoaded(true);
      }
    }
    loadTheme();
  }, []);

  async function toggleTheme() {
    const newThemeMode = !isDarkMode;
    setIsDarkMode(newThemeMode);
    await AsyncStorage.setItem('@sementha:theme', newThemeMode ? 'dark' : 'light');
  }

  const currentTheme = {
    colors: isDarkMode ? darkColors : lightColors,
    ...sharedTheme
  };

  if (!isThemeLoaded) {
    return null; 
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}