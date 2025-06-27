# Developer Workflow Integration Guide

**Last Updated**: June 27, 2025  
**Project**: AI News Scraper  
**Status**: ✅ Production Ready

## 🎯 **Current Workflow Overview**

This guide establishes the standard workflow for making changes to the AI News Scraper project, ensuring consistency, quality, and proper documentation.

## 🏗️ **Project Architecture Understanding**

### **Key Components**
- **Frontend**: React.js PWA in `/pwa/` directory
- **Backend**: Node.js Vercel serverless functions in `/api/` directory
- **Main API**: `api/reports/latest.js` (primary data endpoint)
- **Secondary API**: `api/scrape/optimized.js` (manual trigger)
- **Deployment**: Vercel with GitHub auto-deploy
- **AI Enhancement**: Anthropic Claude integration

### **Data Flow**
1. PWA calls `/api/reports/latest`
2. API scrapes 11 RSS sources in parallel
3. Articles processed and enhanced with AI summaries
4. JSON response returned to PWA
5. PWA displays articles with working "Read More" links

## 🔄 **Standard Development Workflow**

### **1. Pre-Development Setup**
```bash
# Ensure you're on the latest main branch
git checkout main
git pull origin main

# Check current project state
cat CURRENT_PROJECT_STATE.md
cat project-memory/PROJECT_MEMORY_SUMMARY.md
```

### **2. Making Changes**

#### **For Frontend Changes (PWA)**
```bash
# Navigate to PWA directory
cd pwa

# Install dependencies if needed
npm install

# Start development server
npm start

# Make changes to React components
# Test locally at http://localhost:3000
```

#### **For Backend Changes (API)**
```bash
# Edit API functions in /api/ directory
# Main endpoint: api/reports/latest.js
# Secondary: api/scrape/optimized.js

# Test locally using curl or Postman
# Note: Vercel functions need to be deployed to test fully
```

### **3. Testing Changes**

#### **Local Testing**
```bash
# For PWA changes
cd pwa && npm start

# For API changes (limited local testing)
# Full testing requires deployment to Vercel
```

#### **API Testing Commands**
```bash
# Test main endpoint
curl https://ai-scraper-playground.vercel.app/api/reports/latest

# Check for quality issues
curl -s https://ai-scraper-playground.vercel.app/api/reports/latest | grep -c "example.com"

# Test secondary endpoint
curl -X POST https://ai-scraper-playground.vercel.app/api/scrape/optimized
```

### **4. Deployment Process**

#### **Standard Deployment**
```bash
# Add changes
git add .

# Commit with descriptive message
git commit -m "Description of changes made"

# Push to trigger auto-deployment
git push origin main

# Vercel automatically deploys within 1-2 minutes
```

#### **Verification After Deployment**
```bash
# Wait for deployment (1-2 minutes)
sleep 120

# Test live endpoints
curl https://ai-scraper-playground.vercel.app/api/reports/latest

# Verify PWA functionality
# Visit: https://ai-scraper-playground.vercel.app/
```

### **5. Documentation Updates**

#### **Required Documentation Updates**
```bash
# Update project state
vim CURRENT_PROJECT_STATE.md

# Update project memory
vim project-memory/PROJECT_MEMORY_SUMMARY.md

# Update README if needed
vim README.md

# Commit documentation updates
git add CURRENT_PROJECT_STATE.md project-memory/PROJECT_MEMORY_SUMMARY.md README.md
git commit -m "Update documentation after [change description]"
git push origin main
```

## 🔧 **Common Development Tasks**

### **Adding New RSS Sources**

#### **Step-by-Step Process**
1. **Edit Main API File**
   ```javascript
   // In api/reports/latest.js
   // Add to allSources array:
   {
     name: 'New Source Name',
     url: 'https://example.com/rss.xml',
     color: '#HEXCOLOR',
     category: 'business' // or 'development'
   }
   ```

2. **Update Fallback Function**
   ```javascript
   // In generateSampleArticles function
   // Add corresponding fallback entry with real URL
   {
     source: 'New Source Name',
     color: '#HEXCOLOR',
     category: 'business',
     title: 'Sample Article Title',
     link: 'https://real-source-website.com',
     description: 'Sample description'
   }
   ```

3. **Test RSS Feed**
   ```bash
   # Verify RSS feed works
   curl -I https://example.com/rss.xml
   ```

4. **Deploy and Verify**
   ```bash
   git add api/reports/latest.js
   git commit -m "Add new RSS source: [Source Name]"
   git push origin main
   
   # Test after deployment
   curl https://ai-scraper-playground.vercel.app/api/reports/latest
   ```

### **Fixing API Issues**

#### **Common Issues and Solutions**
1. **RSS Feed Failures**
   - Check feed URL accessibility
   - Verify RSS format compatibility
   - Update timeout settings if needed

2. **AI Enhancement Issues**
   - Check Anthropic API key in Vercel environment
   - Monitor API usage and rate limits
   - Verify request format

3. **Fallback System Issues**
   - Ensure generateSampleArticles has real URLs
   - Test fallback when RSS scraping fails
   - Verify no example.com URLs remain

### **PWA Updates**

#### **Common PWA Tasks**
1. **UI/UX Changes**
   - Edit components in `/pwa/src/components/`
   - Update screens in `/pwa/src/screens/`
   - Test responsive design

2. **API Integration Changes**
   - Update `/pwa/src/contexts/ApiContext.js`
   - Ensure proper error handling
   - Test loading states

3. **PWA Features**
   - Update `/pwa/public/manifest.json`
   - Modify service worker if needed
   - Test installation and offline features

## 🧪 **Quality Assurance Checklist**

### **Before Deployment**
- [ ] Code changes tested locally where possible
- [ ] No hardcoded example.com URLs
- [ ] Error handling implemented
- [ ] Documentation updated

### **After Deployment**
- [ ] API endpoints responding correctly
- [ ] No example.com URLs in API responses
- [ ] PWA loading and functioning
- [ ] "Read More" buttons working
- [ ] AI enhancement working (if applicable)
- [ ] Mobile responsiveness verified

## 📋 **Troubleshooting Guide**

### **Common Issues**

#### **API Not Responding**
```bash
# Check Vercel function logs
# Visit Vercel dashboard for error details

# Test individual RSS feeds
curl -I https://source-rss-url.com/feed.xml

# Verify environment variables
# Check Anthropic API key in Vercel settings
```

#### **PWA Issues**
```bash
# Clear browser cache
# Test in incognito mode
# Check browser console for errors
# Verify service worker registration
```

#### **Deployment Issues**
```bash
# Check GitHub repository for push confirmation
# Verify Vercel deployment status
# Check build logs in Vercel dashboard
```

## 🔗 **Important Resources**

### **Live Links**
- **Application**: https://ai-scraper-playground.vercel.app/
- **Main API**: https://ai-scraper-playground.vercel.app/api/reports/latest
- **GitHub**: https://github.com/dumitrudabija/AI_scraper_playground

### **Documentation Files**
- **CURRENT_PROJECT_STATE.md**: Technical details
- **README.md**: Project overview
- **PROJECT_MEMORY_SUMMARY.md**: Development history

### **Development Tools**
- **Vercel Dashboard**: Deployment and function logs
- **GitHub Actions**: Auto-deployment status
- **Browser DevTools**: PWA testing and debugging

## ⚠️ **Important Notes**

### **What NOT to Do**
- ❌ Don't use example.com URLs in any fallback data
- ❌ Don't commit sensitive API keys to repository
- ❌ Don't skip documentation updates
- ❌ Don't deploy without testing endpoints

### **Best Practices**
- ✅ Always test API endpoints after deployment
- ✅ Update documentation with every change
- ✅ Use descriptive commit messages
- ✅ Verify PWA functionality on mobile devices
- ✅ Monitor AI API usage and costs

---

**Workflow Status**: ✅ **ESTABLISHED AND TESTED**  
**Last Verified**: June 27, 2025  
**Next Review**: As needed for process improvements
