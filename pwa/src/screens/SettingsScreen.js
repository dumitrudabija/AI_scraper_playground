import React, { useState } from 'react';

function SettingsScreen() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoRefresh: true,
    refreshInterval: '1hour'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };


  return (
    <div className="screen">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">⚙️ Settings</h2>
        </div>
        <p className="card-subtitle">Customize your AI news experience</p>
      </div>

      {/* Appearance Settings */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🎨 Appearance</h3>
        </div>
        
        <div className="setting-item">
          <label className="setting-label">
            <span>Theme</span>
            <select 
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="setting-select"
            >
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="auto">🔄 Auto</option>
            </select>
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🔔 Notifications</h3>
        </div>
        
        <div className="setting-item">
          <label className="setting-label">
            <span>Push Notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              className="setting-checkbox"
            />
          </label>
          <p className="setting-description">
            Get notified about breaking AI news and daily summaries
          </p>
        </div>
      </div>

      {/* Refresh Settings */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🔄 Auto Refresh</h3>
        </div>
        
        <div className="setting-item">
          <label className="setting-label">
            <span>Auto Refresh</span>
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
              className="setting-checkbox"
            />
          </label>
        </div>
        
        {settings.autoRefresh && (
          <div className="setting-item">
            <label className="setting-label">
              <span>Refresh Interval</span>
              <select 
                value={settings.refreshInterval}
                onChange={(e) => handleSettingChange('refreshInterval', e.target.value)}
                className="setting-select"
              >
                <option value="30min">Every 30 minutes</option>
                <option value="1hour">Every hour</option>
                <option value="2hours">Every 2 hours</option>
                <option value="6hours">Every 6 hours</option>
              </select>
            </label>
          </div>
        )}
      </div>


      {/* Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">� Actions</h3>
        </div>
        
        <div className="flex flex-column" style={{ gap: '1rem' }}>
          <button className="btn">
            💾 Save Settings
          </button>
          <button className="btn btn-secondary">
            🔄 Reset to Defaults
          </button>
          <button className="btn btn-secondary">
            📤 Export Settings
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">ℹ️ About</h3>
        </div>
        
        <div className="app-info">
          <p><strong>AI News Scraper PWA</strong></p>
          <p>Version: 1.0.0</p>
          <p>Sources: 11+ AI news sources</p>
          <p>Last Updated: Today</p>
        </div>
      </div>
    </div>
  );
}

export default SettingsScreen;
