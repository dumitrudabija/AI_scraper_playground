#!/bin/bash

# AI News Scraper - Project Memory Update Script
# Automatically updates project memory framework and tracks state changes

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/logs/memory_update.log"
FRAMEWORK_FILE="$SCRIPT_DIR/PROJECT_MEMORY_FRAMEWORK.md"
STATE_TRACKER="$SCRIPT_DIR/project_state_tracker.py"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    log "ERROR: $1"
    exit 1
}

# Success message
success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCCESS: $1"
}

# Info message
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    log "INFO: $1"
}

# Warning message
warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log "WARNING: $1"
}

# Create logs directory if it doesn't exist
mkdir -p "$SCRIPT_DIR/logs"

# Start logging
log "Starting project memory update process"
info "AI News Scraper - Project Memory Update"
echo "=============================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    error_exit "Python 3 is not installed or not in PATH"
fi

# Check if state tracker exists
if [ ! -f "$STATE_TRACKER" ]; then
    error_exit "Project state tracker not found: $STATE_TRACKER"
fi

# Check if framework file exists
if [ ! -f "$FRAMEWORK_FILE" ]; then
    error_exit "Project memory framework file not found: $FRAMEWORK_FILE"
fi

# Run project state tracker
info "Running project state analysis..."
if python3 "$STATE_TRACKER"; then
    success "Project state analysis completed"
else
    error_exit "Project state analysis failed"
fi

# Check if state file was created/updated
STATE_FILE="$SCRIPT_DIR/project_state.json"
if [ -f "$STATE_FILE" ]; then
    STATE_SIZE=$(du -h "$STATE_FILE" | cut -f1)
    success "Project state file updated: $STATE_FILE ($STATE_SIZE)"
else
    warn "Project state file not found after analysis"
fi

# Backup framework file before updates
BACKUP_FILE="$FRAMEWORK_FILE.backup.$(date +%Y%m%d_%H%M%S)"
if cp "$FRAMEWORK_FILE" "$BACKUP_FILE"; then
    info "Framework file backed up to: $(basename "$BACKUP_FILE")"
else
    warn "Could not create backup of framework file"
fi

# Generate memory update summary
info "Generating memory update summary..."

# Count recent changes
RECENT_REPORTS=$(find "$SCRIPT_DIR/reports" -name "ai_news_*" -mtime -7 2>/dev/null | wc -l || echo "0")
RECENT_LOGS=$(find "$SCRIPT_DIR/logs" -name "*.log" -mtime -1 2>/dev/null | wc -l || echo "0")

# Check automation status
CRON_JOBS=$(crontab -l 2>/dev/null | grep -c "ai-news-scraper\|run_weekly.sh" || echo "0")

# Check executable permissions
EXECUTABLE_SCRIPTS=0
for script in "run_daily.sh" "run_weekly.sh" "setup_weekly_automation.sh"; do
    if [ -x "$SCRIPT_DIR/$script" ]; then
        ((EXECUTABLE_SCRIPTS++))
    fi
done

# Display summary
echo ""
info "Project Memory Update Summary:"
echo "  📊 Recent Reports (7 days): $RECENT_REPORTS"
echo "  📝 Recent Logs (1 day): $RECENT_LOGS"
echo "  ⚙️  Cron Jobs Active: $CRON_JOBS"
echo "  🔧 Executable Scripts: $EXECUTABLE_SCRIPTS/3"

# Check for configuration files
CONFIG_STATUS=""
if [ -f "$SCRIPT_DIR/.env" ]; then
    CONFIG_STATUS="✅ Environment configured"
else
    CONFIG_STATUS="❌ Environment not configured"
fi
echo "  🔑 $CONFIG_STATUS"

# Check Python dependencies
DEPS_STATUS=""
if [ -f "$SCRIPT_DIR/requirements.txt" ]; then
    DEPS_COUNT=$(wc -l < "$SCRIPT_DIR/requirements.txt")
    DEPS_STATUS="✅ $DEPS_COUNT dependencies listed"
else
    DEPS_STATUS="❌ Requirements file missing"
fi
echo "  📦 $DEPS_STATUS"

# Update framework timestamp
if [ -f "$FRAMEWORK_FILE" ]; then
    CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S AM (America/Toronto)')
    if sed -i.tmp "s/\*\*Last Updated\*\*: .*/\*\*Last Updated\*\*: $CURRENT_TIME/" "$FRAMEWORK_FILE" 2>/dev/null; then
        rm -f "$FRAMEWORK_FILE.tmp"
        success "Framework timestamp updated"
    else
        warn "Could not update framework timestamp"
    fi
fi

# Generate change detection
if [ -f "$STATE_FILE" ]; then
    PREV_STATE_FILE="$SCRIPT_DIR/project_state_previous.json"
    
    if [ -f "$PREV_STATE_FILE" ]; then
        # Compare states (basic comparison)
        if ! cmp -s "$STATE_FILE" "$PREV_STATE_FILE"; then
            info "Project state changes detected"
            
            # Archive previous state
            ARCHIVE_FILE="$SCRIPT_DIR/logs/project_state_$(date +%Y%m%d_%H%M%S).json"
            cp "$PREV_STATE_FILE" "$ARCHIVE_FILE" 2>/dev/null || true
        else
            info "No significant project state changes"
        fi
    fi
    
    # Update previous state for next comparison
    cp "$STATE_FILE" "$PREV_STATE_FILE" 2>/dev/null || true
fi

# Cleanup old backups (keep last 5)
info "Cleaning up old backups..."
find "$SCRIPT_DIR" -name "PROJECT_MEMORY_FRAMEWORK.md.backup.*" -type f | sort -r | tail -n +6 | xargs rm -f 2>/dev/null || true

# Cleanup old state archives (keep last 10)
find "$SCRIPT_DIR/logs" -name "project_state_*.json" -type f | sort -r | tail -n +11 | xargs rm -f 2>/dev/null || true

# Final status
echo ""
echo "=============================================="
success "Project memory update completed successfully"
log "Project memory update process completed"

# Optional: Display framework file info
if [ -f "$FRAMEWORK_FILE" ]; then
    FRAMEWORK_SIZE=$(du -h "$FRAMEWORK_FILE" | cut -f1)
    FRAMEWORK_LINES=$(wc -l < "$FRAMEWORK_FILE")
    info "Framework file: $FRAMEWORK_SIZE, $FRAMEWORK_LINES lines"
fi

# Exit successfully
exit 0
