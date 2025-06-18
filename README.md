# AI News Scraper

A comprehensive Python script that scrapes AI news from multiple reliable sources, uses Anthropic's Claude API to generate intelligent summaries, and creates formatted daily reports.

## Features

- **Multi-source scraping**: Collects news from TechCrunch AI, VentureBeat AI, MIT Technology Review, and AI News
- **Intelligent summarization**: Uses Anthropic's Claude API to analyze and summarize key developments
- **Automated reporting**: Generates formatted markdown reports with today's date
- **Robust error handling**: Continues operation even if individual sources fail
- **Easy daily automation**: Includes scripts for daily execution
- **Comprehensive logging**: Tracks all operations and errors

## Quick Start

### 1. Setup

```bash
cd ai-news-scraper
python3 setup.py
```

This will:
- Check Python version (3.7+ required)
- Install all required packages
- Create necessary directories
- Set up environment file template

### 2. Configure API Key

Edit the `.env` file and add your Anthropic API key:

```bash
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 3. Run the Scraper

```bash
python3 news_scraper.py
```

## Manual Installation

If you prefer to set up manually:

```bash
# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Create directories
mkdir -p reports logs

# Run the scraper
python3 news_scraper.py
```

## Daily Automation

### Option 1: Using the Shell Script

Make the script executable and run it:

```bash
chmod +x run_daily.sh
./run_daily.sh
```

### Option 2: Cron Job (Linux/macOS)

Add to your crontab for daily execution at 8 AM:

```bash
crontab -e
```

Add this line:
```
0 8 * * * /path/to/ai-news-scraper/run_daily.sh
```

### Option 3: Task Scheduler (Windows)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to Daily
4. Set action to start `python3` with arguments `news_scraper.py`
5. Set start in directory to the ai-news-scraper folder

## Output

The scraper generates:

- **Daily reports**: Saved in `reports/ai_news_report_YYYY-MM-DD.md`
- **Log files**: Saved as `ai_news_scraper.log`
- **Console output**: Real-time progress updates

### Sample Report Structure

```markdown
# AI News Daily Report - 2024-01-15

## Executive Summary
[Claude-generated summary of key developments]

## Detailed Articles (25 total)

### TechCrunch AI (8 articles)
**Article Title**
*Published: 2024-01-15 10:30:00*
Article description...
[Read more](link)

### VentureBeat AI (7 articles)
...
```

## Configuration

### News Sources

The scraper is configured to pull from these sources:

- **TechCrunch AI**: Latest AI industry news and startup coverage
- **VentureBeat AI**: Enterprise AI and technology trends
- **MIT Technology Review**: Research developments and analysis
- **AI News**: Comprehensive AI industry coverage

### Customization

You can modify `news_scraper.py` to:

- Add new RSS sources in the `news_sources` dictionary
- Adjust the number of articles processed per source
- Modify the summarization prompt
- Change report formatting
- Adjust date filtering (currently processes articles from last 7 days)

## Requirements

- Python 3.7 or higher
- Internet connection
- Anthropic API key
- Required packages (see requirements.txt):
  - requests
  - beautifulsoup4
  - anthropic
  - python-dotenv
  - lxml
  - feedparser

## Error Handling

The scraper includes comprehensive error handling:

- **Network failures**: Continues with other sources if one fails
- **API errors**: Logs errors and provides fallback behavior
- **Parsing errors**: Skips problematic articles and continues
- **File system errors**: Provides clear error messages

## Logging

All operations are logged to:
- Console (real-time feedback)
- `ai_news_scraper.log` file (persistent logging)

Log levels include INFO, WARNING, and ERROR messages.

## Troubleshooting

### Common Issues

1. **"ANTHROPIC_API_KEY not found"**
   - Make sure you've created a `.env` file
   - Verify your API key is correctly set in the `.env` file

2. **Import errors**
   - Run `python3 setup.py` to install dependencies
   - Or manually install: `pip install -r requirements.txt`

3. **No articles found**
   - Check your internet connection
   - Some sources may be temporarily unavailable
   - Check the log file for specific error messages

4. **Permission denied on run_daily.sh**
   - Make the script executable: `chmod +x run_daily.sh`

### Getting Help

Check the log file `ai_news_scraper.log` for detailed error information. The script provides comprehensive logging to help diagnose issues.

## License

This project is open source. Feel free to modify and distribute according to your needs.

## Contributing

To add new news sources:

1. Add the source configuration to `news_sources` dictionary
2. Ensure the source provides an RSS feed
3. Test the new source thoroughly
4. Update this README with the new source information

## API Usage

The script uses Anthropic's Claude API for summarization. API usage depends on:
- Number of articles processed
- Length of article content
- Complexity of summarization

Typical daily usage is minimal and well within free tier limits for most users.
