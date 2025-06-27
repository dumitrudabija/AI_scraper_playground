import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/reports', icon: '📰', label: 'Reports' }
  ];

  return (
    <nav className="navigation">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <div className="nav-icon">{item.icon}</div>
          <div className="nav-label">{item.label}</div>
        </Link>
      ))}
    </nav>
  );
}

export default Navigation;
