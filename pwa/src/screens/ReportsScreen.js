import React, { useState, useEffect } from 'react';

function ReportsScreen() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // TODO: Replace with actual API call
    // Simulate loading articles
    setTimeout(() => {
      setArticles([
        {
          id: 1,
          title: 'OpenAI Announces New GPT Model with Enhanced Capabilities',
          source: 'OpenAI Blog',
          sourceColor: '#00A67E',
          category: 'business',
          time: '2 hours ago',
          description: 'OpenAI has unveiled their latest language model featuring improved reasoning, coding abilities, and multimodal understanding. The new model shows significant improvements in mathematical problem-solving and code generation.',
          link: 'https://openai.com/blog/new-gpt-model'
        },
        {
          id: 2,
          title: 'Anthropic Releases Claude 3.5 Sonnet with Advanced Reasoning',
          source: 'Anthropic Blog',
          sourceColor: '#D4A574',
          category: 'business',
          time: '4 hours ago',
          description: 'Claude 3.5 Sonnet demonstrates enhanced reasoning capabilities and improved performance across various benchmarks. The model excels in complex analysis and nuanced understanding.',
          link: 'https://anthropic.com/news/claude-3-5-sonnet'
        },
        {
          id: 3,
          title: 'Google AI Research: Breakthrough in Neural Architecture Search',
          source: 'Google AI Blog',
          sourceColor: '#4285F4',
          category: 'development',
          time: '6 hours ago',
          description: 'Researchers at Google AI have developed a new approach to neural architecture search that reduces computational costs by 90% while maintaining model performance.',
          link: 'https://ai.googleblog.com/neural-architecture-search'
        },
        {
          id: 4,
          title: 'Hugging Face Introduces New Model Hub Features',
          source: 'Hugging Face Blog',
          sourceColor: '#FF9D00',
          category: 'development',
          time: '8 hours ago',
          description: 'The popular ML platform adds collaborative features, improved model versioning, and enhanced deployment options for the AI community.',
          link: 'https://huggingface.co/blog/new-hub-features'
        },
        {
          id: 5,
          title: 'ArXiv: Novel Approach to Few-Shot Learning',
          source: 'ArXiv AI Papers',
          sourceColor: '#B31B1B',
          category: 'development',
          time: '12 hours ago',
          description: 'Researchers propose a new meta-learning algorithm that achieves state-of-the-art results in few-shot classification tasks across multiple domains.',
          link: 'https://arxiv.org/abs/2024.12345'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

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
