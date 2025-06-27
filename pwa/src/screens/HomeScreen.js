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
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-12 lg:py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
          <span className="text-white text-3xl">🤖</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to AI News
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Your intelligent companion for staying updated with the latest developments in artificial intelligence, 
          machine learning, and emerging technologies.
        </p>
        
        <button
          onClick={() => setCurrentScreen('reports')}
          className="btn btn-primary px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span className="mr-2">📊</span>
          View Latest Reports
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center lg:col-span-3 mb-4">
          Why Choose AI News?
        </h2>
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="card card-hover p-8 text-center animate-slide-up"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="text-5xl mb-6">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources Section */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
          📡 Trusted Sources
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          We aggregate news from the most reputable AI research institutions and publications
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sources.map((source, index) => (
            <div 
              key={index}
              className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: source.color }}
              ></div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {source.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {source.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="card p-8 text-center bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Ready to explore the latest in AI?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Discover breaking news, research papers, and industry insights all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setCurrentScreen('reports')}
            className="btn btn-primary px-8 py-3 font-medium text-lg"
          >
            <span className="mr-2">📊</span>
            View Reports
          </button>
          <button
            onClick={() => window.open('https://github.com/dumitrudabija/AI_scraper_playground', '_blank')}
            className="btn btn-secondary px-8 py-3 font-medium text-lg"
          >
            <span className="mr-2">⭐</span>
            Star on GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
