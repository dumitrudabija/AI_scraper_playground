import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { getLatestReport } = useApi();

  useEffect(() => {
    // Check for saved theme preference, default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      updateDocumentTheme(isDark);
    } else {
      // Default to dark mode
      setIsDarkMode(true);
      updateDocumentTheme(true);
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const updateDocumentTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    updateDocumentTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const refreshData = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await getLatestReport();
      // Force a page refresh to show new data
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
    currentScreen,
    setCurrentScreen,
    refreshData,
    isRefreshing
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
