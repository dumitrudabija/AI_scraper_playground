import React, { useState, useEffect } from 'react';

function HomeScreen() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    sources: 0,
    lastUpdated: 'Loading...'
  });

  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalArticles: 42,
        sources: 11,
        lastUpdated: 'Today at 5:00 AM'
      });
      
      setLatestNews([
        {
          id: 1,
          title: 'OpenAI Announces New GPT Model',
          source: 'OpenAI Blog',
          time: '2 hours ago',
          description: 'Latest developments in AI language models...'
        },
        {
          id: 2,
          title: 'Anthropic Releases Claude 3.5 Sonnet',
          source: 'Anthropic Blog',
          time: '4 hours ago',
          description: 'Enhanced reasoning capabilities and performance...'
        },
        {
          id: 3,
          title: 'Google AI Research Breakthrough',
          source: 'Google AI Blog',
          time: '6 hours ago',
          description: 'New advances in machine learning efficiency...'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="screen">
        <div className="card">
          <div className="loading-spinner"></div>
          <p>Loading latest AI news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Today's Summary</h2>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.totalArticles}</span>
            <span className="stat-label">Articles</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.sources}</span>
            <span className="stat-label">Sources</span>
          </div>
        </div>
        
        <p className="card-subtitle">Last updated: {stats.lastUpdated}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔥 Latest Headlines</h2>
        </div>
        
        {latestNews.map((article) => (
          <div key={article.id} className="article">
            <div className="article-header">
              <span className="article-source">{article.source}</span>
              <span className="article-date">{article.time}</span>
            </div>
            <h3 className="article-title">{article.title}</h3>
            <p className="article-description">{article.description}</p>
            <div className="article-actions">
              <button className="btn btn-small">Read More</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🚀 Quick Actions</h2>
        </div>
        <div className="flex flex-wrap" style={{ gap: '1rem' }}>
          <button className="btn">🔄 Refresh News</button>
          <button className="btn btn-secondary">📰 View All Reports</button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
