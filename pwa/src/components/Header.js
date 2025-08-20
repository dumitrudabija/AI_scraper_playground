import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Header() {
  const { isDarkMode, toggleTheme, currentScreen, setCurrentScreen } = useTheme();

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'reports', label: 'Reports', icon: '📊' }
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo and Title */}
          <div className="logo">
            <div className="logo-icon">
              🤖
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                AI News
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Latest AI insights
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav nav-desktop">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-icon"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ width: '1.25rem', height: '1.25rem' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ width: '1.25rem', height: '1.25rem' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
