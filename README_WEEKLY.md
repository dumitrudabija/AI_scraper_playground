# AI News Scraper - Weekly Edition

A comprehensive Python script that scrapes AI news from multiple reliable sources, uses Anthropic's Claude API to generate intelligent weekly summaries, and creates beautiful HTML reports with reference links.

## 🌟 Features

- **📅 Weekly Schedule**: Runs every Monday at 7:00 AM automatically
- **🎨 Beautiful HTML Reports**: Modern, responsive design with professional styling
- **🔗 Reference Links**: Every article includes clickable reference links
- **📊 Comprehensive Summaries**: AI-powered weekly executive summaries
- **🔄 Multi-source Scraping**: Collects news from TechCrunch AI, VentureBeat AI, MIT Technology Review, and AI News
- **🛡️ Robust Error Handling**: Continues operation even if individual sources fail
- **📱 Mobile-Friendly**: Reports work perfectly on all devices
- **📈 Weekly Focus**: Covers the past 7 days of AI developments

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
cd ai-news-scraper
./setup_weekly_automation.sh
```

This script will:
- ✅ Install all dependencies
- ✅ Set up environment files
- ✅ Make scripts executable
- ✅ Create necessary directories
- ✅ Test the setup
- ✅ Optionally configure cron job for weekly automation

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   cd ai-news-scraper
   pip install -r requirements.txt
   ```

2. **Configure API Key**
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

3. **Make Scripts Executable**
   ```bash
   chmod +x run_weekly.sh
   chmod +x weekly_scraper.py
   ```

4. **Test the Setup**
   ```bash
   ./run_weekly.sh
   ```

## 📋 Requirements

- **Python 3.7+**
- **Internet connection**
- **Anthropic API key** ([Get one here](https://console.anthropic.com/))
- **Required packages** (automatically installed):
  - requests>=2.31.0
  - beautifulsoup4>=4.12.0
  - anthropic>=0.7.0
  - python-dotenv>=1.0.0
  - lxml>=4.9.0
  - feedparser>=6.0.0

## 🕐 Weekly Automation

### macOS/Linux (Cron)

Add to your crontab for weekly execution every Monday at 7 AM:

```bash
crontab -e
```

Add this line:
```bash
0 7 * * 1 /path/to/ai-news-scraper/run_weekly.sh
```

### Windows (Task Scheduler)

1. Open Task Scheduler (`Win + R`, type `taskschd.msc`)
2. Create Basic Task
3. Set trigger: Weekly, Monday, 7:00 AM
4. Set action: Start program with path to `run_weekly.sh`

See [WEEKLY_AUTOMATION_SETUP.md](WEEKLY_AUTOMATION_SETUP.md) for detailed instructions.

## 📊 Report Features

### Beautiful Design
- Modern, responsive HTML layout
- Professional styling with gradients and animations
- Mobile-friendly design
- Source-specific color coding

### Reference Links
- Every article includes clickable reference links
- Links open in new tabs with proper security attributes
- Source attribution for each article
- Direct links to original articles

### Comprehensive Content
- **Executive Summary**: AI-generated weekly overview
- **Articles by Source**: Organized by news source
- **Publication Dates**: Formatted publication times
- **Full Descriptions**: Complete article summaries
- **Weekly Statistics**: Article counts and source breakdown

### Weekly Focus
- Covers articles from the past 7 days
- Weekly summary perspective (not daily)
- Organized by themes and importance
- Comprehensive coverage of AI developments

## 📁 Output Structure

```
reports/
├── ai_news_weekly_report_2025-06-16.html
├── ai_news_weekly_report_2025-06-23.html
└── ...

logs/
└── ai_news_scraper.log
```

### Sample Report Structure

The HTML reports include:

1. **Header Section**
   - Report title and date
   - Week coverage range
   - Statistics (total articles, sources)

2. **Executive Summary**
   - AI-generated weekly overview
   - Key trends and developments
   - Major announcements and breakthroughs

3. **Articles by Source**
   - TechCrunch AI
   - VentureBeat AI
   - MIT Technology Review
   - AI News

4. **Footer**
   - Generation timestamp
   - Coverage statistics

## 🎯 News Sources

The weekly scraper pulls from these reliable sources:

| Source | Focus | Color |
|--------|-------|-------|
| **TechCrunch AI** | Startup news, funding, product launches | Green |
| **VentureBeat AI** | Enterprise AI, technology trends | Blue |
| **MIT Technology Review** | Research, analysis, deep dives | Red |
| **AI News** | Comprehensive industry coverage | Purple |

## ⚙️ Customization

### Adding New Sources

Edit `weekly_scraper.py` and add to the `news_sources` dictionary:

```python
'new_source': {
    'name': 'New Source Name',
    'rss_url': 'https://example.com/feed/',
    'base_url': 'https://example.com',
    'color': '#FF5722'
}
```

### Modifying the Schedule

Change the cron expression:
- `0 7 * * 1` - Monday 7 AM (current)
- `0 9 * * 1` - Monday 9 AM
- `0 18 * * 0` - Sunday 6 PM

### Adjusting Content

Modify these parameters in `weekly_scraper.py`:
- **Date range**: Change `timedelta(days=7)` for different coverage periods
- **Article limit**: Modify the slice `[:20]` for more/fewer articles per source
- **Summary length**: Adjust `max_tokens` in the Anthropic API call

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   chmod +x run_weekly.sh weekly_scraper.py
   ```

2. **API Key Not Found**
   - Ensure `.env` file exists with `ANTHROPIC_API_KEY=your_key_here`
   - Check file is in the correct directory

3. **Cron Job Not Running**
   - Verify full paths in crontab
   - Check cron service is running
   - Review system logs

4. **No Articles Found**
   - Check internet connection
   - Verify RSS feeds are accessible
   - Review log files for specific errors

### Debugging

Check the log file for detailed information:
```bash
tail -f logs/ai_news_scraper.log
```

Test the scraper manually:
```bash
python3 weekly_scraper.py
```

## 📚 Documentation

- **[WEEKLY_AUTOMATION_SETUP.md](WEEKLY_AUTOMATION_SETUP.md)** - Detailed automation setup
- **[README.md](README.md)** - General project information
- **[README_DAILY.md](README_DAILY.md)** - Daily scraper documentation

## 🤝 Usage Examples

### Manual Run
```bash
./run_weekly.sh
```

### Python Direct
```bash
python3 weekly_scraper.py
```

### Check Cron Jobs
```bash
crontab -l
```

### View Latest Report
```bash
open reports/$(ls -t reports/ai_news_weekly_report_*.html | head -n1)
```

## 🎉 What You Get

After setup, every Monday at 7 AM you'll automatically receive:

✅ **Beautiful HTML Report** with professional design  
✅ **Reference Links** for every article and insight  
✅ **Weekly Executive Summary** powered by AI  
✅ **Comprehensive Coverage** of the past 7 days  
✅ **Mobile-Friendly** reports that work everywhere  
✅ **Organized Content** grouped by source and importance  
✅ **Automatic Delivery** without any manual intervention  

## 📈 Sample Output

```html
🤖 AI News Weekly Report
June 16, 2025 at 04:21 PM
Week of June 09 - June 16, 2025

📊 Weekly Executive Summary
[AI-generated comprehensive summary of the week's developments]

📰 This Week's Articles
├── TechCrunch AI (15 articles)
├── VentureBeat AI (12 articles)
├── MIT Technology Review (8 articles)
└── AI News (18 articles)

Total: 53 articles with reference links
```

## 🔒 Security & Privacy

- All requests use proper User-Agent headers
- Links include security attributes (`rel="noopener noreferrer"`)
- No personal data is collected or stored
- API keys are stored securely in environment files
- All external links are clearly marked

## 📞 Support

If you encounter issues:

1. **Check the logs**: `logs/ai_news_scraper.log`
2. **Verify setup**: Run `./setup_weekly_automation.sh`
3. **Test manually**: `./run_weekly.sh`
4. **Review documentation**: See linked guides above

---

**Happy weekly AI news scraping! 🤖📰**

*The weekly scraper ensures you never miss important AI developments while providing beautiful, reference-linked reports every Monday morning.*
