# Automated Development Workflow Guide

## Overview
This guide establishes an automated workflow system that enforces project memory consultation and updates, ensuring consistent development practices and complete documentation.

## Workflow Philosophy
**"Read → Develop → Document"** - Every development task must follow this three-step process:
1. **Read** project memory before starting
2. **Develop** the feature/fix with full context
3. **Document** changes in project memory after completion

## Quick Start

### For New Tasks
```bash
# Start any new development task
./project-memory/automated_workflow.sh "Add PWA icons and service worker" 5

# This will:
# 1. Display current project state and pending tasks
# 2. Show relevant documentation sections
# 3. Validate development environment
# 4. Create task tracking
# 5. Provide post-development instructions
```

### After Completing Development
```bash
# Update project memory after completing work
./project-memory/automated_workflow.sh --post-dev "Add PWA icons and service worker" 5

# This will:
# 1. Run automated project memory update
# 2. Update task status to completed
# 3. Generate new state snapshots
# 4. Create documentation backups
```

## Detailed Workflow Steps

### Step 1: Pre-Development Memory Consultation
The automated workflow will:
- ✅ Display current project overview (files, size, status)
- ✅ Show completed and pending tasks
- ✅ Highlight relevant architecture sections
- ✅ Present known issues and dependencies
- ✅ Validate development environment

**What you'll see:**
```
==================== PROJECT MEMORY FRAMEWORK ====================
📖 MANDATORY PRE-DEVELOPMENT READING:
   - Current project state and architecture
   - Completed tasks and pending work
   - Known issues and dependencies
   - File structure and configurations

📊 Current project stats:
   Total Files: 21
   Total Size: 0.2 MB
   Core Python Files: 1
   Documentation Files: 4

🎯 Pending tasks:
   Task 5: Add Missing PWA Files (30 minutes)
   Task 6: Test API Server (30 minutes)
   Task 7: Enhanced PWA Features (1-2 hours)
================================================================
```

### Step 2: Development Phase
During development, you have:
- ✅ **Full Context** - Complete understanding of project state
- ✅ **Task Tracking** - Automated logging of your work
- ✅ **Clear Instructions** - Specific guidance for your task
- ✅ **Commit Templates** - Standardized commit message format

### Step 3: Post-Development Documentation
The automated workflow will:
- ✅ Run `update_project_memory.sh` automatically
- ✅ Update project state tracking (file counts, sizes, etc.)
- ✅ Create timestamped backups
- ✅ Mark task as completed
- ✅ Generate new state snapshots

## Usage Examples

### Example 1: Starting Task 5 (PWA Files)
```bash
./project-memory/automated_workflow.sh "Add Missing PWA Files" 5
```

**Output:**
```
ℹ️  Starting Automated Development Workflow
ℹ️  Task: Add Missing PWA Files
ℹ️  Task Number: 5
ℹ️  Step 1: Pre-Development Memory Consultation
✅ Project memory consultation completed
✅ Development environment validated
ℹ️  Step 3: Task Execution Guidance

🚀 DEVELOPMENT PHASE INSTRUCTIONS:
   1. Implement the task: Add Missing PWA Files
   2. Test your implementation thoroughly
   3. Commit your changes with descriptive messages
   4. When complete, run the post-development workflow

📝 Recommended commit message format:
   ✅ Task 5 Complete: Add Missing PWA Files

🔄 After development, run:
   ./project-memory/automated_workflow.sh --post-dev "Add Missing PWA Files" 5
```

### Example 2: Completing Task 5
```bash
./project-memory/automated_workflow.sh --post-dev "Add Missing PWA Files" 5
```

**Output:**
```
ℹ️  Step 4: Post-Development Memory Update
ℹ️  Running automated project memory update...
✅ Project memory updated successfully
✅ Post-development workflow completed
ℹ️  Task 'Add Missing PWA Files' is now complete and documented
```

## File Structure Created

### Task Tracking
```
project-memory/logs/
├── current_task.json           # Active task information
├── workflow_YYYYMMDD_HHMMSS.log # Detailed workflow logs
└── project_state_*.json        # Historical state snapshots
```

### Task File Format
```json
{
  "task_description": "Add Missing PWA Files",
  "task_number": "5",
  "start_time": "2025-06-18T12:46:00Z",
  "workflow_log": "workflow_20250618_124600.log",
  "status": "in_progress"
}
```

## Integration with Existing Tools

### Automatic Integration
The workflow automatically integrates with:
- ✅ **update_project_memory.sh** - Runs automatically post-development
- ✅ **project_state_tracker.py** - Updates file counts and metrics
- ✅ **Git repository** - Validates git status and suggests commits
- ✅ **PROJECT_MEMORY_FRAMEWORK.md** - Reads and references current state

### Manual Integration
You can still use existing tools independently:
```bash
# Manual project memory update (if needed)
bash project-memory/update_project_memory.sh

# Manual state tracking (if needed)
python3 project-memory/project_state_tracker.py
```

## Benefits of Automated Workflow

### For Developers
- ✅ **No Memory Required** - System reminds you of project context
- ✅ **Consistent Process** - Same workflow for every task
- ✅ **Automatic Documentation** - No manual memory updates needed
- ✅ **Task Tracking** - Complete audit trail of all work
- ✅ **Error Prevention** - Validates environment before starting

### For Project Management
- ✅ **Complete Visibility** - Every task is tracked and documented
- ✅ **Historical Record** - Full audit trail of all changes
- ✅ **Consistent Documentation** - Standardized memory updates
- ✅ **Progress Tracking** - Clear task completion status
- ✅ **Quality Assurance** - Enforced consultation of project state

## Advanced Usage

### Custom Task Types
```bash
# Bug fixes
./project-memory/automated_workflow.sh "Fix CORS issue in API server"

# Features
./project-memory/automated_workflow.sh "Add dark mode toggle" 

# Refactoring
./project-memory/automated_workflow.sh "Refactor API endpoints"

# Documentation
./project-memory/automated_workflow.sh "Update README with deployment guide"
```

### Workflow Validation
```bash
# Check current task status
cat project-memory/logs/current_task.json

# View workflow logs
tail -f project-memory/logs/workflow_*.log

# Check project memory status
grep "Last Updated" project-memory/PROJECT_MEMORY_FRAMEWORK.md
```

## Troubleshooting

### Common Issues

**Issue: "Project memory framework not found"**
```bash
# Solution: Ensure you're in the project root
cd /path/to/ai-news-scraper
./project-memory/automated_workflow.sh "your task"
```

**Issue: "Not in a git repository"**
```bash
# Solution: Initialize git if needed
git init
git add .
git commit -m "Initial commit"
```

**Issue: "Uncommitted changes detected"**
```bash
# Solution: Commit or stash changes first
git add .
git commit -m "Save current work"
# Then run workflow
```

### Workflow Recovery
If a workflow is interrupted:
```bash
# Check current task
cat project-memory/logs/current_task.json

# Complete the workflow manually
./project-memory/automated_workflow.sh --post-dev "Previous Task Description"
```

## Best Practices

### Task Descriptions
- ✅ **Be Specific**: "Add PWA icons and service worker" not "Fix PWA"
- ✅ **Use Action Verbs**: "Implement", "Fix", "Add", "Update", "Refactor"
- ✅ **Include Context**: "Connect PWA to API server" not just "API work"

### Task Numbers
- ✅ **Use Sequential Numbers**: 1, 2, 3, 4, 5...
- ✅ **Reference Project Memory**: Check pending tasks for next number
- ✅ **Optional but Recommended**: Helps with tracking and organization

### Commit Messages
Follow the automated suggestions:
```bash
# Good
✅ Task 5 Complete: Add Missing PWA Files

# Better
✅ Task 5 Complete: Add PWA icons, service worker, and web manifest

# Best
✅ Task 5 Complete: Add Missing PWA Files
- Created favicon.ico, logo192.png, logo512.png
- Enhanced service worker with offline caching
- Updated web app manifest for installation
```

## Integration with AI Development

### For AI Assistants
When working with AI development assistants:

1. **Always start with the workflow**:
   ```bash
   ./project-memory/automated_workflow.sh "Task description" [number]
   ```

2. **Share the output** with your AI assistant so they have full context

3. **After AI completes the work**, run post-development:
   ```bash
   ./project-memory/automated_workflow.sh --post-dev "Task description" [number]
   ```

### Workflow Prompts for AI
```
"Before starting any development work, please run the automated workflow to read project memory:
./project-memory/automated_workflow.sh '[task description]' [task_number]

After completing the work, please run the post-development workflow:
./project-memory/automated_workflow.sh --post-dev '[task description]' [task_number]"
```

## Future Enhancements

### Planned Features
- 🔄 **Git Hook Integration** - Automatic workflow enforcement
- 📊 **Progress Dashboard** - Visual task completion tracking
- 🔔 **Notification System** - Alerts for incomplete workflows
- 📈 **Analytics** - Development velocity and pattern analysis
- 🤖 **AI Integration** - Automatic task description generation

### Configuration Options
- ⚙️ **Custom Templates** - Project-specific workflow templates
- 🎨 **Output Formatting** - Customizable display options
- 📝 **Commit Templates** - Project-specific commit message formats
- 🔍 **Validation Rules** - Custom environment validation

---

**Remember**: The automated workflow is designed to make development easier and more consistent. It ensures you always have the right context and that your work is properly documented without manual effort.

**Quick Reference**:
- Start task: `./project-memory/automated_workflow.sh "description" [number]`
- Complete task: `./project-memory/automated_workflow.sh --post-dev "description" [number]`
- Check status: `cat project-memory/logs/current_task.json`
