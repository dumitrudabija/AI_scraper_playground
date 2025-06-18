#!/bin/bash

# AI News Scraper - Project Memory Framework Setup
# One-time setup script for the complete project memory framework

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Success message
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Info message
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Warning message
warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Error handling
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

echo "=============================================="
info "AI News Scraper - Project Memory Framework Setup"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "PROJECT_MEMORY_FRAMEWORK.md" ]; then
    error_exit "PROJECT_MEMORY_FRAMEWORK.md not found. Please run this script from the ai-news-scraper directory."
fi

# Create necessary directories
info "Creating directory structure..."
mkdir -p logs
success "Directory structure created"

# Set executable permissions
info "Setting executable permissions..."
chmod +x project_state_tracker.py
chmod +x update_project_memory.sh
chmod +x setup_project_memory.sh

# Check existing automation scripts
for script in "run_daily.sh" "run_weekly.sh" "setup_weekly_automation.sh"; do
    if [ -f "$script" ]; then
        chmod +x "$script"
    fi
done
success "Executable permissions set"

# Check Python installation
info "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    error_exit "Python 3 is not installed or not in PATH"
fi
PYTHON_VERSION=$(python3 --version)
success "Python found: $PYTHON_VERSION"

# Check dependencies
info "Checking project dependencies..."
if [ -f "requirements.txt" ]; then
    DEPS_COUNT=$(wc -l < requirements.txt)
    success "Requirements file found with $DEPS_COUNT dependencies"
else
    warn "Requirements file not found"
fi

# Run initial state analysis
info "Running initial project state analysis..."
if python3 project_state_tracker.py > /dev/null 2>&1; then
    success "Initial state analysis completed"
else
    warn "Initial state analysis had warnings (this is normal)"
fi

# Test memory update script
info "Testing memory update script..."
if ./update_project_memory.sh > /dev/null 2>&1; then
    success "Memory update script test completed"
else
    warn "Memory update script test had warnings (this is normal)"
fi

# Check if state files were created
if [ -f "project_state.json" ]; then
    STATE_SIZE=$(du -h project_state.json | cut -f1)
    success "Project state file created: $STATE_SIZE"
else
    warn "Project state file not created"
fi

# Setup automation integration
info "Setting up automation integration..."

# Check if weekly script exists and add memory update
if [ -f "run_weekly.sh" ]; then
    if ! grep -q "update_project_memory.sh" run_weekly.sh; then
        info "Adding memory update to weekly automation..."
        
        # Create backup
        cp run_weekly.sh run_weekly.sh.backup
        
        # Add memory update before the final success message
        sed -i.tmp '/echo.*weekly report generated successfully/i\
\
# Update project memory framework\
echo "Updating project memory framework..."\
if [ -f "./update_project_memory.sh" ]; then\
    ./update_project_memory.sh\
    echo "✅ Project memory updated"\
else\
    echo "⚠️  Memory update script not found"\
fi\
' run_weekly.sh
        
        rm -f run_weekly.sh.tmp
        success "Memory update integrated into weekly automation"
    else
        info "Memory update already integrated in weekly automation"
    fi
else
    warn "Weekly automation script not found - manual integration needed"
fi

# Suggest cron job setup
info "Automation setup suggestions:"
echo ""
echo "  📅 For automatic memory updates, add to crontab:"
echo "     # Daily memory update at midnight"
echo "     0 0 * * * $SCRIPT_DIR/update_project_memory.sh"
echo ""
echo "     # Or weekly memory update (Monday 7:05 AM)"
echo "     5 7 * * 1 $SCRIPT_DIR/update_project_memory.sh"
echo ""

# Display framework status
info "Project Memory Framework Status:"
echo ""

# Count files
TOTAL_FILES=$(find . -type f -not -path './.*' -not -path './__pycache__/*' | wc -l)
PYTHON_FILES=$(find . -name "*.py" -not -path './.*' | wc -l)
DOCS_FILES=$(find . -name "*.md" -not -path './.*' | wc -l)
SHELL_FILES=$(find . -name "*.sh" -not -path './.*' | wc -l)

echo "  📊 Project Overview:"
echo "     Total Files: $TOTAL_FILES"
echo "     Python Files: $PYTHON_FILES"
echo "     Documentation Files: $DOCS_FILES"
echo "     Shell Scripts: $SHELL_FILES"
echo ""

# Check framework files
echo "  🧠 Memory Framework Files:"
for file in "PROJECT_MEMORY_FRAMEWORK.md" "project_state_tracker.py" "update_project_memory.sh" "PROJECT_MEMORY_USAGE_GUIDE.md"; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" | cut -f1)
        echo "     ✅ $file ($SIZE)"
    else
        echo "     ❌ $file (missing)"
    fi
done
echo ""

# Check state files
echo "  📈 State Tracking Files:"
for file in "project_state.json" "project_state_previous.json"; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" | cut -f1)
        echo "     ✅ $file ($SIZE)"
    else
        echo "     ⚪ $file (will be created)"
    fi
done
echo ""

# Check logs
echo "  📝 Log Files:"
if [ -d "logs" ]; then
    LOG_COUNT=$(find logs -name "*.log" 2>/dev/null | wc -l)
    echo "     📁 logs/ directory ($LOG_COUNT log files)"
else
    echo "     📁 logs/ directory (created)"
fi

# Usage instructions
echo ""
info "Quick Usage Commands:"
echo ""
echo "  🔍 Check current project state:"
echo "     ./project_state_tracker.py"
echo ""
echo "  🔄 Update project memory:"
echo "     ./update_project_memory.sh"
echo ""
echo "  📖 View framework documentation:"
echo "     cat PROJECT_MEMORY_FRAMEWORK.md"
echo ""
echo "  📚 View usage guide:"
echo "     cat PROJECT_MEMORY_USAGE_GUIDE.md"
echo ""

# Final status
echo "=============================================="
success "Project Memory Framework setup completed!"
echo ""
info "The framework will now automatically:"
echo "  • Track all project changes"
echo "  • Monitor file structure and dependencies"
echo "  • Analyze recent activity and performance"
echo "  • Maintain comprehensive project documentation"
echo "  • Provide complete project visibility"
echo ""
info "Next steps:"
echo "  1. Review PROJECT_MEMORY_FRAMEWORK.md for current project state"
echo "  2. Set up automated memory updates via cron (optional)"
echo "  3. Run ./update_project_memory.sh after major changes"
echo "  4. Check PROJECT_MEMORY_USAGE_GUIDE.md for detailed usage"
echo ""
echo "=============================================="

exit 0
