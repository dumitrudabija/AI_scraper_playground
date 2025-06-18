# AI News Scraper API

Node.js Express API server for the AI News Scraper mobile transformation project.

## Overview

This API serves as the bridge between the existing Python scrapers and the mobile frontend (PWA/React Native). It provides RESTful endpoints for accessing reports, triggering scraping, and managing the mobile app experience.

## Features

- ✅ **RESTful API**: Clean endpoints for mobile consumption
- ✅ **Report Serving**: Access to latest and historical reports
- ✅ **On-Demand Scraping**: Trigger Python scrapers via API
- ✅ **Source Status**: Monitor news source availability
- ✅ **Security**: Rate limiting, CORS, helmet protection
- ✅ **Push Notifications**: Subscription management (ready for implementation)
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **Logging**: Request logging with Morgan

## API Endpoints

### Health Check
```
GET /health
```
Returns API health status and version information.

### Reports
```
GET /api/reports/latest          # Latest weekly report
GET /api/reports/daily/latest    # Latest daily report  
GET /api/reports/history         # All report history
```

### Scraping
```
POST /api/scrape/trigger         # Trigger on-demand scraping
Body: { "type": "weekly" | "daily" }
```

### Sources
```
GET /api/sources/status          # News source availability
```

### Notifications
```
POST /api/notifications/subscribe # Push notification subscription
Body: { "endpoint": "...", "keys": {...}, "userAgent": "..." }
```

## Installation

### Prerequisites
- Node.js 16+ 
- npm 8+
- Python 3.7+ (for scraper integration)

### Setup
```bash
# Navigate to API directory
cd api

# Install dependencies
npm install

# Create environment file
cp ../.env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Or start production server
npm start
```

## Environment Variables

Create a `.env` file in the api directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Python Scraper Integration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# CORS Origins (production)
CORS_ORIGINS=https://your-pwa-domain.com,https://your-mobile-app.com
```

## Development

### Scripts
```bash
npm run dev          # Start with nodemon (auto-reload)
npm start           # Start production server
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
```

### Project Structure
```
api/
├── src/
│   └── server.js           # Main API server
├── tests/                  # Test files (future)
├── config/                 # Configuration files (future)
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Integration with Python Scrapers

The API integrates with existing Python scrapers:

- **Weekly Scraper**: `weekly_scraper.py`
- **Daily Scraper**: `news_scraper.py`

### Trigger Scraping
```javascript
// Trigger weekly scraping
POST /api/scrape/trigger
{
  "type": "weekly"
}

// Trigger daily scraping  
POST /api/scrape/trigger
{
  "type": "daily"
}
```

## Mobile Integration

### React Native
```javascript
// Fetch latest report
const response = await fetch('http://localhost:3000/api/reports/latest');
const data = await response.json();

// Trigger refresh
const refresh = await fetch('http://localhost:3000/api/scrape/trigger', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'weekly' })
});
```

### PWA
```javascript
// Service worker integration
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/reports/latest')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for mobile app origins
- **Helmet**: Security headers
- **Input Validation**: JSON body parsing with size limits
- **Error Handling**: Sanitized error responses

## Deployment

### Railway (Recommended)
```bash
# Connect to Railway
railway login
railway link

# Deploy
railway up
```

### Render
```bash
# Connect repository to Render
# Set environment variables in dashboard
# Deploy automatically on git push
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3000/health

# Get latest report
curl http://localhost:3000/api/reports/latest

# Trigger scraping
curl -X POST http://localhost:3000/api/scrape/trigger \
  -H "Content-Type: application/json" \
  -d '{"type":"weekly"}'
```

### Automated Testing (Future)
```bash
npm test
```

## Performance

- **Compression**: Gzip compression enabled
- **Caching**: File system caching for reports
- **Rate Limiting**: Prevents API abuse
- **Async Operations**: Non-blocking I/O for all operations

## Monitoring

### Logs
- Request logging with Morgan
- Error logging to console
- Python scraper output captured

### Health Monitoring
```bash
# Check API health
curl http://localhost:3000/health

# Monitor logs
tail -f logs/api.log
```

## Future Enhancements

- [ ] **Database Integration**: SQLite/PostgreSQL for metadata
- [ ] **Authentication**: JWT tokens for mobile apps
- [ ] **WebSocket Support**: Real-time updates
- [ ] **Caching Layer**: Redis for improved performance
- [ ] **API Documentation**: Swagger/OpenAPI specs
- [ ] **Metrics**: Prometheus/Grafana integration

## Contributing

1. Create feature branch: `git checkout -b feature/api-enhancement`
2. Make changes and test
3. Commit: `git commit -m "Add API enhancement"`
4. Push: `git push origin feature/api-enhancement`
5. Create Pull Request

## License

MIT License - see main project LICENSE file.

---

**Phase 1 Status**: ✅ Complete - API server ready for mobile integration
**Next Phase**: PWA Development (Week 2-3)
