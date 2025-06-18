# Vercel Deployment Guide

## Overview
This guide covers deploying the AI News Scraper PWA to Vercel with serverless API functions.

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Project pushed to GitHub repository

## Deployment Steps

### 1. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository: `AI_scraper_playground`
4. Select the repository and click "Import"

### 2. Configure Project Settings

**Framework Preset**: Other
**Root Directory**: Leave empty (monorepo setup)
**Build Command**: `cd pwa && npm run build`
**Output Directory**: `pwa/build`
**Install Command**: `cd pwa && npm install`

### 3. Environment Variables (Optional)

If you have API keys for enhanced scraping:
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `OPENAI_API_KEY`: Your OpenAI API key

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Project Structure for Vercel

```
ai-news-scraper/
├── package.json              # Root package.json for Vercel
├── vercel.json               # Vercel configuration
├── api/                      # Serverless API functions
│   ├── reports/
│   │   └── latest.js         # GET /api/reports/latest
│   └── scrape/
│       └── trigger.js        # POST /api/scrape/trigger
├── pwa/                      # React PWA (frontend)
│   ├── package.json
│   ├── public/
│   ├── src/
│   └── build/               # Generated during deployment
├── reports/                 # JSON data files
├── scrapers/               # Python scraping scripts
└── docs/                   # Documentation
```

## API Endpoints

Once deployed, your API will be available at:

- **Latest Report**: `https://your-app.vercel.app/api/reports/latest`
- **Trigger Scraping**: `https://your-app.vercel.app/api/scrape/trigger` (POST)

## PWA Features

Your deployed PWA will have:

- ✅ **Installable**: Users can install as native app
- ✅ **Offline Support**: Service worker caching
- ✅ **Fast Loading**: Vercel's global CDN
- ✅ **Mobile Optimized**: Responsive design
- ✅ **Push Notifications**: Ready for implementation

## Production URLs

- **PWA Frontend**: `https://ai-news-scraper.vercel.app`
- **API Base**: `https://ai-news-scraper.vercel.app/api`

## Automated Daily Scraping

For production daily scraping, use GitHub Actions (recommended):

1. Create `.github/workflows/daily-scrape.yml`
2. Configure secrets in GitHub repository settings
3. Schedule daily runs at 5 AM UTC

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain
4. Follow DNS configuration instructions

## Monitoring

Vercel provides built-in:
- **Analytics**: Page views, performance metrics
- **Function Logs**: API endpoint monitoring
- **Error Tracking**: Real-time error reporting

## Troubleshooting

### Build Failures
- Check that `pwa/package.json` has all dependencies
- Ensure Node.js version compatibility (18+)
- Verify build command works locally

### API Issues
- Check function logs in Vercel dashboard
- Verify CORS headers are set correctly
- Test API endpoints after deployment

### PWA Installation
- Ensure manifest.json is valid
- Check service worker registration
- Verify HTTPS is working

## Cost Estimation

**Vercel Free Tier Limits:**
- 100GB bandwidth/month
- 100GB-hours serverless function execution
- Unlimited static deployments

**Expected Usage for AI News Scraper:**
- **Bandwidth**: ~1-5GB/month (low traffic)
- **Function Execution**: ~10-20GB-hours/month
- **Cost**: $0/month (well within free tier)

## Performance Optimization

Vercel automatically provides:
- **Global CDN**: Fast loading worldwide
- **Image Optimization**: Automatic image compression
- **Code Splitting**: Optimized JavaScript bundles
- **Caching**: Intelligent edge caching

## Security

- **HTTPS**: Automatic SSL certificates
- **CORS**: Configured for API endpoints
- **Environment Variables**: Secure secret storage
- **DDoS Protection**: Built-in protection

## Backup Strategy

- **Code**: GitHub repository (version controlled)
- **Data**: Reports stored in repository
- **Configuration**: vercel.json in repository

## Next Steps After Deployment

1. **Test PWA Installation**: Try installing on mobile device
2. **Verify API Endpoints**: Test all API routes
3. **Setup GitHub Actions**: For automated daily scraping
4. **Monitor Performance**: Check Vercel analytics
5. **Share Public URL**: Your AI News Scraper is live!

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: Report bugs in repository
- **Community**: Vercel Discord community
