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
            'Today at 5:00 AM'
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
        // Fallback to mock data if API fails
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
            description: 'Latest developments in AI language models...',
            link: 'https://openai.com'
          },
          {
            id: 2,
            title: 'Anthropic Releases Claude 3.5 Sonnet',
            source: 'Anthropic Blog',
            time: '4 hours ago',
            description: 'Enhanced reasoning capabilities and performance...',
            link: 'https://anthropic.com'
          },
          {
            id: 3,
            title: 'Google AI Research Breakthrough',
            source: 'Google AI Blog',
            time: '6 hours ago',
            description: 'New advances in machine learning efficiency...',
            link: 'https://ai.googleblog.com'
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch latest report:', err);
      // Use fallback mock data on error
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
          description: 'Latest developments in AI language models...',
          link: 'https://openai.com'
        }
      ]);
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
          <h2 className="card-title">🚀 Quick Actions</h2>
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
