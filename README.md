# AI News Scraper - Mobile-Ready Platform

A comprehensive AI-powered news aggregation system with mobile-first architecture, featuring Python scrapers, Node.js API, and planned PWA/React Native frontends.

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Node.js 16+
- Anthropic API key

### Setup
```bash
# Clone repository
git clone https://github.com/dumitrudabija/AI_scraper_playground.git
cd AI_scraper_playground

# Install Python dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your ANTHROPIC_API_KEY

# Install API dependencies
cd api && npm install

# Start API server
npm run dev
```

## 📁 Project Structure

```
AI_scraper_playground/
├── 📂 scrapers/              # Python news scrapers
│   ├── weekly_scraper.py     # Weekly AI news aggregation
│   └── news_scraper.py       # Daily news scraping
├── 📂 api/                   # Node.js API server
│   ├── src/server.js         # Express API endpoints
│   ├── package.json          # API dependencies
│   └── README.md             # API documentation
├── 📂 docs/                  # Documentation
│   ├── GIT_SETUP_GUIDE.md    # Git workflow guide
│   ├── MOBILE_TRANSFORMATION_PROPOSAL.md # Architecture proposal
│   ├── API_SETUP_GUIDE.md    # API setup instructions
│   └── [other guides...]     # Additional documentation
├── 📂 project-memory/        # Project memory framework
│   ├── PROJECT_MEMORY_FRAMEWORK.md # Main framework document
│   ├── project_state_tracker.py    # State tracking automation
│   └── update_project_memory.sh    # Memory maintenance
├── 📂 reports/               # Generated news reports
├── 📂 logs/                  # Application logs
├── requirements.txt          # Python dependencies
├── .env.example             # Environment template
└── README.md                # This file
```

## 🔧 Core Features

### ✅ **Python Scrapers**
- **8+ News Sources**: OpenAI, Anthropic, Google AI, ArXiv, Hugging Face, GitHub, Reddit, Hacker News
- **AI Summarization**: Anthropic Claude 3.5 Sonnet integration
- **Beautiful Reports**: HTML weekly reports, Markdown daily reports
- **Error Handling**: Robust scraping with 95%+ success rate

### ✅ **Node.js API**
- **RESTful Endpoints**: Mobile-ready API for PWA/React Native
- **Security**: Rate limiting, CORS, helmet protection
- **On-Demand Scraping**: Trigger scraping via API calls
- **Report Serving**: Access to latest and historical reports

### ✅ **Project Memory Framework**
- **Automated State Tracking**: Real-time project monitoring
- **Change Detection**: Comprehensive evolution tracking
- **Documentation**: Self-updating project documentation

## 🌐 API Endpoints

```bash
# Health check
GET /health

# Reports
GET /api/reports/latest          # Latest weekly report
GET /api/reports/daily/latest    # Latest daily report
GET /api/reports/history         # All report history

# Scraping
POST /api/scrape/trigger         # Trigger on-demand scraping
Body: { "type": "weekly" | "daily" }

# Sources
GET /api/sources/status          # News source availability

# Notifications
POST /api/notifications/subscribe # Push notification subscription
```

## 📱 Mobile Architecture

### Current Status: **Phase 1 Complete** ✅
- ✅ **API Layer**: Node.js Express server with mobile endpoints
- ✅ **Python Integration**: Seamless scraper connectivity
- ✅ **Security**: Production-ready configuration

### Planned Development:
- **Phase 2**: PWA (Progressive Web App) development
- **Phase 3**: React Native mobile app
- **Phase 4**: Production deployment with automated scheduling

## 🚀 Deployment

### Local Development
```bash
# Start API server
cd api && npm run dev

# Run scrapers manually
python scrapers/weekly_scraper.py
python scrapers/news_scraper.py
```

### Production Deployment
- **Railway** (Recommended): Git-based deployment with cron support
- **Render**: Free tier with auto-deploy
- **Vercel**: Serverless functions for API

## 📊 Performance Metrics

- **Articles per Run**: 40-60 weekly, 15-25 daily
- **Processing Time**: 2-5 minutes per run
- **Success Rate**: >95% with graceful error handling
- **API Response**: <500ms for cached reports

## 🔐 Security Features

- **Environment Variables**: API keys protected via .env
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for mobile app origins
- **Input Validation**: Comprehensive request validation

## 📚 Documentation

- **[Git Setup Guide](docs/GIT_SETUP_GUIDE.md)**: Professional Git workflow
- **[API Documentation](api/README.md)**: Complete API reference
- **[Mobile Architecture](docs/MOBILE_TRANSFORMATION_PROPOSAL.md)**: Transformation proposal
- **[Project Memory](project-memory/PROJECT_MEMORY_FRAMEWORK.md)**: Complete project state

## 🛠 Development Workflow

### Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test
# ...

# Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create Pull Request on GitHub
```

### Project Memory Maintenance
```bash
# Update project memory after changes
./project-memory/update_project_memory.sh
```

## 🤝 Contributing

1. **Read Project Memory**: Review `project-memory/PROJECT_MEMORY_FRAMEWORK.md`
2. **Create Feature Branch**: `git checkout -b feature/your-feature`
3. **Follow Conventions**: Maintain code quality and documentation
4. **Update Memory**: Run memory update after changes
5. **Create Pull Request**: Submit for review

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- **GitHub Repository**: https://github.com/dumitrudabija/AI_scraper_playground
- **API Documentation**: [api/README.md](api/README.md)
- **Architecture Proposal**: [docs/MOBILE_TRANSFORMATION_PROPOSAL.md](docs/MOBILE_TRANSFORMATION_PROPOSAL.md)

---

**Status**: Phase 1 Complete - API layer ready for mobile development  
**Next Phase**: PWA development for mobile-first experience  
**Last Updated**: 2025-06-18
