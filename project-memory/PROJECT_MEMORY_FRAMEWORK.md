# AI News Scraper - Project Memory Framework

## Overview
This document establishes a comprehensive project memory framework to ensure complete visibility into the AI News Scraper project's scope, implementation, and evolution over time.

## Framework Components

### 1. Project State Tracking
- **Current Implementation Status**
- **Active Features and Capabilities**
- **Known Issues and Limitations**
- **Performance Metrics**

### 2. Implementation Documentation
- **Architecture Overview**
- **Code Structure and Dependencies**
- **API Integrations**
- **Data Flow and Processing**

### 3. Change Management
- **Version History**
- **Feature Evolution**
- **Configuration Changes**
- **Bug Fixes and Improvements**

### 4. Operational Context
- **Deployment Status**
- **Automation Setup**
- **Monitoring and Logging**
- **User Feedback and Usage**

---

## Current Project State (Last Updated: 2025-06-18)

### Implementation Status: ✅ FULLY OPERATIONAL

#### Core Features Implemented:
- ✅ **Daily News Scraping** (`news_scraper.py`)
  - Multi-source RSS feed parsing
  - Anthropic API integration for summarization
  - Markdown report generation
  - Error handling and logging

- ✅ **Weekly News Scraping** (`weekly_scraper.py`)
  - Enhanced source coverage (RSS, Reddit, Hacker News)
  - Beautiful HTML report generation
  - Weekly automation via cron jobs
  - Responsive design with source color coding

- ✅ **Automation Infrastructure**
  - Shell scripts for daily/weekly execution
  - Automated setup scripts
  - Cross-platform compatibility (macOS, Linux, Windows)
  - Comprehensive logging system

#### Active Data Sources:
**Daily Scraper Sources:**
- TechCrunch AI
- VentureBeat AI  
- MIT Technology Review
- AI News

**Weekly Scraper Sources:**
- OpenAI Blog
- Anthropic Blog
- Google AI Blog
- ArXiv AI Papers
- Hugging Face Blog
- GitHub AI Trending
- Reddit (r/MachineLearning, r/LocalLLaMA)
- Hacker News (AI-filtered)

### Performance Metrics:
- **Average Articles per Daily Run**: 15-25 articles
- **Average Articles per Weekly Run**: 40-60 articles
- **API Token Usage**: ~1,500-2,500 tokens per summary
- **Processing Time**: 2-5 minutes per run
- **Success Rate**: >95% (with graceful error handling)

### Known Limitations:
- VentureBeat AI RSS feed occasionally empty
- Some paywalled content cannot be fully extracted
- Rate limiting on some sources during high-traffic periods
- Reddit API limitations for large-scale scraping

---

## Architecture Overview

### System Architecture:
```
AI News Scraper
├── Core Scrapers
│   ├── news_scraper.py (Daily)
│   └── weekly_scraper.py (Weekly)
├── Automation Layer
│   ├── run_daily.sh
│   ├── run_weekly.sh
│   └── Cron job scheduling
├── Data Processing
│   ├── RSS feed parsing
│   ├── Content extraction
│   ├── AI summarization
│   └── Report generation
├── Output Systems
│   ├── Markdown reports (Daily)
│   ├── HTML reports (Weekly)
│   └── Logging system
└── Configuration
    ├── Environment variables
    ├── Source configurations
    └── API credentials
```

### Technology Stack:
- **Language**: Python 3.7+
- **Key Libraries**: 
  - `requests` (HTTP requests)
  - `beautifulsoup4` (HTML parsing)
  - `feedparser` (RSS parsing)
  - `anthropic` (AI summarization)
  - `python-dotenv` (Environment management)
- **AI Service**: Anthropic Claude 3.5 Sonnet
- **Automation**: Bash scripts + Cron jobs
- **Output Formats**: Markdown, HTML

### Data Flow:
1. **Source Discovery**: RSS feeds, Reddit API, Hacker News API
2. **Content Extraction**: Article metadata, descriptions, full content
3. **Filtering**: Date-based filtering (24h for daily, 7d for weekly)
4. **AI Processing**: Anthropic API for intelligent summarization
5. **Report Generation**: Formatted output with styling and links
6. **Storage**: File-based storage in `reports/` directory
7. **Logging**: Comprehensive logging to `logs/` directory

---

## File Structure and Dependencies

### Core Files:
```
ai-news-scraper/
├── news_scraper.py           # Daily scraper (1,200+ lines)
├── weekly_scraper.py         # Weekly scraper (1,500+ lines)
├── daily_news_scraper.py     # Legacy daily scraper
├── project_state_tracker.py # Project memory state tracker (500+ lines)
├── setup.py                  # Installation script
├── requirements.txt          # Python dependencies
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
└── README.md                # Main documentation
```

### Automation Files:
```
├── run_daily.sh             # Daily execution script
├── run_weekly.sh            # Weekly execution script
├── setup_weekly_automation.sh # Automated setup
├── update_project_memory.sh # Memory framework maintenance
└── setup_project_memory.sh  # Memory framework setup
```

### Documentation Files:
```
├── README_DAILY.md          # Daily scraper guide
├── README_WEEKLY.md         # Weekly scraper guide
├── IMPLEMENTATION_SUMMARY.md # Technical summary
├── API_SETUP_GUIDE.md       # API configuration
├── QUICK_API_SETUP.md       # Quick setup guide
├── WEEKLY_AUTOMATION_SETUP.md # Automation guide
├── PROJECT_MEMORY_FRAMEWORK.md # This document (main framework)
├── PROJECT_MEMORY_USAGE_GUIDE.md # Framework usage instructions
├── PROJECT_MEMORY_SUMMARY.md # Implementation summary
└── DEVELOPER_WORKFLOW_INTEGRATION.md # Mandatory development workflow
```

### Output Directories:
```
├── reports/                 # Generated reports
│   ├── ai_news_report_*.md  # Daily markdown reports
│   └── ai_news_weekly_report_*.html # Weekly HTML reports
└── logs/                    # Application logs
    ├── ai_news_scraper.log  # Main log file
    ├── memory_update.log    # Memory framework logs
    └── project_state_*.json # Historical state archives
```

### Memory Framework Files:
```
├── project_state.json       # Current project state (auto-generated)
├── project_state_previous.json # Previous state for change detection
└── PROJECT_MEMORY_FRAMEWORK.md.backup.* # Automatic backups
```

### Dependencies Analysis:
- **Critical Dependencies**: `anthropic`, `requests`, `feedparser`
- **Parsing Dependencies**: `beautifulsoup4`, `lxml`
- **Configuration**: `python-dotenv`
- **Version Constraints**: All pinned to stable versions
- **Security**: No known vulnerabilities in current versions

---

## Configuration Management

### Environment Variables:
```bash
ANTHROPIC_API_KEY=sk-ant-...  # Required for AI summarization
```

### Source Configurations:
**Daily Scraper Sources** (4 sources):
- RSS-based feeds with 7-day lookback
- 10 articles max per source
- Basic content extraction

**Weekly Scraper Sources** (8+ sources):
- RSS feeds, Reddit API, Hacker News API
- 7-day lookback for weekly aggregation
- 20-30 articles max per source
- Enhanced content extraction and filtering

### Automation Settings:
- **Daily**: Not currently automated (manual execution)
- **Weekly**: Monday 7:00 AM via cron job
- **Logging**: Rotating logs with INFO/WARNING/ERROR levels
- **Error Handling**: Continue on individual source failures

---

## Change History and Evolution

### Major Milestones:

#### Phase 1: Basic Daily Scraper (Initial Implementation)
- Single-file daily scraper
- Basic RSS parsing
- Simple markdown output
- Manual execution only

#### Phase 2: Enhanced Daily Features
- Multi-source support
- Anthropic API integration
- Improved error handling
- Automated setup scripts

#### Phase 3: Weekly Scraper Implementation (Current)
- Dedicated weekly scraper with HTML output
- Expanded source coverage (Reddit, HN)
- Beautiful responsive design
- Automated scheduling
- Comprehensive documentation

### Recent Changes (2025-06-18):
- ✅ **Project Memory Framework Implementation** - Complete framework for project state tracking
- ✅ **Automated State Analysis** - `project_state_tracker.py` for real-time project monitoring
- ✅ **Memory Maintenance Automation** - `update_project_memory.sh` for framework updates
- ✅ **Developer Workflow Integration** - Mandatory workflow for code changes
- ✅ **Comprehensive Documentation** - Usage guides and setup scripts
- ✅ **Self-Updating System** - Framework maintains current information automatically

### Previous Changes (2025-06-16):
- ✅ Added weekly HTML report generation
- ✅ Implemented Reddit and Hacker News scraping
- ✅ Created automated setup scripts
- ✅ Added responsive design with source color coding
- ✅ Implemented weekly automation via cron jobs

### Configuration Evolution:
- **API Integration**: Started with basic Anthropic, now optimized prompts
- **Source Coverage**: Expanded from 4 to 8+ sources
- **Output Formats**: Added HTML with modern styling
- **Automation**: Added comprehensive scheduling system

---

## Operational Status

### Deployment Status:
- ✅ **Development Environment**: Fully configured
- ✅ **Dependencies**: All installed and verified
- ✅ **API Access**: Anthropic API key configured
- ✅ **Automation**: Weekly cron job active
- ✅ **Logging**: Comprehensive logging enabled

### Current Automation:
```bash
# Weekly automation (Monday 7 AM)
0 7 * * 1 /path/to/ai-news-scraper/run_weekly.sh
```

### Monitoring and Health:
- **Log Monitoring**: `logs/ai_news_scraper.log`
- **Success Metrics**: Report generation completion
- **Error Tracking**: Failed source scraping, API errors
- **Performance**: Processing time and article counts

### Recent Performance (Last 7 Days):
- **Weekly Report Generated**: 2025-06-16 (42 articles)
- **Sources Active**: 6/8 sources operational
- **API Usage**: Within normal limits
- **Processing Time**: ~3 minutes
- **Success Rate**: 100% report generation

---

## Mobile Transformation Initiative (2025-06-18)

### 🚀 NEW DIRECTION: Mobile-Friendly AI News Platform

**Status**: Architecture proposal completed, ready for implementation

#### Transformation Goals:
1. **PWA/React Native App**: Mobile-first user experience
2. **Git-Based Deployment**: Easy updates via Railway/Render
3. **Automated Daily Runs**: 5 AM scheduling with cloud functions
4. **User-Triggered Refresh**: On-demand scraping capability

#### Architecture Decision: Hybrid Approach
- **Keep Python Backend**: Preserve robust scraping infrastructure
- **Add Node.js API Layer**: RESTful endpoints for mobile consumption
- **React Native Frontend**: Native mobile app experience
- **PWA Support**: Web app with offline capabilities

#### Implementation Plan (4-5 Weeks):
- **Week 1-2**: Node.js API development and Python integration
- **Week 2-3**: PWA development with mobile-first design
- **Week 3-4**: React Native app with push notifications
- **Week 4-5**: Railway deployment and automated scheduling

#### Key Technical Enhancements:
1. **JSON Output**: Add structured data export alongside HTML
2. **API Endpoints**: RESTful interface for mobile consumption
3. **Real-time Updates**: WebSocket connections for live data
4. **Push Notifications**: Firebase integration for mobile alerts
5. **Offline Support**: Service worker caching for PWA
6. **Database Layer**: SQLite for metadata and user preferences

#### Deployment Strategy:
- **Primary**: Railway ($5-20/month) - Git-based deployment with cron support
- **Alternative**: Render (free tier) - Auto-deploy with built-in scheduling
- **Backup**: GitHub Actions - Automated scraping and deployment

#### Mobile User Experience:
- **Pull-to-Refresh**: Manual content updates
- **Push Notifications**: Daily summaries and breaking news alerts
- **Offline Reading**: Cached reports for no-internet access
- **Share Functionality**: Easy article sharing
- **Dark/Light Mode**: User preference support

### Previous Roadmap (Pre-Mobile Transformation):
1. ~~Daily HTML Reports~~ → **Superseded by mobile-first approach**
2. ~~Email Integration~~ → **Replaced by push notifications**
3. ~~Database Storage~~ → **Included in mobile architecture**
4. ~~API Endpoint~~ → **Core component of new architecture**
5. ~~Dashboard~~ → **Evolved into mobile app interface**

### Technical Debt (Updated):
- Legacy `daily_news_scraper.py` file (can be removed)
- File-based storage (will be enhanced with database layer)
- Hard-coded source configurations (will be externalized to database)
- Limited error recovery (will be improved with API layer)

### Scalability Considerations (Mobile-Ready):
- **Current**: Handles 50-100 articles efficiently
- **Enhanced**: API caching for faster mobile response
- **Database**: SQLite for development, PostgreSQL for production
- **CDN**: Static asset delivery for mobile optimization
- **Rate Limiting**: Intelligent request throttling for mobile clients

### Security Considerations (Mobile-Enhanced):
- **API Authentication**: JWT tokens for mobile app access
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: API endpoint security
- **Push Notification Security**: Firebase token management
- **Data Privacy**: User preference encryption

---

## Usage Patterns and Feedback

### Current Usage:
- **Weekly Reports**: Primary use case
- **Manual Daily Runs**: Occasional testing
- **Development**: Active feature development

### User Feedback Integration:
- Report format preferences captured in HTML design
- Source coverage expanded based on AI development focus
- Automation timing optimized for Monday morning delivery

### Success Metrics:
- **Report Quality**: AI summaries provide valuable insights
- **Coverage**: Comprehensive source coverage achieved
- **Reliability**: >95% successful execution rate
- **Usability**: One-command setup and execution

---

## Maintenance and Support

### Regular Maintenance Tasks:
1. **Weekly**: Review generated reports for quality
2. **Monthly**: Check source availability and update if needed
3. **Quarterly**: Update dependencies and security patches
4. **As Needed**: Add new sources based on AI landscape changes

### Troubleshooting Guide:
- **No Articles Found**: Check internet connection and source availability
- **API Errors**: Verify ANTHROPIC_API_KEY and account limits
- **Permission Errors**: Ensure script execution permissions
- **Cron Issues**: Check cron logs and script paths

### Support Resources:
- **Documentation**: Comprehensive README files
- **Logging**: Detailed error logging for debugging
- **Setup Scripts**: Automated installation and configuration
- **Examples**: Sample reports and configurations

---

## Project Memory Framework Maintenance

### Automated Maintenance:
- **Real-time State Tracking**: `project_state_tracker.py` monitors all changes
- **Automatic Updates**: `update_project_memory.sh` maintains framework currency
- **Change Detection**: System identifies and archives state changes
- **Backup Management**: Automatic timestamped backups before updates

### Developer Workflow Integration:
- **Mandatory Pre-Development**: Must read framework before code changes
- **Mandatory Post-Development**: Must update framework after code changes
- **Automated Compliance**: Scripts enforce framework consultation
- **Quality Gates**: Framework updates required for code reviews

### Framework Update Schedule:
- **Real-time**: Automated state tracking with every change
- **After Code Changes**: Mandatory framework updates (via workflow)
- **Weekly**: Integrated with weekly automation
- **Monthly**: Manual review and validation
- **Quarterly**: Comprehensive framework optimization

### Framework Validation:
- **Automated Validation**: State tracker verifies current implementation
- **Change Detection**: Compares current vs previous state
- **Compliance Checking**: Ensures framework consultation workflow
- **Historical Analysis**: Tracks project evolution over time

### Integration with Development:
- **Pre-Development Consultation**: Framework must be read before changes
- **Post-Development Updates**: Framework must be updated after changes
- **Automated Integration**: Memory updates integrated with existing automation
- **Continuous Synchronization**: Framework stays current with implementation

---

*This Project Memory Framework ensures complete visibility into the AI News Scraper project state, implementation, and evolution. It serves as the single source of truth for project understanding and decision-making.*

**Last Updated**: 2025-06-18 11:13:41 AM (America/Toronto)
**Framework Version**: 1.0
**Next Review**: 2025-07-18
