#!/usr/bin/env python3
"""
AI News Scraper - Weekly AI News Report Generator
Scrapes AI news from multiple sources and generates beautiful HTML reports using Anthropic API
Designed to run weekly and collect articles from the past 7 days
"""

import os
import sys
import json
import logging
import requests
import feedparser
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import anthropic

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/ai_news_scraper.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class AINewsWeeklyScraper:
    def __init__(self):
        """Initialize the AI News Scraper with API credentials and configurations."""
        self.anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        if not self.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        
        self.client = anthropic.Anthropic(api_key=self.anthropic_api_key)
        
        # Free AI news sources configuration (no paywalls)
        self.news_sources = {
            'openai_blog': {
                'name': 'OpenAI Blog',
                'rss_url': 'https://openai.com/blog/rss.xml',
                'base_url': 'https://openai.com',
                'color': '#00A67E',
                'category': 'business'
            },
            'anthropic_blog': {
                'name': 'Anthropic Blog',
                'rss_url': 'https://www.anthropic.com/news/rss.xml',
                'base_url': 'https://www.anthropic.com',
                'color': '#D4A574',
                'category': 'business'
            },
            'google_ai_blog': {
                'name': 'Google AI Blog',
                'rss_url': 'https://ai.googleblog.com/feeds/posts/default',
                'base_url': 'https://ai.googleblog.com',
                'color': '#4285F4',
                'category': 'development'
            },
            'arxiv_ai': {
                'name': 'ArXiv AI Papers',
                'rss_url': 'http://export.arxiv.org/rss/cs.AI',
                'base_url': 'https://arxiv.org',
                'color': '#B31B1B',
                'category': 'development'
            },
            'huggingface_blog': {
                'name': 'Hugging Face Blog',
                'rss_url': 'https://huggingface.co/blog/feed.xml',
                'base_url': 'https://huggingface.co',
                'color': '#FF9D00',
                'category': 'development'
            },
            'github_ai_trending': {
                'name': 'GitHub AI Trending',
                'rss_url': 'https://github.com/trending/python.atom',
                'base_url': 'https://github.com',
                'color': '#24292e',
                'category': 'development'
            }
        }
        
        # Additional sources for comprehensive coverage
        self.reddit_sources = {
            'r_MachineLearning': {
                'name': 'r/MachineLearning',
                'url': 'https://www.reddit.com/r/MachineLearning/hot.json',
                'category': 'development'
            },
            'r_LocalLLaMA': {
                'name': 'r/LocalLLaMA', 
                'url': 'https://www.reddit.com/r/LocalLLaMA/hot.json',
                'category': 'development'
            }
        }
        
        # Hacker News AI-related posts
        self.hackernews_api = 'https://hacker-news.firebaseio.com/v0'
        
        # Request headers to avoid blocking
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def scrape_rss_feed(self, source_key: str) -> List[Dict]:
        """Scrape articles from RSS feed for the past week."""
        source = self.news_sources[source_key]
        articles = []
        
        try:
            logger.info(f"Scraping {source['name']} RSS feed...")
            
            # Parse RSS feed
            feed = feedparser.parse(source['rss_url'])
            
            if not feed.entries:
                logger.warning(f"No entries found in {source['name']} RSS feed")
                return articles
            
            # Get articles from the last 7 days for weekly report
            week_ago = datetime.now() - timedelta(days=7)
            
            for entry in feed.entries[:20]:  # Limit to 20 most recent articles per source
                try:
                    # Parse publication date
                    pub_date = None
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        pub_date = datetime(*entry.published_parsed[:6])
                    elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                        pub_date = datetime(*entry.updated_parsed[:6])
                    
                    # Skip old articles (older than 7 days for weekly report)
                    if pub_date and pub_date < week_ago:
                        continue
                    
                    # Extract article information
                    article = {
                        'source': source['name'],
                        'source_color': source['color'],
                        'title': entry.title if hasattr(entry, 'title') else 'No title',
                        'link': entry.link if hasattr(entry, 'link') else '',
                        'description': self._clean_description(entry.summary if hasattr(entry, 'summary') else ''),
                        'pub_date': pub_date.strftime('%Y-%m-%d %H:%M:%S') if pub_date else 'Unknown',
                        'pub_date_formatted': pub_date.strftime('%B %d, %Y at %I:%M %p') if pub_date else 'Unknown',
                        'content': ''
                    }
                    
                    # Try to get full article content
                    if article['link']:
                        article['content'] = self._extract_article_content(article['link'])
                    
                    articles.append(article)
                    logger.info(f"Scraped: {article['title'][:50]}...")
                    
                except Exception as e:
                    logger.error(f"Error processing article from {source['name']}: {str(e)}")
                    continue
            
            logger.info(f"Successfully scraped {len(articles)} articles from {source['name']}")
            
        except Exception as e:
            logger.error(f"Error scraping {source['name']}: {str(e)}")
        
        return articles

    def _clean_description(self, description: str) -> str:
        """Clean HTML tags from description."""
        if not description:
            return ""
        
        soup = BeautifulSoup(description, 'html.parser')
        return soup.get_text().strip()

    def _extract_article_content(self, url: str) -> str:
        """Extract main content from article URL."""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
                element.decompose()
            
            # Try to find main content
            content_selectors = [
                'article',
                '.post-content',
                '.entry-content',
                '.article-content',
                '.content',
                'main'
            ]
            
            content = ""
            for selector in content_selectors:
                content_elem = soup.select_one(selector)
                if content_elem:
                    content = content_elem.get_text().strip()
                    break
            
            if not content:
                # Fallback to body content
                body = soup.find('body')
                if body:
                    content = body.get_text().strip()
            
            # Limit content length
            return content[:2000] if content else ""
            
        except Exception as e:
            logger.warning(f"Could not extract content from {url}: {str(e)}")
            return ""

    def scrape_reddit_posts(self, subreddit_key: str) -> List[Dict]:
        """Scrape posts from Reddit subreddits."""
        source = self.reddit_sources[subreddit_key]
        articles = []
        
        try:
            logger.info(f"Scraping {source['name']} posts...")
            
            response = self.session.get(source['url'], timeout=10)
            response.raise_for_status()
            
            data = response.json()
            posts = data.get('data', {}).get('children', [])
            
            week_ago = datetime.now() - timedelta(days=7)
            
            for post_data in posts[:15]:  # Limit to 15 posts per subreddit
                try:
                    post = post_data.get('data', {})
                    
                    # Skip if not AI-related (basic keyword filter)
                    title = post.get('title', '').lower()
                    ai_keywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'gpt', 'claude', 'openai', 'anthropic', 'model', 'neural', 'deep learning']
                    if not any(keyword in title for keyword in ai_keywords):
                        continue
                    
                    # Parse creation date
                    created_utc = post.get('created_utc', 0)
                    pub_date = datetime.fromtimestamp(created_utc) if created_utc else datetime.now()
                    
                    # Skip old posts
                    if pub_date < week_ago:
                        continue
                    
                    article = {
                        'source': source['name'],
                        'source_color': '#FF4500',  # Reddit orange
                        'title': post.get('title', 'No title'),
                        'link': f"https://reddit.com{post.get('permalink', '')}",
                        'description': post.get('selftext', '')[:300] + '...' if post.get('selftext') else f"Score: {post.get('score', 0)} | Comments: {post.get('num_comments', 0)}",
                        'pub_date': pub_date.strftime('%Y-%m-%d %H:%M:%S'),
                        'pub_date_formatted': pub_date.strftime('%B %d, %Y at %I:%M %p'),
                        'content': post.get('selftext', '')[:500] if post.get('selftext') else '',
                        'category': source['category']
                    }
                    
                    articles.append(article)
                    logger.info(f"Scraped Reddit: {article['title'][:50]}...")
                    
                except Exception as e:
                    logger.error(f"Error processing Reddit post: {str(e)}")
                    continue
            
            logger.info(f"Successfully scraped {len(articles)} posts from {source['name']}")
            
        except Exception as e:
            logger.error(f"Error scraping {source['name']}: {str(e)}")
        
        return articles

    def scrape_hackernews_ai(self) -> List[Dict]:
        """Scrape AI-related posts from Hacker News."""
        articles = []
        
        try:
            logger.info("Scraping Hacker News AI posts...")
            
            # Get top stories
            response = self.session.get(f"{self.hackernews_api}/topstories.json", timeout=10)
            response.raise_for_status()
            
            story_ids = response.json()[:100]  # Get top 100 stories
            week_ago = datetime.now() - timedelta(days=7)
            
            for story_id in story_ids[:30]:  # Process first 30 to find AI-related ones
                try:
                    # Get story details
                    story_response = self.session.get(f"{self.hackernews_api}/item/{story_id}.json", timeout=5)
                    story_response.raise_for_status()
                    
                    story = story_response.json()
                    if not story:
                        continue
                    
                    title = story.get('title', '').lower()
                    # AI keyword filter
                    ai_keywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'gpt', 'claude', 'openai', 'anthropic', 'model', 'neural', 'deep learning', 'chatgpt', 'cursor', 'cline', 'mcp', 'n8n', 'zapier', 'make.com']
                    if not any(keyword in title for keyword in ai_keywords):
                        continue
                    
                    # Parse date
                    timestamp = story.get('time', 0)
                    pub_date = datetime.fromtimestamp(timestamp) if timestamp else datetime.now()
                    
                    # Skip old stories
                    if pub_date < week_ago:
                        continue
                    
                    article = {
                        'source': 'Hacker News',
                        'source_color': '#FF6600',
                        'title': story.get('title', 'No title'),
                        'link': story.get('url', f"https://news.ycombinator.com/item?id={story_id}"),
                        'description': f"Score: {story.get('score', 0)} | Comments: {story.get('descendants', 0)} | {story.get('text', '')[:200]}",
                        'pub_date': pub_date.strftime('%Y-%m-%d %H:%M:%S'),
                        'pub_date_formatted': pub_date.strftime('%B %d, %Y at %I:%M %p'),
                        'content': story.get('text', '')[:500] if story.get('text') else '',
                        'category': 'development'
                    }
                    
                    articles.append(article)
                    logger.info(f"Scraped HN: {article['title'][:50]}...")
                    
                    # Limit to 10 HN articles
                    if len(articles) >= 10:
                        break
                        
                except Exception as e:
                    logger.error(f"Error processing HN story {story_id}: {str(e)}")
                    continue
            
            logger.info(f"Successfully scraped {len(articles)} AI posts from Hacker News")
            
        except Exception as e:
            logger.error(f"Error scraping Hacker News: {str(e)}")
        
        return articles

    def scrape_all_sources(self) -> List[Dict]:
        """Scrape articles from all configured news sources."""
        all_articles = []
        
        # Scrape RSS feeds
        for source_key in self.news_sources.keys():
            try:
                articles = self.scrape_rss_feed(source_key)
                # Add category to articles
                for article in articles:
                    article['category'] = self.news_sources[source_key]['category']
                all_articles.extend(articles)
            except Exception as e:
                logger.error(f"Failed to scrape {source_key}: {str(e)}")
                continue
        
        # Scrape Reddit
        for reddit_key in self.reddit_sources.keys():
            try:
                articles = self.scrape_reddit_posts(reddit_key)
                all_articles.extend(articles)
            except Exception as e:
                logger.error(f"Failed to scrape {reddit_key}: {str(e)}")
                continue
        
        # Scrape Hacker News
        try:
            hn_articles = self.scrape_hackernews_ai()
            all_articles.extend(hn_articles)
        except Exception as e:
            logger.error(f"Failed to scrape Hacker News: {str(e)}")
        
        # Sort articles by publication date (newest first)
        all_articles.sort(key=lambda x: x['pub_date'], reverse=True)
        
        logger.info(f"Total articles scraped: {len(all_articles)}")
        return all_articles

    def summarize_with_anthropic(self, articles: List[Dict]) -> str:
        """Use Anthropic API to summarize the most important AI developments from the week."""
        if not articles:
            return "No articles found to summarize."
        
        try:
            # Prepare articles text for summarization
            articles_text = ""
            for i, article in enumerate(articles[:30], 1):  # Limit to 30 articles for weekly summary
                articles_text += f"\n{i}. **{article['title']}** ({article['source']})\n"
                articles_text += f"   {article['description']}\n"
                if article['content']:
                    articles_text += f"   Content preview: {article['content'][:300]}...\n"
                articles_text += f"   Published: {article['pub_date']}\n"
                articles_text += f"   Link: {article['link']}\n"
            
            prompt = f"""Please analyze the following AI news articles from the past week and create a comprehensive weekly summary report structured into exactly 2 main sections:

SECTION 1: AI BUSINESS NEWS
Focus on:
- Funding rounds, acquisitions, partnerships
- Company announcements and strategy changes  
- Market trends and adoption rates
- Enterprise AI implementations
- Regulatory and policy developments

SECTION 2: AI SOFTWARE DEVELOPMENT ECOSYSTEM
Focus specifically on:
- AI orchestration tools and platforms
- Model Context Protocol (MCP) developments
- n8n, Make.com, Zapier AI integrations
- AI coding assistants (Cursor, Cline, Lovable, etc.)
- AI-powered development workflows
- New AI APIs and developer tools
- Agent frameworks and automation platforms

Here are the articles from this week:
{articles_text}

Please provide a well-structured weekly summary organized into these 2 sections. Prioritize development ecosystem news that's most relevant to building AI-powered applications. Include specific details and maintain journalistic objectivity."""

            logger.info("Generating weekly summary with Anthropic API...")
            
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2500,
                temperature=0.3,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            summary = message.content[0].text
            logger.info("Weekly summary generated successfully")
            return summary
            
        except Exception as e:
            logger.error(f"Error generating summary with Anthropic: {str(e)}")
            return f"Error generating summary: {str(e)}"

    def generate_html_report(self, articles: List[Dict], summary: str) -> str:
        """Generate a beautiful HTML weekly report with articles and summary."""
        report_date = datetime.now().strftime('%Y-%m-%d')
        report_time = datetime.now().strftime('%B %d, %Y at %I:%M %p')
        week_start = (datetime.now() - timedelta(days=7)).strftime('%B %d')
        week_end = datetime.now().strftime('%B %d, %Y')
        
        # Count articles by source
        source_counts = {}
        for article in articles:
            source = article['source']
            source_counts[source] = source_counts.get(source, 0) + 1
        
        html_report = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI News Weekly Report - {report_date}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }}
        
        .header .date {{
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 10px;
        }}
        
        .header .week-range {{
            font-size: 1em;
            opacity: 0.8;
            margin-bottom: 20px;
        }}
        
        .stats {{
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
        }}
        
        .stat {{
            text-align: center;
        }}
        
        .stat-number {{
            font-size: 2em;
            font-weight: bold;
            display: block;
        }}
        
        .stat-label {{
            font-size: 0.9em;
            opacity: 0.8;
        }}
        
        .content {{
            padding: 40px;
        }}
        
        .summary {{
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 40px;
            border-left: 5px solid #007bff;
        }}
        
        .summary h2 {{
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.8em;
        }}
        
        .summary-content {{
            font-size: 1.1em;
            line-height: 1.8;
            white-space: pre-line;
        }}
        
        .articles-section h2 {{
            color: #2c3e50;
            margin-bottom: 30px;
            font-size: 1.8em;
            text-align: center;
        }}
        
        .source-section {{
            margin-bottom: 40px;
        }}
        
        .source-header {{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 10px;
            background: #f8f9fa;
        }}
        
        .source-dot {{
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 15px;
        }}
        
        .source-name {{
            font-size: 1.3em;
            font-weight: 600;
            color: #2c3e50;
        }}
        
        .source-count {{
            margin-left: auto;
            background: #007bff;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9em;
        }}
        
        .article {{
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.07);
            border: 1px solid #e9ecef;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }}
        
        .article:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }}
        
        .article-title {{
            font-size: 1.3em;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 10px;
            line-height: 1.4;
        }}
        
        .article-title a {{
            color: inherit;
            text-decoration: none;
        }}
        
        .article-title a:hover {{
            color: #007bff;
        }}
        
        .article-meta {{
            color: #6c757d;
            font-size: 0.9em;
            margin-bottom: 15px;
        }}
        
        .article-description {{
            color: #495057;
            line-height: 1.6;
            margin-bottom: 15px;
        }}
        
        .read-more {{
            display: inline-block;
            color: #007bff;
            text-decoration: none;
            font-weight: 500;
            padding: 8px 16px;
            border: 2px solid #007bff;
            border-radius: 25px;
            transition: all 0.2s ease;
        }}
        
        .read-more:hover {{
            background: #007bff;
            color: white;
        }}
        
        .footer {{
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }}
        
        .footer-info {{
            margin-bottom: 10px;
        }}
        
        .generated-time {{
            font-size: 0.9em;
            opacity: 0.8;
        }}
        
        @media (max-width: 768px) {{
            .container {{
                margin: 10px;
                border-radius: 15px;
            }}
            
            .header {{
                padding: 30px 20px;
            }}
            
            .header h1 {{
                font-size: 2em;
            }}
            
            .stats {{
                flex-direction: column;
                gap: 15px;
            }}
            
            .content {{
                padding: 20px;
            }}
            
            .summary {{
                padding: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI News Weekly Report</h1>
            <div class="date">{report_time}</div>
            <div class="week-range">Week of {week_start} - {week_end}</div>
            <div class="stats">
                <div class="stat">
                    <span class="stat-number">{len(articles)}</span>
                    <span class="stat-label">Articles</span>
                </div>
                <div class="stat">
                    <span class="stat-number">{len(source_counts)}</span>
                    <span class="stat-label">Sources</span>
                </div>
            </div>
        </div>
        
        <div class="content">
            <div class="summary">
                <h2>📊 Weekly Executive Summary</h2>
                <div class="summary-content">{summary}</div>
            </div>
            
            <div class="articles-section">
                <h2>📰 This Week's Articles</h2>
"""
        
        # Group articles by source
        articles_by_source = {}
        for article in articles:
            source = article['source']
            if source not in articles_by_source:
                articles_by_source[source] = []
            articles_by_source[source].append(article)
        
        # Add articles grouped by source
        for source, source_articles in articles_by_source.items():
            source_color = source_articles[0]['source_color']
            html_report += f"""
                <div class="source-section">
                    <div class="source-header">
                        <div class="source-dot" style="background-color: {source_color};"></div>
                        <div class="source-name">{source}</div>
                        <div class="source-count">{len(source_articles)} articles</div>
                    </div>
"""
            
            for article in source_articles:
                html_report += f"""
                    <div class="article">
                        <div class="article-title">
                            <a href="{article['link']}" target="_blank" rel="noopener noreferrer">{article['title']}</a>
                        </div>
                        <div class="article-meta">
                            Published: {article['pub_date_formatted']} | Source: <a href="{article['link']}" target="_blank" rel="noopener noreferrer">{article['source']}</a>
                        </div>
                        <div class="article-description">
                            {article['description']}
                        </div>
                        <a href="{article['link']}" target="_blank" rel="noopener noreferrer" class="read-more">Read Full Article →</a>
                    </div>
"""
            
            html_report += "</div>"
        
        html_report += f"""
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-info">
                <strong>Weekly Report Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            </div>
            <div class="generated-time">
                Total articles processed: {len(articles)} | Sources: {', '.join(source_counts.keys())} | Coverage: {week_start} - {week_end}
            </div>
        </div>
    </div>
</body>
</html>"""
        
        return html_report

    def save_report(self, report: str) -> str:
        """Save the HTML weekly report to a file with date."""
        try:
            # Create reports directory if it doesn't exist
            reports_dir = "reports"
            os.makedirs(reports_dir, exist_ok=True)
            
            # Generate filename with date for weekly report
            report_date = datetime.now().strftime('%Y-%m-%d')
            filename = f"{reports_dir}/ai_news_weekly_report_{report_date}.html"
            
            # Save report
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(report)
            
            logger.info(f"Weekly report saved to {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error saving report: {str(e)}")
            raise

    def save_report_json(self, articles: List[Dict], summary: str) -> str:
        """Save report as JSON for API consumption."""
        try:
            # Create reports directory if it doesn't exist
            reports_dir = "reports"
            os.makedirs(reports_dir, exist_ok=True)
            
            # Generate report data
            report_date = datetime.now().strftime('%Y-%m-%d')
            report_data = {
                'generated_at': datetime.now().isoformat(),
                'date': report_date,
                'type': 'weekly',
                'summary': summary,
                'articles': articles,
                'stats': {
                    'total_articles': len(articles),
                    'sources': list(set(a['source'] for a in articles)),
                    'source_counts': {}
                }
            }
            
            # Calculate source counts
            for article in articles:
                source = article['source']
                report_data['stats']['source_counts'][source] = report_data['stats']['source_counts'].get(source, 0) + 1
            
            # Generate filename
            filename = f"{reports_dir}/ai_news_weekly_report_{report_date}.json"
            
            # Save JSON report
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(report_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Weekly JSON report saved to {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error saving JSON report: {str(e)}")
            raise

    def run_weekly_scrape(self) -> str:
        """Run the complete weekly scraping and reporting process."""
        try:
            logger.info("Starting weekly AI news scraping...")
            
            # Create logs directory if it doesn't exist
            os.makedirs("logs", exist_ok=True)
            
            # Scrape articles from all sources
            articles = self.scrape_all_sources()
            
            if not articles:
                logger.warning("No articles found")
                return "No articles found to process"
            
            # Generate summary using Anthropic
            summary = self.summarize_with_anthropic(articles)
            
            # Generate beautiful HTML report
            report = self.generate_html_report(articles, summary)
            
            # Save HTML report to file
            html_filename = self.save_report(report)
            
            # Save JSON report for API consumption
            json_filename = self.save_report_json(articles, summary)
            
            logger.info(f"Weekly scraping completed successfully. HTML: {html_filename}, JSON: {json_filename}")
            return html_filename
            
        except Exception as e:
            logger.error(f"Error in weekly scraping process: {str(e)}")
            raise

def main():
    """Main function to run the AI news weekly scraper."""
    try:
        scraper = AINewsWeeklyScraper()
        report_file = scraper.run_weekly_scrape()
        print(f"✅ AI News weekly report generated successfully: {report_file}")
        print(f"🌐 Open the report in your browser to view: open {report_file}")
        
    except ValueError as e:
        print(f"❌ Configuration error: {e}")
        print("Please make sure you have created a .env file with your ANTHROPIC_API_KEY")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Error running AI news weekly scraper: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
