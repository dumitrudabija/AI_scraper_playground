# AI News Scraper - Project Memory Framework Usage Guide

## Overview
This guide explains how to use the comprehensive project memory framework designed to maintain complete visibility into the AI News Scraper project's state, implementation, and evolution.

## Framework Components

### 1. Core Files
- **`PROJECT_MEMORY_FRAMEWORK.md`** - Main framework document (single source of truth)
- **`project_state_tracker.py`** - Automated state analysis tool
- **`update_project_memory.sh`** - Memory maintenance automation script
- **`project_state.json`** - Current project state data (auto-generated)

### 2. Supporting Files
- **`project_state_previous.json`** - Previous state for change detection
- **`logs/memory_update.log`** - Memory framework operation logs
- **`logs/project_state_*.json`** - Historical state archives

---

## Quick Start

### 1. Manual State Check
```bash
# Run project state analysis
python3 project_state_tracker.py

# Or use the executable directly
./project_state_tracker.py
```

### 2. Complete Memory Update
```bash
# Run full memory framework update
./update_project_memory.sh
```

### 3. View Current State
```bash
# View the main framework document
cat PROJECT_MEMORY_FRAMEWORK.md

# View current state data
cat project_state.json | python3 -m json.tool
```

---

## Detailed Usage

### Project State Tracker (`project_state_tracker.py`)

#### Purpose
Automatically analyzes and tracks the current state of the project including:
- File structure and sizes
- Dependencies status
- Recent activity
- Automation setup
- Performance metrics

#### Usage
```bash
# Basic usage
python3 project_state_tracker.py

# With verbose output
python3 project_state_tracker.py 2>&1 | tee state_analysis.log
```

#### Output
- **Console**: Human-readable project summary
- **File**: `project_state.json` with detailed state data
- **Logs**: Analysis process logs

#### Example Output
```
============================================================
AI NEWS SCRAPER - PROJECT STATE SUMMARY
============================================================
📊 PROJECT OVERVIEW
   Total Files: 23
   Total Size: 2.1 MB
   Core Python Files: 4
   Documentation Files: 8

🔧 DEPENDENCIES
   Requirements File: ✅
   Listed Dependencies: 6
   Installed Packages: 45

📈 RECENT ACTIVITY (Last 7 Days)
   Files Modified: 3
   Reports Generated: 1

⚙️ AUTOMATION STATUS
   Executable Scripts: 3/3
   Cron Jobs Found: 1

📊 PERFORMANCE METRICS
   Recent Reports: 1
   Average Articles per Report: 42.0
============================================================
```

### Memory Update Script (`update_project_memory.sh`)

#### Purpose
Comprehensive memory framework maintenance including:
- Running state analysis
- Updating framework timestamps
- Creating backups
- Change detection
- Cleanup operations

#### Usage
```bash
# Basic usage
./update_project_memory.sh

# With detailed logging
./update_project_memory.sh 2>&1 | tee memory_update.log
```

#### Features
- **Automatic Backups**: Creates timestamped backups before updates
- **Change Detection**: Compares current vs previous state
- **Cleanup**: Removes old backups and archives
- **Status Reporting**: Comprehensive status summary
- **Error Handling**: Robust error handling with colored output

#### Example Output
```
ℹ️  AI News Scraper - Project Memory Update
==============================================
ℹ️  Running project state analysis...
✅ Project state analysis completed
✅ Project state file updated: project_state.json (12K)
ℹ️  Framework file backed up to: PROJECT_MEMORY_FRAMEWORK.md.backup.20250618_080330

ℹ️  Project Memory Update Summary:
  📊 Recent Reports (7 days): 1
  📝 Recent Logs (1 day): 2
  ⚙️  Cron Jobs Active: 1
  🔧 Executable Scripts: 3/3
  🔑 ✅ Environment configured
  📦 ✅ 6 dependencies listed

✅ Framework timestamp updated
ℹ️  Project state changes detected
ℹ️  Cleaning up old backups...
==============================================
✅ Project memory update completed successfully
ℹ️  Framework file: 45K, 892 lines
```

---

## Integration with Existing Automation

### Weekly Integration
Add memory updates to your weekly automation by modifying `run_weekly.sh`:

```bash
# Add to run_weekly.sh after the main scraper
echo "Updating project memory..."
./update_project_memory.sh
```

### Cron Job Integration
Set up automatic memory updates:

```bash
# Edit crontab
crontab -e

# Add memory update after weekly scraper (Monday 7:05 AM)
5 7 * * 1 /path/to/ai-news-scraper/update_project_memory.sh

# Or run daily at midnight
0 0 * * * /path/to/ai-news-scraper/update_project_memory.sh
```

### Manual Integration
Run memory updates after significant changes:

```bash
# After adding new features
git add . && git commit -m "Add new feature"
./update_project_memory.sh

# After configuration changes
vim .env
./update_project_memory.sh

# After dependency updates
pip install -r requirements.txt
./update_project_memory.sh
```

---

## Understanding the Framework

### Project Memory Framework Document

#### Structure
1. **Framework Components** - Overview of the memory system
2. **Current Project State** - Real-time project status
3. **Architecture Overview** - Technical implementation details
4. **File Structure and Dependencies** - Complete project inventory
5. **Configuration Management** - Settings and environment
6. **Change History and Evolution** - Project timeline
7. **Operational Status** - Deployment and automation status
8. **Future Roadmap** - Planned enhancements
9. **Usage Patterns** - How the project is used
10. **Maintenance and Support** - Ongoing care instructions

#### Key Sections to Monitor
- **Implementation Status**: Current feature completeness
- **Performance Metrics**: System performance indicators
- **Known Limitations**: Current constraints and issues
- **Recent Changes**: Latest modifications and updates

### State Data Structure

#### JSON Schema
```json
{
  "timestamp": "2025-06-18T08:03:00",
  "project_structure": {
    "core_files": [...],
    "documentation_files": [...],
    "automation_files": [...],
    "output_directories": [...],
    "total_files": 23,
    "total_size_mb": 2.1
  },
  "dependencies": {
    "requirements_file_exists": true,
    "dependencies": [...],
    "python_version": "3.x.x",
    "pip_packages": [...]
  },
  "recent_activity": {
    "recent_files_modified": [...],
    "recent_reports_generated": [...],
    "log_file_status": {...}
  },
  "automation_status": {
    "shell_scripts": [...],
    "cron_jobs": [...],
    "executable_permissions": {...}
  },
  "performance_metrics": {
    "recent_report_sizes": [...],
    "article_counts": [...],
    "success_indicators": [...]
  }
}
```

---

## Maintenance Schedule

### Daily (Automated)
- State tracking via cron job
- Log file monitoring
- Basic health checks

### Weekly (Automated)
- Comprehensive state analysis
- Framework timestamp updates
- Backup creation
- Change detection

### Monthly (Manual)
- Framework content review
- Performance metrics analysis
- Dependency updates
- Documentation updates

### Quarterly (Manual)
- Complete framework overhaul
- Architecture review
- Roadmap updates
- Historical analysis

---

## Troubleshooting

### Common Issues

#### 1. State Tracker Fails
```bash
# Check Python installation
python3 --version

# Check file permissions
ls -la project_state_tracker.py

# Run with verbose output
python3 project_state_tracker.py 2>&1 | tee debug.log
```

#### 2. Memory Update Script Fails
```bash
# Check script permissions
ls -la update_project_memory.sh

# Check dependencies
which python3
which sed

# Run with debug mode
bash -x update_project_memory.sh
```

#### 3. Framework File Issues
```bash
# Check file exists and is writable
ls -la PROJECT_MEMORY_FRAMEWORK.md

# Restore from backup if needed
cp PROJECT_MEMORY_FRAMEWORK.md.backup.* PROJECT_MEMORY_FRAMEWORK.md
```

#### 4. State File Corruption
```bash
# Validate JSON format
python3 -m json.tool project_state.json

# Restore from archive if needed
cp logs/project_state_*.json project_state.json
```

### Log Analysis
```bash
# Check memory update logs
tail -f logs/memory_update.log

# Check state tracker logs
grep ERROR logs/memory_update.log

# Check system logs for cron jobs
grep "update_project_memory" /var/log/syslog
```

---

## Advanced Usage

### Custom State Analysis
```python
# Load and analyze state data
import json
with open('project_state.json', 'r') as f:
    state = json.load(f)

# Analyze file growth
core_files = state['project_structure']['core_files']
total_lines = sum(f['lines'] for f in core_files)
print(f"Total code lines: {total_lines}")

# Check recent activity
recent_files = state['recent_activity']['recent_files_modified']
print(f"Files modified recently: {len(recent_files)}")
```

### Framework Customization
```bash
# Add custom sections to framework
echo "## Custom Section" >> PROJECT_MEMORY_FRAMEWORK.md
echo "Custom content here" >> PROJECT_MEMORY_FRAMEWORK.md

# Update framework
./update_project_memory.sh
```

### Integration with CI/CD
```yaml
# GitHub Actions example
- name: Update Project Memory
  run: |
    ./update_project_memory.sh
    git add PROJECT_MEMORY_FRAMEWORK.md project_state.json
    git commit -m "Update project memory framework" || true
```

---

## Best Practices

### 1. Regular Updates
- Run memory updates after significant changes
- Schedule automatic updates via cron
- Review framework monthly

### 2. Backup Management
- Keep framework backups for rollback
- Archive state history for analysis
- Monitor backup disk usage

### 3. Change Tracking
- Document major changes in framework
- Use state comparison for change detection
- Maintain change history

### 4. Performance Monitoring
- Track framework file size growth
- Monitor state analysis performance
- Optimize for large projects

### 5. Documentation Sync
- Keep framework in sync with actual implementation
- Update after configuration changes
- Validate framework accuracy regularly

---

## Framework Benefits

### For Development
- **Complete Project Visibility**: Always know current project state
- **Change Tracking**: Understand what changed and when
- **Dependency Management**: Track all project dependencies
- **Performance Monitoring**: Monitor system performance over time

### For Maintenance
- **Automated Documentation**: Self-updating project documentation
- **Health Monitoring**: Continuous project health checks
- **Issue Detection**: Early detection of configuration issues
- **Historical Analysis**: Track project evolution over time

### For Collaboration
- **Onboarding**: New team members get complete project context
- **Knowledge Transfer**: Comprehensive project understanding
- **Decision Making**: Data-driven project decisions
- **Status Reporting**: Automated project status reports

---

## Support and Resources

### Documentation
- `PROJECT_MEMORY_FRAMEWORK.md` - Main framework document
- `PROJECT_MEMORY_USAGE_GUIDE.md` - This usage guide
- `README.md` - Project overview
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details

### Tools
- `project_state_tracker.py` - State analysis tool
- `update_project_memory.sh` - Memory maintenance script
- `logs/` - All framework operation logs

### Getting Help
1. Check the troubleshooting section above
2. Review log files for error details
3. Validate JSON state files
4. Restore from backups if needed
5. Run tools with verbose output for debugging

---

*This usage guide ensures effective utilization of the project memory framework for maintaining complete project visibility and control.*

**Last Updated**: 2025-06-18 08:03:00 AM (America/Toronto)
**Guide Version**: 1.0
