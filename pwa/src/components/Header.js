import React from 'react';

function Header() {
  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refresh triggered');
  };

  const toggleTheme = () => {
    // TODO: Implement theme toggle
    console.log('Theme toggle triggered');
  };

  return (
    <header className="header">
      <h1>🤖 AI News</h1>
      <div className="header-actions">
        <button 
          className="header-button" 
          onClick={handleRefresh}
          title="Refresh News"
        >
          🔄
        </button>
        <button 
          className="header-button" 
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          🌙
        </button>
      </div>
    </header>
  );
}

export default Header;
