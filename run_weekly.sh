#!/bin/bash

# Weekly AI News Scraper Runner
# This script runs the weekly news scraper and opens the HTML report

echo "🤖 Starting Weekly AI News Scraper..."
echo "====================================="

# Change to the script directory
cd "$(dirname "$0")"

# Run the weekly scraper
python3 weekly_scraper.py

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Weekly news scraping completed successfully!"
    echo ""
    
    # Find the most recent weekly HTML report
    LATEST_REPORT=$(ls -t reports/ai_news_weekly_report_*.html 2>/dev/null | head -n1)
    
    if [ -n "$LATEST_REPORT" ]; then
        echo "📊 Latest weekly report: $LATEST_REPORT"
        echo "🌐 Opening report in browser..."
        
        # Open the report in the default browser
        if command -v open >/dev/null 2>&1; then
            # macOS
            open "$LATEST_REPORT"
        elif command -v xdg-open >/dev/null 2>&1; then
            # Linux
            xdg-open "$LATEST_REPORT"
        elif command -v start >/dev/null 2>&1; then
            # Windows
            start "$LATEST_REPORT"
        else
            echo "Please manually open: $LATEST_REPORT"
        fi
    else
        echo "⚠️  No weekly report file found"
    fi
else
    echo "❌ Weekly news scraping failed!"
    exit 1
fi
