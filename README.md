# AI News Scraper

**Status**: ✅ **PRODUCTION READY - REAL DATA FLOWING**  
**Live App**: https://ai-scraper-playground.vercel.app/  
**Last Updated**: June 27, 2025

A real-time AI news aggregation platform featuring a Progressive Web App (PWA) with live RSS scraping from 11 major AI news sources and AI-powered article summaries.

## 🎯 **Current Features**

### ✅ **Live AI News Aggregation**
- **Real-time RSS Scraping**: 11 major AI news sources
- **Fresh Data**: Articles updated on every request
- **AI Enhancement**: Claude-powered article summaries
- **Mobile-First PWA**: Installable, offline-capable web app
- **Vercel Deployment**: Production-ready serverless hosting
- **Smart Fallback**: Real URLs even when RSS scraping fails

### 📊 **Active Data Sources**
1. **OpenAI Blog** - Latest AI research and announcements
2. **Anthropic Blog** - AI safety and research updates
3. **Google AI Blog** - Google's AI research and developments
4. **ArXiv AI Papers** - Latest academic AI research
5. **Hugging Face Blog** - Open-source AI and ML updates
6. **GitHub AI Trending** - Popular AI repositories and projects
7. **TechCrunch AI** - AI business and industry news
8. **VentureBeat AI** - AI startup and investment news
9. **Hacker News** - AI discussions and community insights
10. **r/MachineLearning** - Reddit ML community updates
11. **r/LocalLLaMA** - Local AI model discussions

## 🚀 **Quick Start**

### **View Live App**
Visit: **https://ai-scraper-playground.vercel.app/**

### **API Endpoints**
- **Latest News**: `GET /api/reports/latest`
- **Trigger Scraping**: `POST /api/scrape/optimized`

### **Local Development**
```bash
# Clone repository
git clone https://github.com/dumitrudabija/AI_scraper_playground.git
cd AI_scraper_playground

# Install PWA dependencies
cd pwa && npm install

# Start development server
npm start
```

## 🏗️ **Architecture**

### **Frontend (PWA)**
- **Framework**: React.js
- **Features**: Responsive design, offline support, installable
- **Location**: `/pwa/` directory
- **API Integration**: Connects to Vercel serverless functions

### **Backend (API)**
- **Runtime**: Node.js (Vercel Serverless Functions)
- **Location**: `/api/` directory
- **Data Processing**: Native RSS parsing, no external dependencies
- **AI Enhancement**: Anthropic Claude integration

### **Deployment**
- **Platform**: Vercel
- **Auto-Deploy**: GitHub integration
- **Performance**: 15-30 second response times for fresh data
- **AI Enhancement**: 10-15 articles enhanced per request

## 📁 **Project Structure**

```
ai-news-scraper/
├── 📱 pwa/                      # React PWA Frontend
│   ├── src/
│   │   ├── App.js              # Main app component
│   │   ├── screens/            # App screens (Home, Reports, Settings)
│   │   ├── components/         # Reusable UI components
│   │   └── contexts/           # API and Theme contexts
│   └── public/                 # Static assets and PWA manifest
├── 🔧 api/                     # Vercel API Functions
│   ├── reports/latest.js       # Main data endpoint
│   └── scrape/optimized.js     # Scraping trigger
├── 📚 docs/                    # Documentation (legacy)
├── 🧠 project-memory/          # Project state tracking
├── vercel.json                 # Deployment configuration
├── CURRENT_PROJECT_STATE.md    # Detailed current state
└── README.md                   # This file
```

## 🔧 **Technical Implementation**

### **RSS Scraping Process**
1. **Parallel Fetching**: All 11 sources scraped simultaneously
2. **XML Parsing**: Custom regex-based RSS parser
3. **Content Cleaning**: HTML removal and entity decoding
4. **Quality Filtering**: Skip short, empty, or malformed articles
5. **Data Aggregation**: Combine, deduplicate, sort by date
6. **AI Enhancement**: Claude generates catchy summaries
7. **JSON Response**: Structured data for PWA consumption

### **Error Handling & Fallback**
- **Per-Source Fallback**: Failed sources don't break the process
- **Smart Fallback Data**: Real AI news source URLs (no example.com)
- **Timeout Protection**: 10-second timeout per RSS feed
- **Graceful Degradation**: App continues with partial data
- **AI Fallback**: Original descriptions if AI enhancement fails

### **Recent Updates (June 27, 2025)**
- **Fixed Read More Button**: All links now point to real articles
- **Enhanced Fallback System**: Proper error handling with real URLs
- **AI Integration**: Working Claude summaries for better UX

## 📱 **PWA Features**

### **Mobile Experience**
- **Responsive Design**: Optimized for all screen sizes
- **Add to Home Screen**: Native app-like installation
- **Offline Support**: Service worker for cached content
- **Fast Loading**: Optimized performance and caching

### **User Interface**
- **Real Headlines**: Current AI news from major publications
- **Source Attribution**: Color-coded source identification
- **AI Summaries**: Short, catchy phrases for quick understanding
- **Fresh Timestamps**: Live generation times
- **Working Links**: All "Read More" buttons open real articles

## 🧪 **Testing & Verification**

### **Live Endpoints**
```bash
# Get latest AI news
curl https://ai-scraper-playground.vercel.app/api/reports/latest

# Trigger fresh scraping
curl -X POST https://ai-scraper-playground.vercel.app/api/scrape/optimized
```

### **Expected Response**
```json
{
  "success": true,
  "data": {
    "report_date": "2025-06-27",
    "generated_at": "2025-06-27T17:00:00.000Z",
    "total_articles": 18,
    "sources_count": 8,
    "articles": [...],
    "sources": [...],
    "ai_enhanced": 15
  }
}
```

## 🔄 **Development Workflow**

### **Making Changes**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Auto-deploy via Vercel
```

### **Adding New Sources**
1. Edit `api/reports/latest.js`
2. Add source to the `allSources` array
3. Add corresponding fallback URL to `generateSampleArticles`
4. Test RSS feed compatibility
5. Deploy via git push

## 📊 **Performance Metrics**

- **Response Time**: 15-30 seconds for fresh data
- **Articles per Request**: 15-25 articles
- **Sources per Request**: 5-11 active sources
- **AI Enhancement**: 10-15 articles per request
- **Uptime**: 99.9% (Vercel infrastructure)
- **Mobile Performance**: Optimized for mobile devices

## 🛠 **Maintenance**

### **Regular Tasks**
- Monitor RSS feed availability
- Check response times and performance
- Update dependencies as needed
- Verify PWA installation functionality
- Monitor AI API usage and costs

### **Troubleshooting**
- **Vercel Logs**: Check function execution logs
- **RSS Validation**: Test individual feed URLs
- **PWA Testing**: Verify installation and offline features
- **AI Enhancement**: Monitor Claude API responses

## 🎯 **Future Enhancements**

### **Immediate Opportunities**
- **More Sources**: Expand to additional AI news outlets
- **Caching**: Add Redis for faster response times
- **Push Notifications**: Real-time news alerts
- **Advanced Filtering**: Topic-based categorization

### **Long-term Roadmap**
- **User Accounts**: Personalized news preferences
- **Analytics**: User engagement tracking
- **Native Apps**: iOS/Android development
- **Advanced AI**: Better summarization and categorization

## 📚 **Documentation**

- **[Current State](CURRENT_PROJECT_STATE.md)**: Detailed project status
- **[Project Memory](project-memory/)**: Development tracking system
- **[Vercel Deployment](docs/VERCEL_DEPLOYMENT_GUIDE.md)**: Deployment guide

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/your-feature`
3. **Make changes** and test locally
4. **Update documentation** if needed
5. **Submit pull request**

## 📄 **License**

MIT License - see LICENSE file for details.

## 🔗 **Links**

- **Live Application**: https://ai-scraper-playground.vercel.app/
- **GitHub Repository**: https://github.com/dumitrudabija/AI_scraper_playground
- **Main API Endpoint**: https://ai-scraper-playground.vercel.app/api/reports/latest

---

**Project Status**: 🟢 **FULLY OPERATIONAL**  
**Real Data**: ✅ Live AI news from 11 major sources  
**Mobile Ready**: ✅ PWA with offline support  
**Production**: ✅ Deployed and stable on Vercel  
**AI Enhanced**: ✅ Claude-powered article summaries  
**Quality Links**: ✅ All "Read More" buttons work properly
