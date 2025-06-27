import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function HomeScreen() {
  const { setCurrentScreen } = useTheme();

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Insights',
      description: 'Get intelligent summaries and analysis of the latest AI developments from trusted sources.'
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Stay current with live RSS feeds from 10+ major AI news sources and research publications.'
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      description: 'Enjoy a seamless experience across all devices with our progressive web app.'
    }
  ];

  const sources = [
    { name: 'ArXiv AI Papers', color: '#B31B1B', category: 'Research' },
    { name: 'TechCrunch AI', color: '#00D100', category: 'News' },
    { name: 'MIT Technology Review', color: '#A31621', category: 'Analysis' },
    { name: 'Wired AI', color: '#000000', category: 'Tech' },
    { name: 'Hugging Face Blog', color: '#FF9D00', category: 'Community' },
    { name: 'Google AI Blog', color: '#4285F4', category: 'Industry' },
    { name: 'AI News', color: '#FF5722', category: 'News' },
    { name: 'Anthropic Blog', color: '#D4A574', category: 'Research' }
  ];

  const stats = [
    { label: 'Sources', value: '10+', icon: '📡' },
    { label: 'Updates', value: '24/7', icon: '🔄' },
    { label: 'AI Enhanced', value: '100%', icon: '🤖' },
    { label: 'PWA Ready', value: '✓', icon: '📱' }
  ];

  return (
    <div className="space-y animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-icon">
          <span>🤖</span>
        </div>
        
        <h1 className="hero-title">
          Welcome to AI News
        </h1>
        
        <p className="hero-description">
          Your intelligent companion for staying updated with the latest developments in artificial intelligence, 
          machine learning, and emerging technologies.
        </p>
        
        <button
          onClick={() => setCurrentScreen('reports')}
          className="btn btn-primary btn-lg"
        >
          <span>📊</span>
          <span>View Latest Reports</span>
        </button>
      </section>

      {/* Features Grid */}
      <section className="card card-body-lg">
        <h2 className="text-3xl font-bold text-primary text-center mb-2xl">
          Why Choose AI News?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card card-hover card-body text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-3xl mb-lg">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-md">
                {feature.title}
              </h3>
              <p className="text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="card card-body-lg">
        <h2 className="text-2xl font-bold text-primary text-center mb-xl">
          Platform Statistics
        </h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sources Section */}
      <section className="card card-body-lg">
        <h2 className="text-2xl font-bold text-primary text-center mb-lg">
          📡 Trusted Sources
        </h2>
        
        <p className="text-secondary text-center mb-xl">
          We aggregate news from the most reputable AI research institutions and publications
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {sources.map((source, index) => (
            <div 
              key={index}
              className="flex items-center gap-md p-md transition card-hover animate-slide-up"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <div 
                className="source-indicator"
                style={{ backgroundColor: source.color }}
              ></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-primary">
                  {source.name}
                </div>
                <div className="text-xs text-muted">
                  {source.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="card card-body-lg text-center" style={{
        background: 'linear-gradient(135deg, var(--color-primary-light), rgba(59, 130, 246, 0.05))',
        borderColor: 'var(--color-primary)'
      }}>
        <h3 className="text-2xl font-semibold text-primary mb-md">
          Ready to explore the latest in AI?
        </h3>
        <p className="text-secondary mb-xl text-lg">
          Discover breaking news, research papers, and industry insights all in one place.
        </p>
        <div className="flex flex-col gap-md justify-center" style={{ gap: 'var(--spacing-md)' }}>
          <button
            onClick={() => setCurrentScreen('reports')}
            className="btn btn-primary btn-lg"
          >
            <span>📊</span>
            <span>View Reports</span>
          </button>
          <button
            onClick={() => window.open('https://github.com/dumitrudabija/AI_scraper_playground', '_blank')}
            className="btn btn-secondary btn-lg"
          >
            <span>⭐</span>
            <span>Star on GitHub</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomeScreen;
