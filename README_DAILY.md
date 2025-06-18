# 🤖 AI News Daily Scraper

A beautiful, email-free AI news scraper that generates stunning HTML reports saved locally with clear timestamps.

## ✨ Features

- **Beautiful HTML Reports**: Visually appealing reports with modern design
- **No Email Required**: Reports saved locally for manual review
- **Multiple Sources**: TechCrunch AI, MIT Technology Review, AI News, and more
- **AI-Powered Summaries**: Executive summaries generated using Claude AI
- **Clear Timestamps**: Each report has a unique timestamp for easy tracking
- **Responsive Design**: Reports look great on desktop and mobile
- **Source Organization**: Articles grouped by source with color coding

## 🚀 Quick Start

### 1. Run Daily Scraper
```bash
# Simple run
python3 daily_news_scraper.py

# Or use the automated script (runs scraper + opens report)
./run_daily.sh
```

### 2. View Your Report
Reports are saved in the `reports/` directory with filenames like:
- `ai_news_report_2025-06-16_16-01-13.html`

The script will automatically open the latest report in your browser.

## 📁 File Structure

```
ai-news-scraper/
├── daily_news_scraper.py     # Main scraper script
├── run_daily.sh              # Automated runner script
├── .env                      # Configuration (API key only)
├── reports/                  # Generated HTML reports
│   └── ai_news_report_*.html
└── logs/                     # Log files
    └── ai_news_scraper.log
```

## 🎨 Report Features

Each HTML report includes:

- **Executive Summary**: AI-generated overview of key developments
- **Article Statistics**: Total articles and sources processed
- **Source Grouping**: Articles organized by publication
- **Color Coding**: Each source has its own color theme
- **Responsive Design**: Works on all devices
- **Direct Links**: Click to read full articles
- **Timestamps**: Clear publication dates and generation time

## 📊 Sample Report Structure

```
🤖 AI News Daily Report
June 16, 2025 at 4:01 PM

📊 Executive Summary
[AI-generated summary of key developments]

📰 Latest Articles
├── TechCrunch AI (10 articles)
├── MIT Technology Review (10 articles)
├── AI News (10 articles)
└── VentureBeat AI (0 articles)
```

## ⚙️ Configuration

Only one configuration needed in `.env`:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

## 🔄 Daily Usage

1. **Manual**: Run `python3 daily_news_scraper.py` whenever you want a fresh report
2. **Automated**: Use `./run_daily.sh` to run and automatically open the report
3. **Scheduled**: Set up a cron job or system scheduler to run daily

## 📝 What's Different from Email Version

- ❌ **Removed**: All email functionality and configuration
- ✅ **Added**: Beautiful HTML reports with modern design
- ✅ **Added**: Automatic browser opening
- ✅ **Added**: Better timestamps and file organization
- ✅ **Added**: Responsive design for all devices
- ✅ **Added**: Color-coded sources

## 🎯 Perfect For

- Daily AI news monitoring
- Research and trend analysis
- Offline reading and archiving
- Professional reporting
- Personal knowledge management

---

**No email setup required - just run and enjoy beautiful, local reports!** 🎉
