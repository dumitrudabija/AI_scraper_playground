#!/bin/bash

# Weekly AI News Scraper - Automation Setup Script
# This script helps set up the weekly scraper to run every Monday at 7 AM

echo "🤖 AI News Scraper - Weekly Automation Setup"
echo "============================================="
echo ""

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📁 Project directory: $SCRIPT_DIR"
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is available
if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo "❌ pip is not installed. Please install pip first."
    exit 1
fi

echo "✅ pip found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if command -v pip3 &> /dev/null; then
    pip3 install -r requirements.txt
else
    pip install -r requirements.txt
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created from template"
        echo "⚠️  Please edit .env and add your ANTHROPIC_API_KEY"
    else
        echo "❌ .env.example not found. Please create .env manually with ANTHROPIC_API_KEY"
    fi
else
    echo "✅ .env file found"
fi

# Make scripts executable
echo ""
echo "🔧 Making scripts executable..."
chmod +x run_weekly.sh
chmod +x weekly_scraper.py
chmod +x setup_weekly_automation.sh
echo "✅ Scripts made executable"

# Create directories
echo ""
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p reports
echo "✅ Directories created"

# Test the setup
echo ""
echo "🧪 Testing the setup..."
echo "This will run a quick test of the weekly scraper..."
echo ""

# Check if ANTHROPIC_API_KEY is set
if [ -f ".env" ]; then
    source .env
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo "⚠️  ANTHROPIC_API_KEY not set in .env file"
        echo "Please edit .env and add your API key before running the scraper"
        echo ""
    else
        echo "✅ ANTHROPIC_API_KEY found in .env"
        echo ""
        echo "Running test scrape..."
        python3 weekly_scraper.py
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Test completed successfully!"
            
            # Find the most recent report
            LATEST_REPORT=$(ls -t reports/ai_news_weekly_report_*.html 2>/dev/null | head -n1)
            if [ -n "$LATEST_REPORT" ]; then
                echo "📊 Report generated: $LATEST_REPORT"
            fi
        else
            echo "❌ Test failed. Please check the error messages above."
        fi
    fi
fi

echo ""
echo "🕐 Setting up weekly automation..."
echo ""

# Detect OS and provide appropriate instructions
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🍎 macOS detected"
    echo ""
    echo "To set up weekly automation (every Monday at 7 AM), run:"
    echo ""
    echo "crontab -e"
    echo ""
    echo "Then add this line:"
    echo "0 7 * * 1 $SCRIPT_DIR/run_weekly.sh"
    echo ""
    echo "Or use the automated setup:"
    read -p "Would you like to automatically add the cron job? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Add cron job
        (crontab -l 2>/dev/null; echo "0 7 * * 1 $SCRIPT_DIR/run_weekly.sh") | crontab -
        echo "✅ Cron job added successfully!"
        echo "The scraper will now run every Monday at 7:00 AM"
    fi
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🐧 Linux detected"
    echo ""
    echo "To set up weekly automation (every Monday at 7 AM), run:"
    echo ""
    echo "crontab -e"
    echo ""
    echo "Then add this line:"
    echo "0 7 * * 1 $SCRIPT_DIR/run_weekly.sh"
    echo ""
    echo "Or use the automated setup:"
    read -p "Would you like to automatically add the cron job? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Add cron job
        (crontab -l 2>/dev/null; echo "0 7 * * 1 $SCRIPT_DIR/run_weekly.sh") | crontab -
        echo "✅ Cron job added successfully!"
        echo "The scraper will now run every Monday at 7:00 AM"
    fi
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows
    echo "🪟 Windows detected"
    echo ""
    echo "For Windows automation, please use Task Scheduler:"
    echo "1. Press Win + R, type 'taskschd.msc', press Enter"
    echo "2. Create Basic Task"
    echo "3. Set trigger: Weekly, Monday, 7:00 AM"
    echo "4. Set action: Start program '$SCRIPT_DIR/run_weekly.sh'"
    echo ""
    echo "See WEEKLY_AUTOMATION_SETUP.md for detailed instructions"
    
else
    echo "❓ Unknown OS detected"
    echo ""
    echo "Please see WEEKLY_AUTOMATION_SETUP.md for manual setup instructions"
fi

echo ""
echo "📚 For detailed setup instructions, see:"
echo "   - WEEKLY_AUTOMATION_SETUP.md"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "Summary:"
echo "✅ Dependencies installed"
echo "✅ Scripts made executable"
echo "✅ Directories created"
if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "✅ API key configured"
else
    echo "⚠️  Please configure ANTHROPIC_API_KEY in .env"
fi
echo ""
echo "The weekly scraper will:"
echo "• Run every Monday at 7:00 AM"
echo "• Generate beautiful HTML reports"
echo "• Include reference links for each article"
echo "• Cover the past 7 days of AI news"
echo ""
echo "Manual test run: ./run_weekly.sh"
echo "Reports location: $SCRIPT_DIR/reports/"
echo ""
echo "Happy scraping! 🤖📰"
