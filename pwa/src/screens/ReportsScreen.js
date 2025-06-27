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
      <div className="space-y-6 animate-fade-in">
        <div className="card p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading latest AI news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Card */}
      {summary && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              📊 Today's Summary
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {summary.totalArticles}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {summary.sourcesCount}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Sources</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Last updated: {new Date(summary.lastUpdated).toLocaleString()}
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.key}
              className={`btn px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === category.key
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
              onClick={() => setFilter(category.key)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredArticles.length} articles
          {filter !== 'all' && ` in ${categories.find(c => c.key === filter)?.label}`}
        </p>
      </div>

      {/* Articles */}
      <div className="space-y-4">
        {filteredArticles.map((article, index) => (
          <div 
            key={article.id} 
            className="card card-hover p-6 animate-slide-up cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => window.open(article.link, '_blank')}
          >
            <div className="flex items-start space-x-4">
              {/* Source Indicator */}
              <div 
                className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: article.sourceColor }}
              ></div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {article.source}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {article.time}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {article.description}
                </p>
                
                {/* Category Badge */}
                <div className="mt-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    article.category === 'business' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {article.category === 'business' ? '💼' : '⚡'} {article.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="card p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No articles found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}

export default ReportsScreen;
