import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Trigger a page reload to refresh all data
      window.location.reload();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <header className="header">
      <h1>🤖 AI News</h1>
      <div className="header-actions">
        <button 
          className="header-button" 
          onClick={handleRefresh}
          title="Refresh News"
          disabled={refreshing}
        >
          {refreshing ? '⏳' : '🔄'}
        </button>
        <button 
          className="header-button" 
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;
