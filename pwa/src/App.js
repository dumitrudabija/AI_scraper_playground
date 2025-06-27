import React, { useEffect } from 'react';
import { ApiProvider } from './contexts/ApiContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';

function AppContent() {
  const { currentScreen } = useTheme();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="pb-20">
          {renderScreen()}
        </main>
        <Navigation />
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Set dark theme as default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeProvider>
      <ApiProvider>
        <AppContent />
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
