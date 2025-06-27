import React, { useEffect } from 'react';
import { ApiProvider } from './contexts/ApiContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import ReportsScreen from './screens/ReportsScreen';

function AppContent() {
  const { currentScreen, isDarkMode } = useTheme();

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'reports':
        return <ReportsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ApiProvider>
        <AppContent />
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
