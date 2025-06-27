import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoadingScreen from './components/LoadingScreen';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { ApiProvider } from './contexts/ApiContext';

function App() {
  // Force deployment refresh - v2.1
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <ApiProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/reports" element={<ReportsScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
              </Routes>
            </main>
            <Navigation />
          </div>
        </Router>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
