# Weekly AI News Scraper Automation Setup

This guide will help you set up the AI News Scraper to run automatically every Monday at 7:00 AM, generating beautiful HTML reports with reference links for each insight.

## Overview

The weekly scraper:
- ✅ Runs every Monday at 7:00 AM
- ✅ Generates beautiful HTML reports
- ✅ Includes reference links for each article
- ✅ Covers the past 7 days of AI news
- ✅ Provides comprehensive weekly summaries

## Prerequisites

1. **Python Environment**: Ensure Python 3.7+ is installed
2. **Dependencies**: Install required packages
3. **API Key**: Configure your Anthropic API key
4. **File Permissions**: Make scripts executable

## Setup Instructions

### 1. Install Dependencies

```bash
cd ai-news-scraper
pip install -r requirements.txt
```

### 2. Configure Environment

Create and configure your `.env` file:

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Make Scripts Executable

```bash
chmod +x run_weekly.sh
chmod +x weekly_scraper.py
```

### 4. Test the Weekly Scraper

Run a test to ensure everything works:

```bash
./run_weekly.sh
```

This should:
- Generate a weekly report in the `reports/` directory
- Open the HTML report in your browser
- Show reference links for each article

## Automation Setup

### Option 1: Cron Job (Linux/macOS) - RECOMMENDED

#### Step 1: Open Crontab

```bash
crontab -e
```

#### Step 2: Add Weekly Schedule

Add this line to run every Monday at 7:00 AM:

```bash
0 7 * * 1 /path/to/ai-news-scraper/run_weekly.sh
```

**Important**: Replace `/path/to/ai-news-scraper/` with the actual full path to your project directory.

To find your full path:
```bash
cd ai-news-scraper
pwd
```

#### Step 3: Verify Cron Job

List your cron jobs to verify:
```bash
crontab -l
```

#### Example Complete Cron Entry

```bash
# AI News Weekly Report - Every Monday at 7:00 AM
0 7 * * 1 /Users/username/Documents/ai-news-scraper/run_weekly.sh
```

### Option 2: Task Scheduler (Windows)

1. **Open Task Scheduler**
   - Press `Win + R`, type `taskschd.msc`, press Enter

2. **Create Basic Task**
   - Click "Create Basic Task" in the right panel
   - Name: "AI News Weekly Report"
   - Description: "Generate weekly AI news report every Monday at 7 AM"

3. **Set Trigger**
   - When: Weekly
   - Start date: Next Monday
   - Time: 7:00 AM
   - Recur every: 1 week
   - Days: Monday

4. **Set Action**
   - Action: Start a program
   - Program: `C:\path\to\ai-news-scraper\run_weekly.sh`
   - Start in: `C:\path\to\ai-news-scraper\`

### Option 3: macOS Launchd (Alternative for macOS)

Create a launch agent file:

```bash
# Create the launch agent directory if it doesn't exist
mkdir -p ~/Library/LaunchAgents

# Create the plist file
cat > ~/Library/LaunchAgents/com.ainews.weekly.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ainews.weekly</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/ai-news-scraper/run_weekly.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Weekday</key>
        <integer>1</integer>
        <key>Hour</key>
        <integer>7</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>WorkingDirectory</key>
    <string>/path/to/ai-news-scraper</string>
</dict>
</plist>
EOF

# Load the launch agent
launchctl load ~/Library/LaunchAgents/com.ainews.weekly.plist
```

**Remember to replace `/path/to/ai-news-scraper` with your actual path!**

## Cron Schedule Explanation

The cron expression `0 7 * * 1` means:
- `0` - Minute (0th minute)
- `7` - Hour (7 AM)
- `*` - Day of month (any day)
- `*` - Month (any month)
- `1` - Day of week (Monday, where 0=Sunday, 1=Monday, etc.)

### Other Useful Cron Schedules

```bash
# Every Monday at 7:00 AM
0 7 * * 1

# Every Monday at 9:00 AM
0 9 * * 1

# Every weekday at 8:00 AM
0 8 * * 1-5

# Every Sunday at 6:00 PM (for weekend summary)
0 18 * * 0
```

## Report Features

The weekly HTML reports include:

### ✅ Beautiful Design
- Modern, responsive HTML layout
- Professional styling with gradients and animations
- Mobile-friendly design

### ✅ Reference Links
- Every article includes clickable reference links
- Links open in new tabs with proper security attributes
- Source attribution for each article

### ✅ Comprehensive Content
- Executive summary of the week's developments
- Articles grouped by source
- Publication dates and metadata
- Full article descriptions

### ✅ Weekly Focus
- Covers articles from the past 7 days
- Weekly summary perspective (not daily)
- Organized by themes and importance

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   chmod +x run_weekly.sh
   chmod +x weekly_scraper.py
   ```

2. **Cron Job Not Running**
   - Check cron service: `sudo service cron status` (Linux)
   - Check cron logs: `grep CRON /var/log/syslog` (Linux)
   - Verify full paths in crontab

3. **Python Path Issues**
   - Use full Python path in scripts: `/usr/bin/python3` or `/usr/local/bin/python3`
   - Check with: `which python3`

4. **Environment Variables**
   - Cron has limited environment variables
   - Ensure `.env` file is in the correct location
   - Consider absolute paths

### Testing Cron Jobs

Test your cron job manually:
```bash
# Run the exact command from your crontab
/path/to/ai-news-scraper/run_weekly.sh

# Check if it creates the expected files
ls -la /path/to/ai-news-scraper/reports/
```

### Logging

The scraper logs to:
- Console output (when run manually)
- `logs/ai_news_scraper.log` file

Check logs for troubleshooting:
```bash
tail -f logs/ai_news_scraper.log
```

## Verification

After setup, verify your automation:

1. **Check Cron Job**: `crontab -l`
2. **Test Manual Run**: `./run_weekly.sh`
3. **Wait for Scheduled Run**: Check next Monday at 7 AM
4. **Verify Output**: Look for new files in `reports/` directory

## Report Location

Weekly reports are saved as:
```
reports/ai_news_weekly_report_YYYY-MM-DD.html
```

Example: `reports/ai_news_weekly_report_2025-06-16.html`

## Customization

### Change Schedule
Edit your crontab to modify the schedule:
```bash
crontab -e
# Modify the time/day as needed
```

### Change Report Content
Edit `weekly_scraper.py` to:
- Add more news sources
- Modify the summary prompt
- Change the HTML styling
- Adjust the date range (currently 7 days)

## Support

If you encounter issues:

1. Check the log files in `logs/`
2. Verify your API key is correctly set
3. Ensure all dependencies are installed
4. Test the script manually before setting up automation

The weekly scraper is now configured to run every Monday at 7:00 AM and generate beautiful HTML reports with reference links for each insight!
