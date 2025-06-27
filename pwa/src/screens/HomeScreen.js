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
    { name: 'ArXiv AI Papers', color: '#B31B1B' },
    { name: 'TechCrunch AI', color: '#00D100' },
    { name: 'MIT Technology Review', color: '#A31621' },
    { name: 'Wired AI', color: '#000000' },
    { name: 'Hugging Face Blog', color: '#FF9D00' },
    { name: 'Google AI Blog', color: '#4285F4' },
    { name: 'AI News', color: '#FF5722' },
    { name: 'Anthropic Blog', color: '#D4A574' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="card p-8 text-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white text-3xl">🤖</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to AI News
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Your intelligent companion for staying updated with the latest developments in artificial intelligence, 
          machine learning, and emerging technologies.
        </p>
        
        <button
          onClick={() => setCurrentScreen('reports')}
          className="btn btn-primary px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span className="mr-2">📊</span>
          View Latest Reports
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="card card-hover p-6 text-center animate-slide-up"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Sources Section */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          📡 Trusted Sources
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          We aggregate news from the most reputable AI research institutions and publications
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sources.map((source, index) => (
            <div 
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: source.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {source.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">10+</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Sources</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Updates</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">AI</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Enhanced</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">PWA</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Ready</div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card p-8 text-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Ready to explore the latest in AI?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Discover breaking news, research papers, and industry insights all in one place.
        </p>
        <button
          onClick={() => setCurrentScreen('reports')}
          className="btn btn-primary px-6 py-2 font-medium"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;
