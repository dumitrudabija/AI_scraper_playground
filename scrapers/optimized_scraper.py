#!/usr/bin/env python3
"""
Optimized AI News Scraper for Vercel - Handles timeout constraints
Supports chunked processing, parallel execution, and quick modes
"""

import os
import sys
import json
import logging
import asyncio
import aiohttp
import feedparser
import argparse
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
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
        logging.FileHandler('optimized_scraper.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class OptimizedAINewsScraper:
    def __init__(self):
        """Initialize the optimized scraper with timeout-friendly configurations."""
        self.anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        self.client = anthropic.Anthropic(api_key=self.anthropic_api_key) if self.anthropic_api_key else None
        
        # Source configurations organized by processing speed
        self.source_chunks = {
            1: {  # Fast RSS feeds (15-20 seconds)
                'openai_blog': {
                    'name': 'OpenAI Blog',
                    'rss_url': 'https://openai.com/blog/rss.xml',
                    'color': '#00A67E',
                    'category': 'business'
                },
                'anthropic_blog': {
                    'name': 'Anthropic Blog',
                    'rss_url': 'https://www.anthropic.com/news/rss.xml',
                    'color': '#D4A574',
                    'category': 'business'
                },
                'google_ai_blog': {
                    'name': 'Google AI Blog',
                    'rss_url': 'https://ai.googleblog.com/feeds/posts/default',
                    'color': '#4285F4',
                    'category': 'development'
                },
                'arxiv_ai': {
                    'name': 'ArXiv AI Papers',
                    'rss_url': 'http://export.arxiv.org/rss/cs.AI',
                    'color': '#B31B1B',
                    'category': 'development'
                }
            },
            2: {  # Social sources (20-25 seconds)
                'reddit_ml': {
                    'name': 'r/MachineLearning',
                    'url': 'https://www.reddit.com/r/MachineLearning/hot.json',
                    'color': '#FF4500',
                    'category': 'development',
                    'type': 'reddit'
                },
                'reddit_localllama': {
                    'name': 'r/LocalLLaMA',
                    'url': 'https://www.reddit.com/r/LocalLLaMA/hot.json',
                    'color': '#FF4500',
                    'category': 'development',
                    'type': 'reddit'
                },
                'hackernews_ai': {
                    'name': 'Hacker News AI',
                    'url': 'https://hacker-news.firebaseio.com/v0/topstories.json',
                    'color': '#FF6600',
                    'category': 'development',
                    'type': 'hackernews'
                }
            },
            3: {  # News sources (25-30 seconds)
                'techcrunch_ai': {
                    'name': 'TechCrunch AI',
                    'rss_url': 'https://techcrunch.com/category/artificial-intelligence/feed/',
                    'color': '#00D100',
                    'category': 'business'
                },
                'venturebeat_ai': {
                    'name': 'VentureBeat AI',
                    'rss_url': 'https://venturebeat.com/ai/feed/',
                    'color': '#1E88E5',
                    'category': 'business'
                },
                'huggingface_blog': {
                    'name': 'Hugging Face Blog',
                    'rss_url': 'https://huggingface.co/blog/feed.xml',
                    'color': '#FF9D00',
                    'category': 'development'
                },
                'github_ai_trending': {
                    'name': 'GitHub AI Trending',
                    'rss_url': 'https://github.com/trending/python.atom',
                    'color': '#24292e',
                    'category': 'development'
                }
            }
        }
        
        # Request configuration for speed
        self.timeout = aiohttp.ClientTimeout(total=5, connect=2)  # Aggressive timeouts
        self.max_articles_per_source = 5  # Limit articles for speed
        self.max_concurrent = 10  # Parallel processing limit

    async def scrape_rss_source_async(self, session, source_key, source_config):
        """Asynchronously scrape a single RSS source."""
        articles = []
        
        try:
            logger.info(f"Scraping {source_config['name']}...")
            
            # Use feedparser for RSS (it's faster than aiohttp for RSS)
            feed = feedparser.parse(source_config['rss_url'])
            
            if not feed.entries:
                logger.warning(f"No entries in {source_config['name']}")
                return articles
            
            # Process only recent articles (last 3 days for speed)
            cutoff_date = datetime.now() - timedelta(days=3)
            
            for entry in feed.entries[:self.max_articles_per_source]:
                try:
                    # Parse date quickly
                    pub_date = None
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        pub_date = datetime(*entry.published_parsed[:6])
                    
                    # Skip old articles
                    if pub_date and pub_date < cutoff_date:
                        continue
                    
                    article = {
                        'source': source_config['name'],
                        'source_color': source_config['color'],
                        'title': getattr(entry, 'title', 'No title'),
                        'link': getattr(entry, 'link', ''),
                        'description': self._clean_description(getattr(entry, 'summary', '')),
                        'pub_date': pub_date.isoformat() if pub_date else datetime.now().isoformat(),
                        'category': source_config['category']
                    }
                    
                    articles.append(article)
                    
                except Exception as e:
                    logger.error(f"Error processing article from {source_config['name']}: {e}")
                    continue
            
            logger.info(f"Scraped {len(articles)} articles from {source_config['name']}")
            
        except Exception as e:
            logger.error(f"Error scraping {source_config['name']}: {e}")
        
        return articles

    async def scrape_reddit_async(self, session, source_key, source_config):
        """Asynchronously scrape Reddit posts."""
        articles = []
        
        try:
            logger.info(f"Scraping {source_config['name']}...")
            
            async with session.get(source_config['url']) as response:
                if response.status != 200:
                    logger.error(f"Reddit API error: {response.status}")
                    return articles
                
                data = await response.json()
                posts = data.get('data', {}).get('children', [])
                
                cutoff_date = datetime.now() - timedelta(days=1)
                
                for post_data in posts[:self.max_articles_per_source]:
                    try:
                        post = post_data.get('data', {})
                        
                        # Quick AI keyword filter
                        title = post.get('title', '').lower()
                        if not any(kw in title for kw in ['ai', 'ml', 'gpt', 'llm', 'model', 'neural']):
                            continue
                        
                        created_utc = post.get('created_utc', 0)
                        pub_date = datetime.fromtimestamp(created_utc) if created_utc else datetime.now()
                        
                        if pub_date < cutoff_date:
                            continue
                        
                        article = {
                            'source': source_config['name'],
                            'source_color': source_config['color'],
                            'title': post.get('title', 'No title'),
                            'link': f"https://reddit.com{post.get('permalink', '')}",
                            'description': f"Score: {post.get('score', 0)} | Comments: {post.get('num_comments', 0)}",
                            'pub_date': pub_date.isoformat(),
                            'category': source_config['category']
                        }
                        
                        articles.append(article)
                        
                    except Exception as e:
                        logger.error(f"Error processing Reddit post: {e}")
                        continue
                
                logger.info(f"Scraped {len(articles)} posts from {source_config['name']}")
                
        except Exception as e:
            logger.error(f"Error scraping {source_config['name']}: {e}")
        
        return articles

    async def scrape_hackernews_async(self, session, source_key, source_config):
        """Asynchronously scrape Hacker News AI posts."""
        articles = []
        
        try:
            logger.info("Scraping Hacker News AI posts...")
            
            # Get top stories
            async with session.get(source_config['url']) as response:
                if response.status != 200:
                    return articles
                
                story_ids = await response.json()
                
                # Process only first 20 stories for speed
                for story_id in story_ids[:20]:
                    try:
                        story_url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json"
                        async with session.get(story_url) as story_response:
                            if story_response.status != 200:
                                continue
                            
                            story = await story_response.json()
                            if not story:
                                continue
                            
                            title = story.get('title', '').lower()
                            # Quick AI filter
                            if not any(kw in title for kw in ['ai', 'ml', 'gpt', 'llm', 'openai', 'anthropic']):
                                continue
                            
                            timestamp = story.get('time', 0)
                            pub_date = datetime.fromtimestamp(timestamp) if timestamp else datetime.now()
                            
                            # Only recent stories
                            if pub_date < (datetime.now() - timedelta(days=1)):
                                continue
                            
                            article = {
                                'source': source_config['name'],
                                'source_color': source_config['color'],
                                'title': story.get('title', 'No title'),
                                'link': story.get('url', f"https://news.ycombinator.com/item?id={story_id}"),
                                'description': f"Score: {story.get('score', 0)} | Comments: {story.get('descendants', 0)}",
                                'pub_date': pub_date.isoformat(),
                                'category': source_config['category']
                            }
                            
                            articles.append(article)
                            
                            # Limit HN articles for speed
                            if len(articles) >= 3:
                                break
                                
                    except Exception as e:
                        logger.error(f"Error processing HN story {story_id}: {e}")
                        continue
                
                logger.info(f"Scraped {len(articles)} AI posts from Hacker News")
                
        except Exception as e:
            logger.error(f"Error scraping Hacker News: {e}")
        
        return articles

    def _clean_description(self, description: str) -> str:
        """Quickly clean HTML from description."""
        if not description:
            return ""
        
        # Quick HTML removal (faster than BeautifulSoup for simple cases)
        import re
        clean = re.sub('<[^<]+?>', '', description)
        return clean.strip()[:200]  # Limit length for speed

    async def scrape_chunk_async(self, chunk_number: int) -> List[Dict]:
        """Scrape a specific chunk of sources asynchronously."""
        if chunk_number not in self.source_chunks:
            logger.error(f"Invalid chunk number: {chunk_number}")
            return []
        
        sources = self.source_chunks[chunk_number]
        all_articles = []
        
        async with aiohttp.ClientSession(timeout=self.timeout) as session:
            tasks = []
            
            for source_key, source_config in sources.items():
                if source_config.get('type') == 'reddit':
                    task = self.scrape_reddit_async(session, source_key, source_config)
                elif source_config.get('type') == 'hackernews':
                    task = self.scrape_hackernews_async(session, source_key, source_config)
                else:
                    # RSS source
                    task = self.scrape_rss_source_async(session, source_key, source_config)
                
                tasks.append(task)
            
            # Execute all tasks concurrently
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in results:
                if isinstance(result, Exception):
                    logger.error(f"Task failed: {result}")
                else:
                    all_articles.extend(result)
        
        # Sort by publication date
        all_articles.sort(key=lambda x: x['pub_date'], reverse=True)
        
        logger.info(f"Chunk {chunk_number} completed: {len(all_articles)} articles")
        return all_articles

    def save_chunk_data(self, chunk_number: int, articles: List[Dict]):
        """Save chunk data to temporary file."""
        try:
            os.makedirs('reports/chunks', exist_ok=True)
            filename = f'reports/chunks/chunk_{chunk_number}.json'
            
            chunk_data = {
                'chunk': chunk_number,
                'timestamp': datetime.now().isoformat(),
                'articles': articles,
                'count': len(articles)
            }
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(chunk_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Chunk {chunk_number} data saved to {filename}")
            
        except Exception as e:
            logger.error(f"Error saving chunk {chunk_number}: {e}")

    def load_all_chunks(self) -> List[Dict]:
        """Load and combine all chunk data."""
        all_articles = []
        
        try:
            for chunk_num in [1, 2, 3]:
                filename = f'reports/chunks/chunk_{chunk_num}.json'
                if os.path.exists(filename):
                    with open(filename, 'r', encoding='utf-8') as f:
                        chunk_data = json.load(f)
                        all_articles.extend(chunk_data.get('articles', []))
                    logger.info(f"Loaded {len(chunk_data.get('articles', []))} articles from chunk {chunk_num}")
            
            # Remove duplicates and sort
            seen_titles = set()
            unique_articles = []
            for article in all_articles:
                if article['title'] not in seen_titles:
                    seen_titles.add(article['title'])
                    unique_articles.append(article)
            
            unique_articles.sort(key=lambda x: x['pub_date'], reverse=True)
            logger.info(f"Combined {len(unique_articles)} unique articles from all chunks")
            
            return unique_articles
            
        except Exception as e:
            logger.error(f"Error loading chunks: {e}")
            return []

    def quick_summarize(self, articles: List[Dict]) -> str:
        """Generate a quick summary without AI (for speed)."""
        if not articles:
            return "No articles found."
        
        # Group by source
        source_counts = {}
        categories = {'business': 0, 'development': 0}
        
        for article in articles:
            source = article['source']
            source_counts[source] = source_counts.get(source, 0) + 1
            categories[article.get('category', 'development')] += 1
        
        summary = f"""Quick Summary - {datetime.now().strftime('%Y-%m-%d')}

Total Articles: {len(articles)}
Business News: {categories['business']} articles
Development News: {categories['development']} articles

Top Sources:
"""
        
        for source, count in sorted(source_counts.items(), key=lambda x: x[1], reverse=True):
            summary += f"- {source}: {count} articles\n"
        
        summary += f"\nLatest Headlines:\n"
        for article in articles[:5]:
            summary += f"• {article['title']} ({article['source']})\n"
        
        return summary

    def ai_summarize(self, articles: List[Dict]) -> str:
        """Generate AI summary (only when time permits)."""
        if not self.client or not articles:
            return self.quick_summarize(articles)
        
        try:
            # Prepare concise article list for AI
            articles_text = ""
            for i, article in enumerate(articles[:15], 1):  # Limit for speed
                articles_text += f"{i}. {article['title']} ({article['source']})\n"
                articles_text += f"   {article['description'][:100]}...\n"
            
            prompt = f"""Analyze these AI news articles and provide a brief summary of key developments:

{articles_text}

Provide a concise summary highlighting the most important trends and developments."""

            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=800,  # Reduced for speed
                temperature=0.3,
                messages=[{"role": "user", "content": prompt}]
            )
            
            return message.content[0].text
            
        except Exception as e:
            logger.error(f"AI summarization failed: {e}")
            return self.quick_summarize(articles)

    def save_final_report(self, articles: List[Dict], summary: str):
        """Save the final combined report."""
        try:
            os.makedirs('reports', exist_ok=True)
            
            report_date = datetime.now().strftime('%Y-%m-%d')
            
            # Create JSON report for API
            report_data = {
                'report_date': report_date,
                'generated_at': datetime.now().isoformat(),
                'total_articles': len(articles),
                'sources_count': len(set(a['source'] for a in articles)),
                'summary': summary,
                'articles': articles,
                'sources': []
            }
            
            # Calculate source statistics
            source_stats = {}
            for article in articles:
                source = article['source']
                color = article.get('source_color', '#6366f1')
                if source not in source_stats:
                    source_stats[source] = {'name': source, 'count': 0, 'color': color}
                source_stats[source]['count'] += 1
            
            report_data['sources'] = list(source_stats.values())
            
            # Save JSON report
            json_filename = f'reports/ai_news_report_{report_date}.json'
            with open(json_filename, 'w', encoding='utf-8') as f:
                json.dump(report_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Final report saved: {json_filename}")
            
            # Clean up chunk files
            try:
                import shutil
                if os.path.exists('reports/chunks'):
                    shutil.rmtree('reports/chunks')
                logger.info("Cleaned up temporary chunk files")
            except Exception as e:
                logger.warning(f"Could not clean up chunks: {e}")
            
        except Exception as e:
            logger.error(f"Error saving final report: {e}")

def main():
    """Main function with argument parsing for different modes."""
    parser = argparse.ArgumentParser(description='Optimized AI News Scraper')
    parser.add_argument('--chunk', type=int, choices=[1, 2, 3], help='Process specific chunk')
    parser.add_argument('--combine', action='store_true', help='Combine chunks and generate final report')
    parser.add_argument('--quick', action='store_true', help='Quick scrape without AI summarization')
    parser.add_argument('--sources', nargs='+', help='Process specific sources only')
    
    args = parser.parse_args()
    
    try:
        scraper = OptimizedAINewsScraper()
        
        if args.chunk:
            # Process specific chunk
            logger.info(f"Processing chunk {args.chunk}")
            articles = asyncio.run(scraper.scrape_chunk_async(args.chunk))
            scraper.save_chunk_data(args.chunk, articles)
            print(f"✅ Chunk {args.chunk} completed: {len(articles)} articles")
            
        elif args.combine:
            # Combine all chunks and generate final report
            logger.info("Combining chunks and generating final report")
            articles = scraper.load_all_chunks()
            
            if args.quick:
                summary = scraper.quick_summarize(articles)
            else:
                summary = scraper.ai_summarize(articles)
            
            scraper.save_final_report(articles, summary)
            print(f"✅ Final report generated: {len(articles)} articles")
            
        elif args.quick:
            # Quick mode: all sources, no AI summary
            logger.info("Running quick scrape mode")
            all_articles = []
            
            for chunk_num in [1, 2, 3]:
                articles = asyncio.run(scraper.scrape_chunk_async(chunk_num))
                all_articles.extend(articles)
            
            summary = scraper.quick_summarize(all_articles)
            scraper.save_final_report(all_articles, summary)
            print(f"✅ Quick scrape completed: {len(all_articles)} articles")
            
        else:
            # Default: process chunk 1 (fastest sources)
            logger.info("Default mode: processing fast sources only")
            articles = asyncio.run(scraper.scrape_chunk_async(1))
            summary = scraper.quick_summarize(articles)
            scraper.save_final_report(articles, summary)
            print(f"✅ Fast scrape completed: {len(articles)} articles")
            
    except Exception as e:
        logger.error(f"Error in optimized scraper: {e}")
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
