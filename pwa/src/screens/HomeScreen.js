import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';

function HomeScreen() {
  const { getLatestReport } = useApi();
  const [stats, setStats] = useState({
    totalArticles: 0,
    sources: 0,
    lastUpdated: 'Loading...'
  });

  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const reportData = await getLatestReport();
      
      if (reportData && reportData.data && reportData.data.articles) {
        const data = reportData.data;
        // Update stats from API data
        setStats({
          totalArticles: data.articles.length,
          sources: data.sources_count || data.sources?.length || 5,
          lastUpdated: data.generated_at ? 
            new Date(data.generated_at).toLocaleString() : 
            'Today at 5:00 AM',
          sourcesList: data.sources || []
        });
        
        // Get first 10 articles for latest news
        const latestArticles = data.articles.slice(0, 10).map((article, index) => ({
          id: index + 1,
          title: article.title,
          source: article.source,
          time: article.pub_date ? 
            new Date(article.pub_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
            'Recently',
          description: article.description || 'No description available',
          link: article.link
        }));
        
        setLatestNews(latestArticles);
      } else {
        throw new Error('No data received from API');
      }
    } catch (err) {
      console.error('Failed to fetch latest report:', err);
      // Show error state - no fallback data
      setStats({
        totalArticles: 0,
        sources: 0,
        lastUpdated: 'Error loading data'
      });
      
      setLatestNews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getLatestReport]);

  const handleRefresh = async () => {
    await fetchData();
  };

  const handleReadMore = (link) => {
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        
        {stats.sourcesList && stats.sourcesList.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <strong>Active Sources:</strong>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {stats.sourcesList.map((source, index) => (
                <span 
                  key={index}
                  style={{
                    backgroundColor: source.color || '#666',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  {source.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">� Latest Headlines</h2>
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
              <button 
                className="btn btn-small"
                onClick={() => handleReadMore(article.link)}
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">�🚀 Quick Actions</h2>
        </div>
        <div className="flex flex-wrap" style={{ gap: '1rem' }}>
          <button 
            className="btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh News'}
          </button>
          <button className="btn btn-secondary">📰 View All Reports</button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
