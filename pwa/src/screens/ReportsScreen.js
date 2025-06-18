import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';

function ReportsScreen() {
  const { getLatestReport } = useApi();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const reportData = await getLatestReport();
        
        if (reportData && reportData.data && reportData.data.articles) {
          const apiArticles = reportData.data.articles.map((article, index) => ({
            id: index + 1,
            title: article.title,
            source: article.source,
            sourceColor: article.source_color || '#666666',
            category: article.category || 'development',
            time: article.pub_date_formatted || article.pub_date || 'Recently',
            description: article.description || article.content?.substring(0, 200) + '...' || 'No description available',
            link: article.link
          }));
          
          setArticles(apiArticles);
        } else {
          // Fallback to mock data if API fails
          setArticles([
            {
              id: 1,
              title: 'OpenAI Announces New GPT Model with Enhanced Capabilities',
              source: 'OpenAI Blog',
              sourceColor: '#00A67E',
              category: 'business',
              time: '2 hours ago',
              description: 'OpenAI has unveiled their latest language model featuring improved reasoning, coding abilities, and multimodal understanding.',
              link: 'https://openai.com/blog/new-gpt-model'
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        // Use fallback mock data on error
        setArticles([
          {
            id: 1,
            title: 'OpenAI Announces New GPT Model with Enhanced Capabilities',
            source: 'OpenAI Blog',
            sourceColor: '#00A67E',
            category: 'business',
            time: '2 hours ago',
            description: 'OpenAI has unveiled their latest language model featuring improved reasoning, coding abilities, and multimodal understanding.',
            link: 'https://openai.com/blog/new-gpt-model'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [getLatestReport]);

  const filteredArticles = articles.filter(article => 
    filter === 'all' || article.category === filter
  );

  const categories = [
    { key: 'all', label: 'All', icon: '📰' },
    { key: 'business', label: 'Business', icon: '💼' },
    { key: 'development', label: 'Development', icon: '⚡' }
  ];

  if (loading) {
    return (
      <div className="screen">
        <div className="card">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📰 AI News Reports</h2>
        </div>
        
        <div className="flex flex-wrap mb-2" style={{ gap: '0.5rem' }}>
          {categories.map((category) => (
            <button
              key={category.key}
              className={`btn btn-small ${filter === category.key ? '' : 'btn-secondary'}`}
              onClick={() => setFilter(category.key)}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
        
        <p className="card-subtitle">
          Showing {filteredArticles.length} articles
          {filter !== 'all' && ` in ${categories.find(c => c.key === filter)?.label}`}
        </p>
      </div>

      {filteredArticles.map((article) => (
        <div key={article.id} className="card">
          <div className="article">
            <div className="article-header">
              <div 
                className="source-dot" 
                style={{ backgroundColor: article.sourceColor }}
              ></div>
              <span className="article-source">{article.source}</span>
              <span className="article-date">{article.time}</span>
            </div>
            
            <h3 className="article-title">{article.title}</h3>
            <p className="article-description">{article.description}</p>
            
            <div className="article-actions">
              <button 
                className="btn btn-small"
                onClick={() => window.open(article.link, '_blank')}
              >
                📖 Read Full Article
              </button>
              <button className="btn btn-small btn-secondary">
                📤 Share
              </button>
            </div>
          </div>
        </div>
      ))}

      {filteredArticles.length === 0 && (
        <div className="card text-center">
          <p>No articles found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}

export default ReportsScreen;
