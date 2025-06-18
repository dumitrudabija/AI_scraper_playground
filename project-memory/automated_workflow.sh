#!/bin/bash

# AI News Scraper - Automated Development Workflow
# This script enforces the project memory consultation and update workflow
# Usage: ./automated_workflow.sh "task description" [optional: task_number]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MEMORY_DIR="$PROJECT_ROOT/project-memory"
FRAMEWORK_FILE="$MEMORY_DIR/PROJECT_MEMORY_FRAMEWORK.md"
WORKFLOW_LOG="$MEMORY_DIR/logs/workflow_$(date +%Y%m%d_%H%M%S).log"

# Ensure logs directory exists
mkdir -p "$MEMORY_DIR/logs"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$WORKFLOW_LOG"
}

# Print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    log "INFO: $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCCESS: $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log "WARNING: $1"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    log "ERROR: $1"
}

# Check if task description provided
if [ -z "$1" ]; then
    print_error "Usage: $0 \"task description\" [task_number]"
    echo "Example: $0 \"Connect PWA to API\" 4"
    exit 1
fi

TASK_DESCRIPTION="$1"
TASK_NUMBER="${2:-}"

print_status "Starting Automated Development Workflow"
print_status "Task: $TASK_DESCRIPTION"
if [ -n "$TASK_NUMBER" ]; then
    print_status "Task Number: $TASK_NUMBER"
fi

# Step 1: Pre-Development - Read Project Memory
print_status "Step 1: Pre-Development Memory Consultation"

if [ ! -f "$FRAMEWORK_FILE" ]; then
    print_error "Project memory framework not found: $FRAMEWORK_FILE"
    exit 1
fi

print_status "Reading project memory framework..."
echo "==================== PROJECT MEMORY FRAMEWORK ===================="
echo "📖 MANDATORY PRE-DEVELOPMENT READING:"
echo "   - Current project state and architecture"
echo "   - Completed tasks and pending work"
echo "   - Known issues and dependencies"
echo "   - File structure and configurations"
echo ""
echo "📋 Key sections to review:"
grep -n "^##\|^###\|^####" "$FRAMEWORK_FILE" | head -20
echo ""
echo "📊 Current project stats:"
grep -A 5 "PROJECT OVERVIEW" "$FRAMEWORK_FILE" | tail -4
echo ""
echo "🎯 Pending tasks:"
grep -A 10 "Pending Tasks" "$FRAMEWORK_FILE" | head -10
echo "=================================================================="

print_success "Project memory consultation completed"

# Step 2: Development Phase Preparation
print_status "Step 2: Development Environment Validation"

# Check if we're in the right directory
if [ ! -f "$PROJECT_ROOT/README.md" ]; then
    print_error "Not in project root directory. Expected: $PROJECT_ROOT"
    exit 1
fi

# Check git status
if ! git status >/dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "Uncommitted changes detected. Consider committing before starting new task."
    git status --porcelain
fi

print_success "Development environment validated"

# Step 3: Task Execution Guidance
print_status "Step 3: Task Execution Guidance"

echo "🚀 DEVELOPMENT PHASE INSTRUCTIONS:"
echo "   1. Implement the task: $TASK_DESCRIPTION"
echo "   2. Test your implementation thoroughly"
echo "   3. Commit your changes with descriptive messages"
echo "   4. When complete, run the post-development workflow"
echo ""
echo "📝 Recommended commit message format:"
if [ -n "$TASK_NUMBER" ]; then
    echo "   ✅ Task $TASK_NUMBER Complete: $TASK_DESCRIPTION"
else
    echo "   ✅ Complete: $TASK_DESCRIPTION"
fi
echo ""
echo "🔄 After development, run:"
echo "   ./project-memory/automated_workflow.sh --post-dev \"$TASK_DESCRIPTION\" $TASK_NUMBER"
echo ""

# Create a task tracking file
TASK_FILE="$MEMORY_DIR/logs/current_task.json"
cat > "$TASK_FILE" << EOF
{
  "task_description": "$TASK_DESCRIPTION",
  "task_number": "$TASK_NUMBER",
  "start_time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "workflow_log": "$(basename "$WORKFLOW_LOG")",
  "status": "in_progress"
}
EOF

print_success "Task tracking initialized: $TASK_FILE"
print_status "Development phase ready. Proceed with implementation."

# If this is post-development workflow
if [ "$1" = "--post-dev" ]; then
    shift
    TASK_DESCRIPTION="$1"
    TASK_NUMBER="${2:-}"
    
    print_status "Step 4: Post-Development Memory Update"
    
    # Check if task file exists
    if [ ! -f "$TASK_FILE" ]; then
        print_warning "No current task file found. Creating one..."
        cat > "$TASK_FILE" << EOF
{
  "task_description": "$TASK_DESCRIPTION",
  "task_number": "$TASK_NUMBER",
  "start_time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "workflow_log": "$(basename "$WORKFLOW_LOG")",
  "status": "completing"
}
EOF
    fi
    
    # Run project memory update
    print_status "Running automated project memory update..."
    if [ -f "$MEMORY_DIR/update_project_memory.sh" ]; then
        bash "$MEMORY_DIR/update_project_memory.sh"
        print_success "Project memory updated successfully"
    else
        print_error "Project memory update script not found"
        exit 1
    fi
    
    # Update task status
    python3 -c "
import json
import sys
from datetime import datetime

try:
    with open('$TASK_FILE', 'r') as f:
        task = json.load(f)
    
    task['status'] = 'completed'
    task['end_time'] = datetime.utcnow().isoformat() + 'Z'
    
    with open('$TASK_FILE', 'w') as f:
        json.dump(task, f, indent=2)
    
    print('Task status updated to completed')
except Exception as e:
    print(f'Error updating task status: {e}', file=sys.stderr)
    sys.exit(1)
"
    
    print_success "Post-development workflow completed"
    print_status "Task '$TASK_DESCRIPTION' is now complete and documented"
fi

log "Workflow completed successfully"
