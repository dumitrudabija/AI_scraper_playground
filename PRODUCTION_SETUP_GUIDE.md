# Production Setup Guide - Get Real Data Flowing

## 🚨 CURRENT ISSUE: App Shows Sample Data

Your Vercel deployment is successful, but the app shows sample/fallback data because the scraping system needs proper configuration.

## 🔑 REQUIRED: Environment Variables

### **Step 1: Get Anthropic API Key**

1. **Sign up for Anthropic Claude API**:
   - Go to: https://console.anthropic.com/
   - Create account and verify email
   - Navigate to "API Keys" section
   - Generate a new API key
   - **Copy the key** (starts with `sk-ant-...`)

2. **Add to Vercel Environment Variables**:
   - Go to your Vercel dashboard
   - Find your AI News Scraper project
   - Go to Settings → Environment Variables
   - Add new variable:
     - **Name**: `ANTHROPIC_API_KEY`
     - **Value**: `sk-ant-your-key-here`
     - **Environment**: Production, Preview, Development

### **Step 2: Redeploy to Apply Changes**

After adding the environment variable:
1. Go to Deployments tab in Vercel
2. Click "Redeploy" on latest deployment
3. Wait for deployment to complete

## 🧪 TEST REAL DATA

### **Option 1: Quick Test (No AI Summary)**
Visit: `https://your-app.vercel.app/api/scrape/optimized?mode=quick`

This will:
- Scrape 11+ news sources
- Complete in ~6 seconds
- Return real articles without AI summary
- Work immediately after API key setup

### **Option 2: Full Test (With AI Summary)**
Visit: `https://your-app.vercel.app/api/scrape/optimized`

This will:
- Scrape all sources
- Generate AI summary
- Complete in ~15-30 seconds
- Provide full functionality

## 📊 VERIFY DATA FLOW

### **Check API Endpoints**:

1. **Latest Report**: `GET /api/reports/latest`
   - Should return real articles (not sample data)
   - Check `generated_at` timestamp

2. **Trigger Scraping**: `POST /api/scrape/optimized`
   - Should return fresh articles
   - Check response for real sources

### **PWA Should Now Show**:
- ✅ Real article titles and descriptions
- ✅ Actual publication dates
- ✅ Live source counts (11+ sources)
- ✅ Fresh timestamps

## 🔧 ALTERNATIVE: No-API-Key Mode

If you prefer not to use AI summarization, you can modify the scraper to work without API keys:

### **Quick Fix for No-API Mode**:

1. The scraper already supports `--quick` mode
2. This mode works without ANTHROPIC_API_KEY
3. Provides real articles with basic summaries
4. Still scrapes all 11+ sources

## 📋 TROUBLESHOOTING

### **If Still Showing Sample Data**:

1. **Check Environment Variable**:
   - Verify `ANTHROPIC_API_KEY` is set in Vercel
   - Ensure no extra spaces in the key
   - Confirm it's applied to Production environment

2. **Check API Key Validity**:
   - Test key at: https://console.anthropic.com/
   - Ensure account has credits/usage available
   - Verify key hasn't expired

3. **Force Fresh Deployment**:
   - Make a small change to any file
   - Commit and push to GitHub
   - Vercel will auto-deploy with new environment

4. **Check Function Logs**:
   - Go to Vercel → Functions tab
   - Check logs for `/api/scrape/optimized`
   - Look for error messages

### **Common Error Messages**:

- `"No API key provided"` → Add ANTHROPIC_API_KEY
- `"Invalid API key"` → Check key format/validity
- `"Rate limit exceeded"` → Wait or upgrade Anthropic plan
- `"Timeout"` → Normal for first run, try again

## 🚀 EXPECTED RESULTS

### **After Proper Setup**:

**Home Screen Will Show**:
- Real article count (not "42")
- Actual source count (11+)
- Live timestamps
- Real headlines from:
  - OpenAI Blog
  - TechCrunch AI
  - Hacker News AI
  - Google AI Blog
  - Anthropic Blog
  - VentureBeat AI
  - Hugging Face Blog
  - Reddit ML communities
  - ArXiv AI papers
  - GitHub AI trending

**Reports Screen Will Show**:
- Fresh AI news reports
- Real publication dates
- Actual article summaries
- Live source statistics

## 💡 NEXT STEPS AFTER DATA FLOWS

1. **Set up Automated Scraping**:
   - Use Vercel Cron Jobs
   - Schedule regular updates
   - Monitor performance

2. **Add Monitoring**:
   - Track API usage
   - Monitor scraping success rates
   - Set up error alerts

3. **Optimize Performance**:
   - Cache frequently accessed data
   - Implement smart refresh logic
   - Add user preferences

## 🎯 IMMEDIATE ACTION REQUIRED

**Priority 1**: Add `ANTHROPIC_API_KEY` to Vercel environment variables and redeploy.

This single step will transform your app from showing sample data to displaying real, live AI news from 11+ sources.

---

**Status**: ⚠️ **SETUP REQUIRED** - App deployed but needs API key for real data
**Time to Fix**: ~5 minutes (get API key + add to Vercel + redeploy)
**Result**: Live AI news data flowing to your PWA
