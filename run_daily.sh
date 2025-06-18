#!/bin/bash

# Daily AI News Scraper Runner
# This script runs the daily news scraper and opens the report

echo "🤖 Starting Daily AI News Scraper..."
echo "=================================="

# Change to the script directory
cd "$(dirname "$0")"

# Run the daily scraper
python3 daily_news_scraper.py

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Daily news scraping completed successfully!"
    echo ""
    
    # Find the most recent HTML report
    LATEST_REPORT=$(ls -t reports/ai_news_report_*.html 2>/dev/null | head -n1)
    
    if [ -n "$LATEST_REPORT" ]; then
        echo "📊 Latest report: $LATEST_REPORT"
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
        echo "⚠️  No report file found"
    fi
else
    echo "❌ Daily news scraping failed!"
    exit 1
fi
