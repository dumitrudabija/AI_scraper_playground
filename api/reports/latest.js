// Import the scraping functions from the optimized scraper
async function scrapeAINews() {
  console.log('Scraping AI news sources...');
  
  // Complete source list matching the settings screen
  const allSources = [
    {
      name: 'OpenAI Blog',
      url: 'https://openai.com/blog/rss.xml',
      color: '#00A67E',
      category: 'business'
    },
    {
      name: 'Anthropic Blog',
      url: 'https://www.anthropic.com/news/rss.xml',
      color: '#D4A574',
      category: 'business'
    },
    {
      name: 'Google AI Blog',
      url: 'https://ai.googleblog.com/feeds/posts/default',
      color: '#4285F4',
      category: 'development'
    },
    {
      name: 'ArXiv AI Papers',
      url: 'http://export.arxiv.org/rss/cs.AI',
      color: '#B31B1B',
      category: 'development'
    },
    {
      name: 'Hugging Face Blog',
      url: 'https://huggingface.co/blog/feed.xml',
      color: '#FF9D00',
      category: 'development'
    },
    {
      name: 'GitHub AI Trending',
      url: 'https://github.com/trending/machine-learning.atom',
      color: '#24292e',
      category: 'development'
    },
    {
      name: 'TechCrunch AI',
      url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
      color: '#00D100',
      category: 'business'
    },
    {
      name: 'VentureBeat AI',
      url: 'https://venturebeat.com/ai/feed/',
      color: '#1E88E5',
      category: 'business'
    },
    {
      name: 'Hacker News',
      url: 'https://hnrss.org/newest?q=AI+OR+artificial+intelligence+OR+machine+learning',
      color: '#FF6600',
      category: 'business'
    },
    {
      name: 'r/MachineLearning',
      url: 'https://www.reddit.com/r/MachineLearning/.rss',
      color: '#FF4500',
      category: 'development'
    },
    {
      name: 'r/LocalLLaMA',
      url: 'https://www.reddit.com/r/LocalLLaMA/.rss',
      color: '#FF4500',
      category: 'development'
    }
  ];

  // Use reliable, fast sources - expanded list
  const reliableSources = [
    'TechCrunch AI', 'VentureBeat AI', 'Google AI Blog', 'OpenAI Blog', 'Anthropic Blog'
  ];

  // Filter sources based on reliable list
  const sources = allSources.filter(source => reliableSources.includes(source.name));

  const articles = [];
  
  for (const source of sources) {
    try {
      console.log(`Scraping ${source.name}...`);
      const sourceArticles = await scrapeRSSFeed(source);
      articles.push(...sourceArticles);
      console.log(`Found ${sourceArticles.length} articles from ${source.name}`);
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error.message);
    }
  }

  if (articles.length === 0) {
    console.log('No articles scraped, generating sample data...');
    return generateSampleArticles();
  }

  articles.sort((a, b) => new Date(b.pub_date) - new Date(a.pub_date));
  return articles.slice(0, 20);
}

async function scrapeRSSFeed(source) {
  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-News-Scraper/1.0)'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xmlText = await response.text();
    const articles = parseRSSFeed(xmlText, source);
    return articles;
    
  } catch (error) {
    console.error(`Failed to scrape ${source.name}:`, error.message);
    return [];
  }
}

function parseRSSFeed(xmlText, source) {
  const articles = [];
  
  try {
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const items = xmlText.match(itemRegex) || [];
    
    for (const item of items.slice(0, 5)) {
      let title = extractXMLTag(item, 'title');
      const link = extractXMLTag(item, 'link');
      let description = extractXMLTag(item, 'description');
      const pubDate = extractXMLTag(item, 'pubDate');
      
      // Skip articles with empty or URL-like titles
      if (!title || title.trim() === '' || title.startsWith('http')) {
        continue;
      }
      
      // Skip articles with no description either
      if (!description || description.trim() === '') {
        continue;
      }
      
      if (title && link && title.trim() !== '') {
        articles.push({
          source: source.name,
          source_color: source.color,
          title: cleanText(title),
          link: link.trim(),
          description: cleanText(description).substring(0, 200),
          pub_date: parsePubDate(pubDate),
          category: source.category
        });
      }
    }
  } catch (error) {
    console.error(`Error parsing RSS for ${source.name}:`, error.message);
  }
  
  return articles;
}

function extractXMLTag(xml, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : '';
}

function cleanText(text) {
  if (!text) return '';
  
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePubDate(dateStr) {
  if (!dateStr) return new Date().toISOString();
  
  try {
    const date = new Date(dateStr);
    return date.toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

function generateSampleArticles() {
  const now = new Date();
  const sources = [
    { name: 'TechCrunch AI', color: '#00D100', category: 'business' },
    { name: 'VentureBeat AI', color: '#1E88E5', category: 'business' },
    { name: 'MIT Technology Review', color: '#FF6B6B', category: 'development' },
    { name: 'AI News', color: '#4ECDC4', category: 'business' },
    { name: 'The Verge AI', color: '#FA7268', category: 'business' }
  ];

  const sampleTitles = [
    'New AI Model Achieves Breakthrough in Natural Language Understanding',
    'Machine Learning Advances in Computer Vision Applications',
    'AI Safety Research: Latest Developments and Challenges',
    'Large Language Models: Performance and Efficiency Improvements',
    'AI in Healthcare: Revolutionary Applications and Case Studies',
    'Robotics and AI Integration: Future Possibilities',
    'Neural Network Architecture Innovations',
    'AI Ethics and Responsible Development Practices',
    'Automated Code Generation: Tools and Techniques',
    'AI-Powered Data Analysis: New Methodologies'
  ];

  return sampleTitles.map((title, index) => {
    const source = sources[index % sources.length];
    const hoursAgo = Math.floor(Math.random() * 48) + 1;
    const pubDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    return {
      source: source.name,
      source_color: source.color,
      title: title,
      link: `https://example.com/article-${index + 1}`,
      description: `Latest developments in AI technology and research. This article covers recent advances and their implications for the future of artificial intelligence.`,
      pub_date: pubDate.toISOString(),
      category: source.category
    };
  });
}

async function enhanceWithAI(articles) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  
  if (!ANTHROPIC_API_KEY) {
    console.log('No Anthropic API key found, skipping AI enhancement');
    return articles;
  }

  try {
    console.log('🤖 Enhancing articles with AI summaries...');
    
    // Process articles in batches to avoid rate limits
    const enhancedArticles = [];
    const batchSize = 5;
    
    for (let i = 0; i < Math.min(articles.length, 15); i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      
      for (const article of batch) {
        try {
          const summary = await generateAISummary(article, ANTHROPIC_API_KEY);
          enhancedArticles.push({
            ...article,
            ai_summary: summary,
            description: summary || article.description
          });
        } catch (error) {
          console.error(`Failed to enhance article: ${article.title}`, error.message);
          enhancedArticles.push(article); // Keep original if AI fails
        }
      }
      
      // Small delay between batches
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Add remaining articles without AI enhancement if we hit the limit
    if (articles.length > 15) {
      enhancedArticles.push(...articles.slice(15));
    }
    
    console.log(`✅ Enhanced ${enhancedArticles.filter(a => a.ai_summary).length} articles with AI summaries`);
    return enhancedArticles;
    
  } catch (error) {
    console.error('Error in AI enhancement:', error);
    return articles; // Return original articles if AI fails
  }
}

async function generateAISummary(article, apiKey) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: `Create a very short, catchy phrase (5-8 words max) that captures the essence of this AI news:

Title: ${article.title}
Description: ${article.description}

Return only the phrase, nothing else. Examples: "New AI model beats GPT-4", "Meta acquires voice AI startup", "AI safety breakthrough announced"`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text.trim();
    
  } catch (error) {
    console.error('Failed to generate AI summary:', error);
    return null;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔄 Generating fresh AI news report...');
    
    // Generate fresh data directly (no file system dependency)
    const rawArticles = await scrapeAINews();
    
    // Enable AI enhancement with short phrases
    const articles = await enhanceWithAI(rawArticles);
    
    // Calculate source statistics
    const sourceStats = {};
    for (const article of articles) {
      const source = article.source;
      const color = article.source_color;
      if (!sourceStats[source]) {
        sourceStats[source] = { name: source, count: 0, color: color };
      }
      sourceStats[source].count++;
    }

    const reportData = {
      report_date: new Date().toISOString().split('T')[0],
      generated_at: new Date().toISOString(),
      total_articles: articles.length,
      sources_count: new Set(articles.map(a => a.source)).size,
      articles: articles,
      sources: Object.values(sourceStats),
      ai_enhanced: articles.filter(a => a.ai_summary).length
    };
    
    console.log(`✅ Generated report with ${articles.length} articles from ${reportData.sources_count} sources (${reportData.ai_enhanced} AI-enhanced)`);
    
    res.json({
      success: true,
      data: reportData
    });
    
  } catch (error) {
    console.error('Error generating fresh report:', error);
    res.status(500).json({ 
      error: 'Failed to generate fresh report',
      message: error.message 
    });
  }
}
