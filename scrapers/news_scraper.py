#!/usr/bin/env python3
"""
AI News Scraper - Daily AI News Report Generator
Scrapes AI news from multiple sources and generates summarized reports using Anthropic API
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
        logging.FileHandler('ai_news_scraper.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class AINewsScraper:
    def __init__(self):
        """Initialize the AI News Scraper with API credentials and configurations."""
        self.anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        if not self.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        
        self.client = anthropic.Anthropic(api_key=self.anthropic_api_key)
        
        # Comprehensive AI news sources configuration (8+ sources for daily coverage)
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
            },
            'techcrunch_ai': {
                'name': 'TechCrunch AI',
                'rss_url': 'https://techcrunch.com/category/artificial-intelligence/feed/',
                'base_url': 'https://techcrunch.com',
                'color': '#00D100',
                'category': 'business'
            },
            'venturebeat_ai': {
                'name': 'VentureBeat AI',
                'rss_url': 'https://venturebeat.com/ai/feed/',
                'base_url': 'https://venturebeat.com',
                'color': '#1E88E5',
                'category': 'business'
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
        """Scrape articles from RSS feed."""
        source = self.news_sources[source_key]
        articles = []
        
        try:
            logger.info(f"Scraping {source['name']} RSS feed...")
            
            # Parse RSS feed
            feed = feedparser.parse(source['rss_url'])
            
            if not feed.entries:
                logger.warning(f"No entries found in {source['name']} RSS feed")
                return articles
            
            # Get articles from the last 24 hours
            yesterday = datetime.now() - timedelta(days=1)
            
            for entry in feed.entries[:10]:  # Limit to 10 most recent articles
                try:
                    # Parse publication date
                    pub_date = None
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        pub_date = datetime(*entry.published_parsed[:6])
                    elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                        pub_date = datetime(*entry.updated_parsed[:6])
                    
                    # Skip old articles (older than 7 days)
                    if pub_date and pub_date < (datetime.now() - timedelta(days=7)):
                        continue
                    
                    # Extract article information
                    article = {
                        'source': source['name'],
                        'title': entry.title if hasattr(entry, 'title') else 'No title',
                        'link': entry.link if hasattr(entry, 'link') else '',
                        'description': self._clean_description(entry.summary if hasattr(entry, 'summary') else ''),
                        'pub_date': pub_date.strftime('%Y-%m-%d %H:%M:%S') if pub_date else 'Unknown',
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
            
            yesterday = datetime.now() - timedelta(days=1)
            
            for post_data in posts[:10]:  # Limit to 10 posts per subreddit
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
                    
                    # Skip old posts (older than 24 hours for daily)
                    if pub_date < yesterday:
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
            
            story_ids = response.json()[:50]  # Get top 50 stories
            yesterday = datetime.now() - timedelta(days=1)
            
            for story_id in story_ids[:20]:  # Process first 20 to find AI-related ones
                try:
                    # Get story details
                    story_response = self.session.get(f"{self.hackernews_api}/item/{story_id}.json", timeout=5)
                    story_response.raise_for_status()
                    
                    story = story_response.json()
                    if not story:
                        continue
                    
                    title = story.get('title', '').lower()
                    # AI keyword filter
                    ai_keywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'gpt', 'claude', 'openai', 'anthropic', 'model', 'neural', 'deep learning', 'chatgpt', 'cursor', 'cline', 'mcp']
                    if not any(keyword in title for keyword in ai_keywords):
                        continue
                    
                    # Parse date
                    timestamp = story.get('time', 0)
                    pub_date = datetime.fromtimestamp(timestamp) if timestamp else datetime.now()
                    
                    # Skip old stories (older than 24 hours for daily)
                    if pub_date < yesterday:
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
                    
                    # Limit to 5 HN articles for daily
                    if len(articles) >= 5:
                        break
                        
                except Exception as e:
                    logger.error(f"Error processing HN story {story_id}: {str(e)}")
                    continue
            
            logger.info(f"Successfully scraped {len(articles)} AI posts from Hacker News")
            
        except Exception as e:
            logger.error(f"Error scraping Hacker News: {str(e)}")
        
        return articles

    def scrape_all_sources(self) -> List[Dict]:
        """Scrape articles from all configured news sources (8+ sources)."""
        all_articles = []
        
        # Scrape RSS feeds (8 sources)
        for source_key in self.news_sources.keys():
            try:
                articles = self.scrape_rss_feed(source_key)
                # Add category and color to articles
                for article in articles:
                    article['category'] = self.news_sources[source_key]['category']
                    article['source_color'] = self.news_sources[source_key]['color']
                all_articles.extend(articles)
            except Exception as e:
                logger.error(f"Failed to scrape {source_key}: {str(e)}")
                continue
        
        # Scrape Reddit (2 additional sources)
        for reddit_key in self.reddit_sources.keys():
            try:
                articles = self.scrape_reddit_posts(reddit_key)
                all_articles.extend(articles)
            except Exception as e:
                logger.error(f"Failed to scrape {reddit_key}: {str(e)}")
                continue
        
        # Scrape Hacker News (1 additional source)
        try:
            hn_articles = self.scrape_hackernews_ai()
            all_articles.extend(hn_articles)
        except Exception as e:
            logger.error(f"Failed to scrape Hacker News: {str(e)}")
        
        # Sort articles by publication date (newest first)
        all_articles.sort(key=lambda x: x['pub_date'], reverse=True)
        
        logger.info(f"Total articles scraped from 11+ sources: {len(all_articles)}")
        return all_articles

    def summarize_with_anthropic(self, articles: List[Dict]) -> str:
        """Use Anthropic API to summarize the most important AI developments."""
        if not articles:
            return "No articles found to summarize."
        
        try:
            # Prepare articles text for summarization
            articles_text = ""
            for i, article in enumerate(articles[:20], 1):  # Limit to 20 articles
                articles_text += f"\n{i}. **{article['title']}** ({article['source']})\n"
                articles_text += f"   {article['description']}\n"
                if article['content']:
                    articles_text += f"   Content preview: {article['content'][:300]}...\n"
                articles_text += f"   Published: {article['pub_date']}\n"
                articles_text += f"   Link: {article['link']}\n"
            
            prompt = f"""Please analyze the following AI news articles and create a comprehensive summary report. Focus on:

1. The most significant AI developments and breakthroughs
2. Key trends and patterns across the articles
3. Important company announcements or product launches
4. Research developments and their potential impact
5. Regulatory or policy changes affecting AI

Here are the articles:
{articles_text}

Please provide a well-structured summary that highlights the most important developments, organized by themes or categories. Include specific details and maintain journalistic objectivity."""

            logger.info("Generating summary with Anthropic API...")
            
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                temperature=0.3,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            summary = message.content[0].text
            logger.info("Summary generated successfully")
            return summary
            
        except Exception as e:
            logger.error(f"Error generating summary with Anthropic: {str(e)}")
            return f"Error generating summary: {str(e)}"

    def generate_report(self, articles: List[Dict], summary: str) -> str:
        """Generate a formatted report with articles and summary."""
        report_date = datetime.now().strftime('%Y-%m-%d')
        
        report = f"""# AI News Daily Report - {report_date}

## Executive Summary
{summary}

## Detailed Articles ({len(articles)} total)

"""
        
        # Group articles by source
        articles_by_source = {}
        for article in articles:
            source = article['source']
            if source not in articles_by_source:
                articles_by_source[source] = []
            articles_by_source[source].append(article)
        
        for source, source_articles in articles_by_source.items():
            report += f"### {source} ({len(source_articles)} articles)\n\n"
            
            for article in source_articles:
                report += f"**{article['title']}**\n"
                report += f"*Published: {article['pub_date']}*\n"
                report += f"{article['description']}\n"
                report += f"[Read more]({article['link']})\n\n"
        
        report += f"""
---
*Report generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
*Total articles processed: {len(articles)}*
"""
        
        return report

    def save_report(self, report: str) -> str:
        """Save the report to a file with today's date."""
        try:
            # Create reports directory if it doesn't exist
            reports_dir = "reports"
            os.makedirs(reports_dir, exist_ok=True)
            
            # Generate filename with date
            report_date = datetime.now().strftime('%Y-%m-%d')
            filename = f"{reports_dir}/ai_news_report_{report_date}.md"
            
            # Save report
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(report)
            
            logger.info(f"Report saved to {filename}")
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
                'type': 'daily',
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
            filename = f"{reports_dir}/ai_news_report_{report_date}.json"
            
            # Save JSON report
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(report_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Daily JSON report saved to {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error saving JSON report: {str(e)}")
            raise

    def run_daily_scrape(self) -> str:
        """Run the complete daily scraping and reporting process."""
        try:
            logger.info("Starting daily AI news scraping...")
            
            # Scrape articles from all sources
            articles = self.scrape_all_sources()
            
            if not articles:
                logger.warning("No articles found")
                return "No articles found to process"
            
            # Generate summary using Anthropic
            summary = self.summarize_with_anthropic(articles)
            
            # Generate formatted report
            report = self.generate_report(articles, summary)
            
            # Save markdown report to file
            md_filename = self.save_report(report)
            
            # Save JSON report for API consumption
            json_filename = self.save_report_json(articles, summary)
            
            logger.info(f"Daily scraping completed successfully. Markdown: {md_filename}, JSON: {json_filename}")
            return md_filename
            
        except Exception as e:
            logger.error(f"Error in daily scraping process: {str(e)}")
            raise

def main():
    """Main function to run the AI news scraper."""
    try:
        scraper = AINewsScraper()
        report_file = scraper.run_daily_scrape()
        print(f"✅ AI News report generated successfully: {report_file}")
        
    except ValueError as e:
        print(f"❌ Configuration error: {e}")
        print("Please make sure you have created a .env file with your ANTHROPIC_API_KEY")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Error running AI news scraper: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
