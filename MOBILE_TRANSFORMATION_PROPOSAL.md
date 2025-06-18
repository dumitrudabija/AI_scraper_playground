# AI News Scraper - Mobile Transformation Architecture Proposal

## Current State Analysis

### Existing Architecture
- **Backend**: Python-based scrapers (daily + weekly)
- **Data Sources**: 8+ RSS feeds, Reddit, Hacker News
- **AI Processing**: Anthropic Claude 3.5 Sonnet for summarization
- **Output**: HTML reports (weekly) + Markdown reports (daily)
- **Automation**: Cron-based weekly scheduling
- **Storage**: File-based reports in `/reports` directory

### Current Strengths
- ✅ Robust scraping infrastructure with 95%+ success rate
- ✅ High-quality AI summarization
- ✅ Beautiful HTML report design
- ✅ Comprehensive source coverage
- ✅ Automated weekly execution
- ✅ Excellent project memory framework

### Current Limitations for Mobile
- ❌ No mobile app interface
- ❌ No real-time access to reports
- ❌ No user-triggered refresh capability
- ❌ No push notifications
- ❌ Reports only accessible via file system

## Proposed Mobile-Friendly Architecture

### Architecture Decision: Hybrid Approach
**Recommendation**: Keep Python backend + Add React Native frontend with Node.js API layer

**Rationale**:
1. **Preserve Investment**: Existing Python scrapers are robust and well-tested
2. **Leverage Strengths**: Python excels at web scraping and data processing
3. **Mobile Optimization**: React Native provides native mobile experience
4. **Deployment Flexibility**: Hybrid approach supports multiple deployment options

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MOBILE-FRIENDLY AI NEWS SYSTEM               │
├─────────────────────────────────────────────────────────────────┤
│  📱 FRONTEND LAYER                                              │
│  ├── React Native App (iOS/Android)                            │
│  ├── PWA Web App (Responsive)                                  │
│  └── Push Notifications                                        │
├─────────────────────────────────────────────────────────────────┤
│  🔗 API LAYER                                                   │
│  ├── Node.js/Express REST API                                  │
│  ├── Authentication & User Management                          │
│  ├── Real-time WebSocket connections                           │
│  └── Report serving & caching                                  │
├─────────────────────────────────────────────────────────────────┤
│  🐍 PROCESSING LAYER (Existing Python)                         │
│  ├── Enhanced Weekly Scraper                                   │
│  ├── Enhanced Daily Scraper                                    │
│  ├── On-demand scraping endpoints                              │
│  └── Anthropic AI summarization                                │
├─────────────────────────────────────────────────────────────────┤
│  💾 DATA LAYER                                                  │
│  ├── SQLite Database (reports, metadata)                       │
│  ├── File Storage (HTML/JSON reports)                          │
│  └── Redis Cache (API responses)                               │
├─────────────────────────────────────────────────────────────────┤
│  ⚙️ AUTOMATION & DEPLOYMENT                                     │
│  ├── GitHub Actions CI/CD                                      │
│  ├── Docker containerization                                   │
│  ├── Cloud deployment (Railway/Render/Vercel)                  │
│  └── Scheduled jobs (cron + cloud functions)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Plan

### Phase 1: Backend API Development (Week 1-2)
**Goal**: Create Node.js API layer to serve existing Python scrapers

#### 1.1 Node.js API Server
```javascript
// Core endpoints:
GET  /api/reports/latest          // Latest weekly report
GET  /api/reports/daily/latest    // Latest daily report
GET  /api/reports/history         // Report history
POST /api/scrape/trigger          // Trigger on-demand scrape
GET  /api/sources/status          // Source health check
POST /api/notifications/subscribe // Push notification subscription
```

#### 1.2 Database Integration
- **SQLite** for simplicity and portability
- Store report metadata, user preferences, notification subscriptions
- Maintain file-based storage for actual reports

#### 1.3 Python Integration
- Modify existing scrapers to output JSON + HTML
- Add REST endpoints to trigger scraping
- Maintain existing cron automation

### Phase 2: PWA Development (Week 2-3)
**Goal**: Create responsive web app that works on mobile

#### 2.1 React PWA Features
- **Responsive Design**: Mobile-first approach
- **Offline Support**: Service worker for cached reports
- **Push Notifications**: Web push API integration
- **App-like Experience**: Add to home screen capability

#### 2.2 Core Features
- View latest reports with mobile-optimized layout
- Pull-to-refresh for manual updates
- Dark/light mode toggle
- Source filtering and preferences
- Notification settings

### Phase 3: React Native App (Week 3-4)
**Goal**: Native mobile app for iOS/Android

#### 3.1 Core App Features
- Native navigation and performance
- Push notifications
- Background refresh
- Biometric authentication (optional)
- Share functionality

#### 3.2 Advanced Features
- Offline reading
- Bookmarking articles
- Reading progress tracking
- Custom notification schedules

### Phase 4: Deployment & Automation (Week 4-5)
**Goal**: Production deployment with automated scheduling

#### 4.1 Deployment Options (Ranked by Simplicity)

**Option A: Railway (Recommended for Solo Developer)**
- ✅ Simple Git-based deployment
- ✅ Built-in PostgreSQL/Redis
- ✅ Automatic HTTPS
- ✅ Cron job support
- ✅ $5-20/month cost
- ✅ Zero DevOps overhead

**Option B: Render**
- ✅ Free tier available
- ✅ Auto-deploy from Git
- ✅ Built-in cron jobs
- ❌ Limited free tier resources

**Option C: Vercel + Supabase**
- ✅ Excellent for frontend
- ✅ Serverless functions
- ❌ More complex setup
- ❌ Multiple services to manage

#### 4.2 Automation Strategy
```yaml
# GitHub Actions workflow
name: Deploy AI News System
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 5 * * *'  # Daily at 5 AM

jobs:
  deploy:
    - Build and test
    - Deploy API server
    - Deploy PWA
    - Trigger scraping job
    - Send notifications
```

## Technical Implementation Details

### Enhanced Python Scrapers

#### Modified Weekly Scraper
```python
# Add JSON output alongside HTML
def save_report_json(self, articles: List[Dict], summary: str) -> str:
    """Save report as JSON for API consumption."""
    report_data = {
        'generated_at': datetime.now().isoformat(),
        'type': 'weekly',
        'summary': summary,
        'articles': articles,
        'stats': {
            'total_articles': len(articles),
            'sources': list(set(a['source'] for a in articles))
        }
    }
    
    filename = f"reports/weekly_report_{datetime.now().strftime('%Y-%m-%d')}.json"
    with open(filename, 'w') as f:
        json.dump(report_data, f, indent=2)
    
    return filename

# Add API endpoint trigger
def trigger_scrape_api(self):
    """API endpoint to trigger scraping."""
    try:
        report_file = self.run_weekly_scrape()
        return {'status': 'success', 'report': report_file}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
```

#### On-Demand Scraping
```python
# Add quick scrape for mobile refresh
def quick_scrape(self, max_articles_per_source=5):
    """Quick scrape for mobile refresh - fewer articles, faster response."""
    # Reduced article limits for faster mobile response
    # Focus on most recent articles only
```

### Node.js API Server

#### Core Server Structure
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./data/reports.db');

// API Routes
app.get('/api/reports/latest', async (req, res) => {
  // Serve latest report from database + file system
});

app.post('/api/scrape/trigger', async (req, res) => {
  // Trigger Python scraper
  const python = spawn('python3', ['weekly_scraper.py']);
  // Handle response and update database
});

app.listen(3000, () => {
  console.log('AI News API running on port 3000');
});
```

### React Native App Structure

#### Core Components
```javascript
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Reports" component={ReportsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

#### Key Features Implementation
```javascript
// HomeScreen.js - Main dashboard
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, Text, View } from 'react-native';

export default function HomeScreen() {
  const [reports, setReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Trigger API call to refresh data
    await fetchLatestReports();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Report components */}
    </ScrollView>
  );
}
```

## Deployment Strategy

### Recommended Deployment: Railway

#### Why Railway for Solo Developer:
1. **Simplicity**: Git push to deploy
2. **All-in-one**: Database, cron jobs, HTTPS included
3. **Cost-effective**: $5-20/month for full stack
4. **Python + Node.js support**: Both runtimes supported
5. **Zero DevOps**: No server management needed

#### Railway Setup:
```yaml
# railway.toml
[build]
  builder = "nixpacks"

[deploy]
  healthcheckPath = "/health"
  restartPolicyType = "on-failure"

[[services]]
  name = "api"
  source = "./api"
  
[[services]]
  name = "scraper"
  source = "./scraper"
  
[cron]
  - name = "daily-scrape"
    schedule = "0 5 * * *"
    command = "python weekly_scraper.py"
```

### Alternative: Render (Free Tier)
```yaml
# render.yaml
services:
  - type: web
    name: ai-news-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    
  - type: cron
    name: daily-scraper
    schedule: "0 5 * * *"
    buildCommand: pip install -r requirements.txt
    startCommand: python weekly_scraper.py
```

## Scheduling Strategy

### Multi-Layer Scheduling Approach

#### 1. Cloud-Based Primary (Railway/Render Cron)
```bash
# Primary scheduling via cloud platform
0 5 * * * python weekly_scraper.py  # Daily at 5 AM
0 7 * * 1 python weekly_scraper.py  # Weekly on Monday
```

#### 2. GitHub Actions Backup
```yaml
# .github/workflows/scrape.yml
name: Backup Scraping
on:
  schedule:
    - cron: '0 5 * * *'  # Daily backup
  workflow_dispatch:     # Manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run scraper
        run: python weekly_scraper.py
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      - name: Deploy reports
        run: |
          # Push reports to deployment
```

#### 3. Local Fallback (Existing Cron)
- Keep existing local cron as tertiary backup
- Useful for development and testing

## User Experience Flow

### Mobile App User Journey

#### First Launch
1. **Onboarding**: Brief intro to AI news aggregation
2. **Notification Setup**: Optional push notification permissions
3. **Preferences**: Select preferred sources and update frequency
4. **Latest Report**: Show most recent weekly report

#### Daily Usage
1. **Quick Check**: Open app to see latest summary
2. **Pull to Refresh**: Manual trigger for fresh content
3. **Article Reading**: Tap to read full articles
4. **Sharing**: Share interesting articles

#### Notification Flow
1. **Daily Summary**: 5 AM notification with key highlights
2. **Breaking News**: Optional immediate notifications for major AI news
3. **Weekly Digest**: Monday morning comprehensive report notification

### PWA Experience
- **Add to Home Screen**: Prompt after 2-3 visits
- **Offline Reading**: Cache last 5 reports for offline access
- **Responsive Design**: Optimized for all screen sizes
- **Fast Loading**: Service worker caching for instant load

## Cost Analysis

### Development Costs (Time Investment)
- **Phase 1 (API)**: 20-30 hours
- **Phase 2 (PWA)**: 30-40 hours  
- **Phase 3 (React Native)**: 40-50 hours
- **Phase 4 (Deployment)**: 10-15 hours
- **Total**: 100-135 hours (~3-4 weeks full-time)

### Operational Costs (Monthly)
- **Railway Deployment**: $5-20/month
- **Anthropic API**: $10-30/month (existing)
- **Push Notifications**: Free (Firebase)
- **Domain**: $10/year
- **Total**: $15-50/month

### Alternative Free Tier Option
- **Render**: Free web service + cron jobs
- **Supabase**: Free database tier
- **Vercel**: Free frontend hosting
- **Total**: $0/month (with usage limits)

## Risk Assessment & Mitigation

### Technical Risks
1. **API Rate Limits**: Implement caching and request throttling
2. **Mobile Performance**: Optimize bundle size and lazy loading
3. **Cross-Platform Issues**: Thorough testing on iOS/Android
4. **Deployment Complexity**: Start with Railway for simplicity

### Operational Risks
1. **Service Downtime**: Multi-layer backup scheduling
2. **Cost Overruns**: Start with free tiers, monitor usage
3. **Maintenance Overhead**: Automated deployment and monitoring
4. **User Adoption**: Focus on PWA first, then native app

## Success Metrics

### Technical Metrics
- **API Response Time**: <500ms for cached reports
- **Mobile App Load Time**: <2 seconds
- **Scraping Success Rate**: Maintain >95%
- **Uptime**: >99.5%

### User Experience Metrics
- **Daily Active Users**: Track app opens
- **Notification Engagement**: Click-through rates
- **Report Consumption**: Time spent reading
- **Refresh Usage**: Manual refresh frequency

## Implementation Timeline

### Week 1: Backend API Development
- **Days 1-2**: Node.js server setup and basic endpoints
- **Days 3-4**: Database integration and Python scraper modifications
- **Days 5-7**: API testing and documentation

### Week 2: PWA Development
- **Days 1-3**: React PWA setup and responsive design
- **Days 4-5**: Service worker and offline functionality
- **Days 6-7**: Push notifications and PWA features

### Week 3: React Native App
- **Days 1-3**: React Native setup and navigation
- **Days 4-5**: Core features and API integration
- **Days 6-7**: Push notifications and native features

### Week 4: Deployment & Testing
- **Days 1-2**: Railway deployment setup
- **Days 3-4**: Automated scheduling configuration
- **Days 5-7**: End-to-end testing and bug fixes

### Week 5: Launch & Optimization
- **Days 1-2**: Production deployment
- **Days 3-4**: Monitoring and performance optimization
- **Days 5-7**: User feedback and iterations

## Next Steps

### Immediate Actions (This Week)
1. **Update Project Memory**: Document this transformation plan
2. **Setup Development Environment**: Node.js, React Native CLI
3. **Create Repository Structure**: Organize for multi-platform development
4. **API Design**: Finalize endpoint specifications

### Phase 1 Kickoff (Next Week)
1. **Initialize Node.js API**: Express server with basic routes
2. **Modify Python Scrapers**: Add JSON output and API triggers
3. **Database Setup**: SQLite schema for reports and metadata
4. **Basic Testing**: API endpoints and Python integration

This transformation will evolve the AI News Scraper from a file-based system to a modern, mobile-friendly platform while preserving the robust scraping and AI summarization capabilities that make it valuable.
