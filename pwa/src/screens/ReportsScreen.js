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
      <div className="space-y-8 animate-fade-in">
        <div className="card p-12 text-center">
          <div className="loading-spinner mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading latest AI news...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching fresh articles from our sources
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          📊 AI News Reports
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Latest artificial intelligence news and insights from trusted sources
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {summary.totalArticles}
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Articles</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Fresh content</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {summary.sourcesCount}
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Sources</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Active feeds</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              ⚡
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Live</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Real-time updates</div>
          </div>
        </div>
      )}

      {/* Last Updated Info */}
      {summary && (
        <div className="card p-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Last updated: {new Date(summary.lastUpdated).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card p-6">
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category.key}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === category.key
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setFilter(category.key)}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {filteredArticles.length} articles
            {filter !== 'all' && ` in ${categories.find(c => c.key === filter)?.label}`}
          </span>
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
            </svg>
            <span>Click to read full article</span>
          </span>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6">
        {filteredArticles.map((article, index) => (
          <div 
            key={article.id} 
            className="card card-hover p-6 animate-slide-up cursor-pointer group"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => window.open(article.link, '_blank')}
          >
            <div className="flex items-start space-x-4">
              {/* Source Indicator */}
              <div className="flex-shrink-0 pt-1">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: article.sourceColor }}
                ></div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {article.source}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.category === 'business' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {article.category === 'business' ? '💼' : '⚡'} {article.category}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 flex-shrink-0">
                    {article.time}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {article.description}
                </p>
                
                {/* Read More Indicator */}
                <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>Read full article</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="card p-12 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No articles found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            No articles match the selected filter. Try selecting a different category.
          </p>
          <button
            onClick={() => setFilter('all')}
            className="btn btn-primary px-6 py-2"
          >
            Show All Articles
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportsScreen;
