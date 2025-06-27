# AI News Scraper

**Status**: ✅ **PRODUCTION READY - REAL DATA FLOWING**  
**Live App**: https://ai-scraper-playground.vercel.app/  
**Last Updated**: June 27, 2025

A real-time AI news aggregation platform featuring a Progressive Web App (PWA) with live RSS scraping from major AI news sources.

## 🎯 **Current Features**

### ✅ **Live AI News Aggregation**
- **Real-time RSS Scraping**: 5 major AI news sources
- **Fresh Data**: Articles updated on every request
- **Mobile-First PWA**: Installable, offline-capable web app
- **Vercel Deployment**: Production-ready serverless hosting

### 📊 **Active Data Sources**
1. **TechCrunch AI** - Latest AI business news
2. **VentureBeat AI** - AI industry coverage  
3. **MIT Technology Review** - In-depth AI analysis
4. **AI News** - Dedicated AI news platform
5. **The Verge AI** - Consumer AI technology

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

### **Backend (API)**
- **Runtime**: Node.js (Vercel Serverless Functions)
- **Location**: `/api/` directory
- **Data Processing**: Native RSS parsing, no external dependencies

### **Deployment**
- **Platform**: Vercel
- **Auto-Deploy**: GitHub integration
- **Performance**: 15-30 second response times for fresh data

## 📁 **Project Structure**

```
ai-news-scraper/
├── 📱 pwa/                      # React PWA Frontend
│   ├── src/
│   │   ├── App.js              # Main app component
│   │   ├── screens/            # App screens (Home, Reports, Settings)
│   │   └── components/         # Reusable UI components
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
1. **Parallel Fetching**: All sources scraped simultaneously
2. **XML Parsing**: Custom regex-based RSS parser
3. **Content Cleaning**: HTML removal and entity decoding
4. **Data Aggregation**: Combine, deduplicate, sort by date
5. **JSON Response**: Structured data for PWA consumption

### **Error Handling**
- **Per-Source Fallback**: Failed sources don't break the process
- **Sample Data Generation**: Realistic fallback if all sources fail
- **Timeout Protection**: 10-second timeout per RSS feed
- **Graceful Degradation**: App continues with partial data

## 📱 **PWA Features**

### **Mobile Experience**
- **Responsive Design**: Optimized for all screen sizes
- **Add to Home Screen**: Native app-like installation
- **Offline Support**: Service worker for cached content
- **Fast Loading**: Optimized performance and caching

### **User Interface**
- **Real Headlines**: Current AI news from major publications
- **Source Attribution**: Color-coded source identification
- **Fresh Timestamps**: Live generation times
- **Article Links**: Direct access to original articles

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
    "generated_at": "2025-06-27T14:00:00.000Z",
    "total_articles": 18,
    "sources_count": 4,
    "articles": [...],
    "sources": [...]
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
2. Add source to the `sources` array
3. Test RSS feed compatibility
4. Deploy via git push

## 📊 **Performance Metrics**

- **Response Time**: 15-30 seconds for fresh data
- **Articles per Request**: 15-25 articles
- **Sources per Request**: 3-5 active sources
- **Uptime**: 99.9% (Vercel infrastructure)
- **Mobile Performance**: Optimized for mobile devices

## 🛠 **Maintenance**

### **Regular Tasks**
- Monitor RSS feed availability
- Check response times and performance
- Update dependencies as needed
- Verify PWA installation functionality

### **Troubleshooting**
- **Vercel Logs**: Check function execution logs
- **RSS Validation**: Test individual feed URLs
- **PWA Testing**: Verify installation and offline features

## 🎯 **Future Enhancements**

### **Immediate Opportunities**
- **AI Summarization**: Integrate Anthropic API for content summaries
- **Caching**: Add Redis for faster response times
- **More Sources**: Expand to additional AI news outlets
- **Push Notifications**: Real-time news alerts

### **Long-term Roadmap**
- **User Accounts**: Personalized news preferences
- **Advanced Filtering**: Topic-based categorization
- **Analytics**: User engagement tracking
- **Native Apps**: iOS/Android development

## 📚 **Documentation**

- **[Current State](CURRENT_PROJECT_STATE.md)**: Detailed project status
- **[Vercel Deployment](docs/VERCEL_DEPLOYMENT_GUIDE.md)**: Deployment guide
- **[Project Memory](project-memory/)**: Development tracking system

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
- **Vercel Dashboard**: Deployment and function logs

---

**Project Status**: 🟢 **FULLY OPERATIONAL**  
**Real Data**: ✅ Live AI news from 5 major sources  
**Mobile Ready**: ✅ PWA with offline support  
**Production**: ✅ Deployed and stable on Vercel
