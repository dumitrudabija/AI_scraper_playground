#!/usr/bin/env python3
"""
AI News Scraper - Daily AI News Report Generator
Scrapes AI news from multiple sources and generates beautiful HTML reports using Anthropic API
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

class AINewsScraper:
    def __init__(self):
        """Initialize the AI News Scraper with API credentials and configurations."""
        self.anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        if not self.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        
        self.client = anthropic.Anthropic(api_key=self.anthropic_api_key)
        
        # News sources configuration
        self.news_sources = {
            'techcrunch_ai': {
                'name': 'TechCrunch AI',
                'rss_url': 'https://techcrunch.com/category/artificial-intelligence/feed/',
                'base_url': 'https://techcrunch.com',
                'color': '#00D084'
            },
            'venturebeat_ai': {
                'name': 'VentureBeat AI',
                'rss_url': 'https://venturebeat.com/ai/feed/',
                'base_url': 'https://venturebeat.com',
                'color': '#1E88E5'
            },
            'mit_tech_review': {
                'name': 'MIT Technology Review',
                'rss_url': 'https://www.technologyreview.com/feed/',
                'base_url': 'https://www.technologyreview.com',
                'color': '#E53935'
            },
            'ai_news': {
                'name': 'AI News',
                'rss_url': 'https://artificialintelligence-news.com/feed/',
                'base_url': 'https://artificialintelligence-news.com',
                'color': '#8E24AA'
            }
        }
        
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

    def scrape_all_sources(self) -> List[Dict]:
        """Scrape articles from all configured news sources."""
        all_articles = []
        
        for source_key in self.news_sources.keys():
            try:
                articles = self.scrape_rss_feed(source_key)
                all_articles.extend(articles)
            except Exception as e:
                logger.error(f"Failed to scrape {source_key}: {str(e)}")
                continue
        
        # Sort articles by publication date (newest first)
        all_articles.sort(key=lambda x: x['pub_date'], reverse=True)
        
        logger.info(f"Total articles scraped: {len(all_articles)}")
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

Please provide a well-structured summary that highlights the most important developments, organized by themes or categories. Include specific details and maintain journalistic objectivity. Keep it concise but informative."""

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

    def generate_html_report(self, articles: List[Dict], summary: str) -> str:
        """Generate a beautiful HTML report with articles and summary."""
        report_date = datetime.now().strftime('%Y-%m-%d')
        report_time = datetime.now().strftime('%B %d, %Y at %I:%M %p')
        
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
    <title>AI News Daily Report - {report_date}</title>
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
            <h1>🤖 AI News Daily Report</h1>
            <div class="date">{report_time}</div>
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
                <h2>📊 Executive Summary</h2>
                <div class="summary-content">{summary}</div>
            </div>
            
            <div class="articles-section">
                <h2>📰 Latest Articles</h2>
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
                            <a href="{article['link']}" target="_blank">{article['title']}</a>
                        </div>
                        <div class="article-meta">
                            Published: {article['pub_date_formatted']}
                        </div>
                        <div class="article-description">
                            {article['description']}
                        </div>
                        <a href="{article['link']}" target="_blank" class="read-more">Read Full Article →</a>
                    </div>
"""
            
            html_report += "</div>"
        
        html_report += f"""
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-info">
                <strong>Report Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            </div>
            <div class="generated-time">
                Total articles processed: {len(articles)} | Sources: {', '.join(source_counts.keys())}
            </div>
        </div>
    </div>
</body>
</html>"""
        
        return html_report

    def save_report(self, report: str) -> str:
        """Save the HTML report to a file with today's date."""
        try:
            # Create reports directory if it doesn't exist
            reports_dir = "reports"
            os.makedirs(reports_dir, exist_ok=True)
            
            # Generate filename with date and time
            report_datetime = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
            filename = f"{reports_dir}/ai_news_report_{report_datetime}.html"
            
            # Save report
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(report)
            
            logger.info(f"Report saved to {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error saving report: {str(e)}")
            raise

    def run_daily_scrape(self) -> str:
        """Run the complete daily scraping and reporting process."""
        try:
            logger.info("Starting daily AI news scraping...")
            
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
            
            # Save report to file
            filename = self.save_report(report)
            
            logger.info(f"Daily scraping completed successfully. Report saved to {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error in daily scraping process: {str(e)}")
            raise

def main():
    """Main function to run the AI news scraper."""
    try:
        scraper = AINewsScraper()
        report_file = scraper.run_daily_scrape()
        print(f"✅ AI News report generated successfully: {report_file}")
        print(f"🌐 Open the report in your browser to view: open {report_file}")
        
    except ValueError as e:
        print(f"❌ Configuration error: {e}")
        print("Please make sure you have created a .env file with your ANTHROPIC_API_KEY")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Error running AI news scraper: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
