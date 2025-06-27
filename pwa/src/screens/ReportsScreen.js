import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';

function ReportsScreen() {
  const { getLatestReport } = useApi();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [summary, setSummary] = useState(null);

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
          setSummary({
            totalArticles: reportData.data.total_articles,
            sourcesCount: reportData.data.sources_count,
            lastUpdated: reportData.data.generated_at
          });
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
      <div className="space-y animate-fade-in">
        <div className="card card-body-lg text-center">
          <div className="loading-spinner mb-lg" style={{ margin: '0 auto' }}></div>
          <h2 className="text-xl font-semibold text-primary mb-sm">
            Loading latest AI news...
          </h2>
          <p className="text-secondary">
            Fetching fresh articles from our sources
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y animate-fade-in">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-md">
          📊 AI News Reports
        </h1>
        <p className="text-lg text-secondary">
          Latest artificial intelligence news and insights from trusted sources
        </p>
      </header>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="card card-body text-center">
            <div className="text-4xl font-bold text-blue mb-sm">
              {summary.totalArticles}
            </div>
            <div className="text-sm font-medium text-primary mb-sm">Articles</div>
            <div className="text-xs text-muted">Fresh content</div>
          </div>
          
          <div className="card card-body text-center">
            <div className="text-4xl font-bold text-blue mb-sm">
              {summary.sourcesCount}
            </div>
            <div className="text-sm font-medium text-primary mb-sm">Sources</div>
            <div className="text-xs text-muted">Active feeds</div>
          </div>
          
          <div className="card card-body text-center">
            <div className="text-4xl font-bold text-blue mb-sm">
              ⚡
            </div>
            <div className="text-sm font-medium text-primary mb-sm">Live</div>
            <div className="text-xs text-muted">Real-time updates</div>
          </div>
        </div>
      )}

      {/* Last Updated Info */}
      {summary && (
        <div className="card card-body">
          <div className="flex items-center justify-center gap-sm text-sm text-muted">
            <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Last updated: {new Date(summary.lastUpdated).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card card-body">
        <div className="filter-tabs">
          {categories.map((category) => (
            <button
              key={category.key}
              className={`filter-tab ${filter === category.key ? 'active' : ''}`}
              onClick={() => setFilter(category.key)}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            Showing {filteredArticles.length} articles
            {filter !== 'all' && ` in ${categories.find(c => c.key === filter)?.label}`}
          </span>
          <span className="flex items-center gap-sm">
            <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
            </svg>
            <span>Click to read full article</span>
          </span>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1">
        {filteredArticles.map((article, index) => (
          <div 
            key={article.id} 
            className="card card-hover card-body article-card animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => window.open(article.link, '_blank')}
          >
            <div className="flex items-start gap-md">
              {/* Source Indicator */}
              <div className="flex-shrink-0" style={{ paddingTop: '0.25rem' }}>
                <div 
                  className="source-indicator"
                  style={{ backgroundColor: article.sourceColor }}
                ></div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="article-meta">
                  <div className="article-source">
                    <span className="text-sm font-medium text-secondary">
                      {article.source}
                    </span>
                    <span className={`badge ${
                      article.category === 'business' 
                        ? 'badge-business'
                        : 'badge-development'
                    }`}>
                      {article.category === 'business' ? '💼' : '⚡'} {article.category}
                    </span>
                  </div>
                  <span className="text-xs text-muted">
                    {article.time}
                  </span>
                </div>
                
                <h3 className="article-title">
                  {article.title}
                </h3>
                
                <p className="article-description">
                  {article.description}
                </p>
                
                {/* Read More Indicator */}
                <div className="read-more">
                  <span>Read full article</span>
                  <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="card card-body-lg text-center">
          <div className="text-muted mb-lg">
            <svg style={{ width: '5rem', height: '5rem', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-sm">
            No articles found
          </h3>
          <p className="text-muted mb-lg">
            No articles match the selected filter. Try selecting a different category.
          </p>
          <button
            onClick={() => setFilter('all')}
            className="btn btn-primary"
          >
            Show All Articles
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportsScreen;
