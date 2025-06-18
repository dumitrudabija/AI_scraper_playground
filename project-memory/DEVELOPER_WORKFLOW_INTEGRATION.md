# AI News Scraper - Developer Workflow Integration

## 🎯 Mandatory Workflow for All Code Changes

This document establishes the **mandatory workflow** that must be followed before making any code changes to ensure the project memory framework is always consulted and updated.

## 📋 Pre-Development Checklist

### ✅ STEP 1: Read Current Project State
**BEFORE making ANY code changes, ALWAYS:**

```bash
# 1. Read the main framework document
cat PROJECT_MEMORY_FRAMEWORK.md

# 2. Check current project state
./project_state_tracker.py

# 3. Review recent changes
cat project_state.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('Recent files modified:')
for f in data['recent_activity']['recent_files_modified'][-10:]:
    print(f'  - {f[\"path\"]} ({f[\"modified\"]})')
"
```

### ✅ STEP 2: Understand Current Architecture
**Review these sections in PROJECT_MEMORY_FRAMEWORK.md:**
- Current Project State
- Architecture Overview  
- File Structure and Dependencies
- Known Limitations
- Recent Changes

### ✅ STEP 3: Validate Understanding
**Ask yourself:**
- What is the current implementation status?
- What files will my changes affect?
- How do my changes fit into the existing architecture?
- What dependencies might be impacted?
- Are there any known limitations I need to consider?

## 🔄 Post-Development Checklist

### ✅ STEP 1: Update Project Memory
**AFTER making ANY code changes, ALWAYS:**

```bash
# 1. Run complete memory update
./update_project_memory.sh

# 2. Verify state was captured
cat project_state.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(f'Last updated: {data[\"timestamp\"]}')
print(f'Total files: {data[\"project_structure\"][\"total_files\"]}')
"
```

### ✅ STEP 2: Update Framework Documentation
**Manually update PROJECT_MEMORY_FRAMEWORK.md for:**

#### Architecture Changes
```bash
# If you modified system architecture, update:
# - Architecture Overview section
# - Data Flow description
# - Technology Stack details
```

#### New Features
```bash
# If you added new features, update:
# - Current Project State > Core Features Implemented
# - File Structure and Dependencies
# - Configuration Management (if applicable)
```

#### Bug Fixes
```bash
# If you fixed bugs, update:
# - Known Limitations section
# - Recent Changes section
# - Performance Metrics (if applicable)
```

#### Configuration Changes
```bash
# If you changed configuration, update:
# - Configuration Management section
# - Environment Variables
# - Source Configurations
```

### ✅ STEP 3: Document Changes
**Add to Change History section:**

```markdown
### Recent Changes (YYYY-MM-DD):
- ✅ [Description of change]
- ✅ [Files modified]
- ✅ [Impact on architecture/functionality]
- ✅ [Any new dependencies or requirements]
```

## 🚨 Mandatory Integration Points

### Before Starting Development
```bash
#!/bin/bash
# pre-development-check.sh
echo "🔍 Checking current project state..."
./project_state_tracker.py
echo ""
echo "📖 Please review PROJECT_MEMORY_FRAMEWORK.md before proceeding"
echo "Press Enter when you've reviewed the current state..."
read
```

### After Completing Development
```bash
#!/bin/bash
# post-development-update.sh
echo "🔄 Updating project memory..."
./update_project_memory.sh
echo ""
echo "📝 Please update PROJECT_MEMORY_FRAMEWORK.md with your changes"
echo "   - Architecture changes"
echo "   - New features"
echo "   - Bug fixes"
echo "   - Configuration changes"
echo ""
echo "✅ Memory update complete"
```

## 📚 Framework Consultation Guidelines

### What to Check Before Changes

#### For New Features:
1. **Current Implementation Status** - What's already implemented?
2. **Architecture Overview** - How does this fit in?
3. **File Structure** - Where should new files go?
4. **Dependencies** - What libraries are already used?
5. **Configuration** - What settings exist?

#### For Bug Fixes:
1. **Known Limitations** - Is this a documented issue?
2. **Recent Changes** - Has this area been modified recently?
3. **Performance Metrics** - Are there performance implications?
4. **Error Handling** - How are similar errors handled?

#### For Refactoring:
1. **Architecture Overview** - What's the current design?
2. **File Structure** - What files will be affected?
3. **Dependencies** - What might break?
4. **Change History** - Why was it designed this way?

### What to Update After Changes

#### Always Update:
- **Last Updated timestamp** (automatic via update script)
- **Recent Changes section** with your modifications
- **Performance Metrics** if applicable

#### Update When Applicable:
- **Architecture Overview** for structural changes
- **File Structure** for new/moved/deleted files
- **Dependencies** for new requirements
- **Configuration** for new settings
- **Known Limitations** for fixes or new issues
- **Future Roadmap** for completed items

## 🔧 Automation Integration

### Git Hooks Integration
```bash
# .git/hooks/pre-commit
#!/bin/bash
echo "Checking project memory framework..."
if [ ! -f "PROJECT_MEMORY_FRAMEWORK.md" ]; then
    echo "❌ PROJECT_MEMORY_FRAMEWORK.md not found"
    exit 1
fi

# Check if framework is recent (within 24 hours)
if [ $(find PROJECT_MEMORY_FRAMEWORK.md -mtime -1 | wc -l) -eq 0 ]; then
    echo "⚠️  PROJECT_MEMORY_FRAMEWORK.md is older than 24 hours"
    echo "   Please run ./update_project_memory.sh before committing"
    exit 1
fi
```

### IDE Integration
```json
// VS Code tasks.json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Check Project Memory",
            "type": "shell",
            "command": "./project_state_tracker.py",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always"
            }
        },
        {
            "label": "Update Project Memory",
            "type": "shell",
            "command": "./update_project_memory.sh",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always"
            }
        }
    ]
}
```

## 📋 Development Workflow Template

### Starting New Work
```bash
# 1. Check current state
./project_state_tracker.py

# 2. Read framework documentation
code PROJECT_MEMORY_FRAMEWORK.md

# 3. Understand current architecture
# Review relevant sections based on your work

# 4. Plan your changes
# Consider impact on existing architecture

# 5. Begin development
```

### During Development
```bash
# Periodically check if your changes align with documented architecture
# If you discover the documentation is outdated, note what needs updating
```

### Completing Work
```bash
# 1. Test your changes
# Run existing tests and verify functionality

# 2. Update project memory
./update_project_memory.sh

# 3. Update framework documentation
# Edit PROJECT_MEMORY_FRAMEWORK.md with your changes

# 4. Commit changes
git add .
git commit -m "Description of changes + Updated project memory"
```

## 🎯 Quality Gates

### Before Code Review
- [ ] PROJECT_MEMORY_FRAMEWORK.md has been consulted
- [ ] Current project state has been verified
- [ ] Changes align with documented architecture
- [ ] Framework documentation has been updated
- [ ] Memory update script has been run

### Before Deployment
- [ ] All framework documentation is current
- [ ] Project state reflects actual implementation
- [ ] Performance metrics are updated
- [ ] Known limitations are documented
- [ ] Change history is complete

## 🚨 Enforcement Mechanisms

### Automated Checks
```bash
# check-memory-compliance.sh
#!/bin/bash
FRAMEWORK_AGE=$(find PROJECT_MEMORY_FRAMEWORK.md -mtime +1 | wc -l)
STATE_EXISTS=$([ -f project_state.json ] && echo "1" || echo "0")

if [ "$FRAMEWORK_AGE" -gt 0 ]; then
    echo "❌ Framework documentation is outdated"
    exit 1
fi

if [ "$STATE_EXISTS" -eq 0 ]; then
    echo "❌ Project state not tracked"
    exit 1
fi

echo "✅ Memory compliance check passed"
```

### Manual Verification
- Code reviews must verify framework consultation
- Deployment checklists must include memory updates
- Documentation reviews must validate accuracy

## 📈 Benefits of This Workflow

### For Current Development
- **Never work with outdated information**
- **Always understand current architecture**
- **Prevent architectural drift**
- **Maintain documentation accuracy**

### For Future Development
- **Complete context for any changes**
- **Historical understanding of decisions**
- **Accurate troubleshooting information**
- **Seamless knowledge transfer**

### For Project Maintenance
- **Self-documenting changes**
- **Automated compliance checking**
- **Consistent development practices**
- **Reduced technical debt**

## 🎯 Success Metrics

### Compliance Tracking
- Framework consultation before changes: **Target 100%**
- Memory updates after changes: **Target 100%**
- Documentation accuracy: **Target >95%**
- Change history completeness: **Target 100%**

### Quality Indicators
- Reduced debugging time due to accurate documentation
- Faster onboarding for new developers
- Fewer architectural inconsistencies
- Better decision-making with complete context

---

**This workflow ensures the project memory framework remains the single source of truth and is always current with the actual implementation.**

**Workflow Version**: 1.0  
**Last Updated**: 2025-06-18 08:08:00 AM (America/Toronto)  
**Compliance**: Mandatory for all code changes
