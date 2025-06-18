const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-pwa-domain.com', 'https://your-mobile-app.com']
    : ['http://localhost:3000', 'http://localhost:19006'], // React Native Metro
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'AI News Scraper API',
    version: '1.0.0'
  });
});

// API Routes

// Get latest weekly report (JSON format for PWA)
app.get('/api/reports/latest', async (req, res) => {
  try {
    const reportsDir = path.join(__dirname, '../../reports');
    const files = await fs.readdir(reportsDir);
    
    // Find latest weekly JSON report
    const weeklyReports = files
      .filter(file => file.includes('weekly_report') && file.endsWith('.json'))
      .sort()
      .reverse();
    
    if (weeklyReports.length === 0) {
      return res.status(404).json({ error: 'No reports found' });
    }
    
    const latestReport = weeklyReports[0];
    const reportPath = path.join(reportsDir, latestReport);
    const reportContent = await fs.readFile(reportPath, 'utf8');
    const reportData = JSON.parse(reportContent);
    
    res.json({
      success: true,
      data: reportData
    });
    
  } catch (error) {
    console.error('Error fetching latest report:', error);
    res.status(500).json({ 
      error: 'Failed to fetch latest report',
      message: error.message 
    });
  }
});

// Get latest weekly report (HTML format for web view)
app.get('/api/reports/latest/html', async (req, res) => {
  try {
    const reportsDir = path.join(__dirname, '../../reports');
    const files = await fs.readdir(reportsDir);
    
    // Find latest weekly HTML report
    const weeklyReports = files
      .filter(file => file.includes('weekly_report') && file.endsWith('.html'))
      .sort()
      .reverse();
    
    if (weeklyReports.length === 0) {
      return res.status(404).json({ error: 'No reports found' });
    }
    
    const latestReport = weeklyReports[0];
    const reportPath = path.join(reportsDir, latestReport);
    const reportContent = await fs.readFile(reportPath, 'utf8');
    
    // Extract metadata from filename
    const dateMatch = latestReport.match(/weekly_report_(\d{4}-\d{2}-\d{2})/);
    const reportDate = dateMatch ? dateMatch[1] : 'unknown';
    
    res.json({
      success: true,
      data: {
        filename: latestReport,
        date: reportDate,
        type: 'weekly',
        content: reportContent,
        generated_at: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching latest HTML report:', error);
    res.status(500).json({ 
      error: 'Failed to fetch latest HTML report',
      message: error.message 
    });
  }
});

// Get latest daily report
app.get('/api/reports/daily/latest', async (req, res) => {
  try {
    const reportsDir = path.join(__dirname, '../../reports');
    const files = await fs.readdir(reportsDir);
    
    // Find latest daily markdown report
    const dailyReports = files
      .filter(file => file.includes('ai_news_report') && file.endsWith('.md'))
      .sort()
      .reverse();
    
    if (dailyReports.length === 0) {
      return res.status(404).json({ error: 'No daily reports found' });
    }
    
    const latestReport = dailyReports[0];
    const reportPath = path.join(reportsDir, latestReport);
    const reportContent = await fs.readFile(reportPath, 'utf8');
    
    // Extract metadata from filename
    const dateMatch = latestReport.match(/ai_news_report_(\d{4}-\d{2}-\d{2})/);
    const reportDate = dateMatch ? dateMatch[1] : 'unknown';
    
    res.json({
      success: true,
      data: {
        filename: latestReport,
        date: reportDate,
        type: 'daily',
        content: reportContent,
        generated_at: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching latest daily report:', error);
    res.status(500).json({ 
      error: 'Failed to fetch latest daily report',
      message: error.message 
    });
  }
});

// Get report history
app.get('/api/reports/history', async (req, res) => {
  try {
    const reportsDir = path.join(__dirname, '../../reports');
    const files = await fs.readdir(reportsDir);
    
    const reports = files
      .filter(file => file.endsWith('.html') || file.endsWith('.md'))
      .map(file => {
        const isWeekly = file.includes('weekly_report');
        const isDaily = file.includes('ai_news_report');
        
        let dateMatch, reportDate;
        if (isWeekly) {
          dateMatch = file.match(/weekly_report_(\d{4}-\d{2}-\d{2})/);
        } else if (isDaily) {
          dateMatch = file.match(/ai_news_report_(\d{4}-\d{2}-\d{2})/);
        }
        
        reportDate = dateMatch ? dateMatch[1] : 'unknown';
        
        return {
          filename: file,
          date: reportDate,
          type: isWeekly ? 'weekly' : 'daily',
          format: file.endsWith('.html') ? 'html' : 'markdown'
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort by date descending
    
    res.json({
      success: true,
      data: {
        reports,
        total: reports.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching report history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch report history',
      message: error.message 
    });
  }
});

// Trigger on-demand scraping
app.post('/api/scrape/trigger', async (req, res) => {
  try {
    const { type = 'weekly' } = req.body;
    
    // Determine which scraper to run
    const scriptName = type === 'daily' ? 'news_scraper.py' : 'weekly_scraper.py';
    const scriptPath = path.join(__dirname, '../../scrapers/', scriptName);
    
    console.log(`Triggering ${type} scrape with script: ${scriptPath}`);
    
    // Return immediate response for async processing
    res.json({
      success: true,
      message: `${type} scraping started`,
      type: type,
      timestamp: new Date().toISOString()
    });
    
    // Spawn Python process asynchronously
    const pythonProcess = spawn('python3', [scriptPath], {
      cwd: path.join(__dirname, '../../'),
      env: { ...process.env },
      detached: false
    });
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`Python stdout: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`Python stderr: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`${type} scraping completed successfully`);
        // Here you could emit a WebSocket event or store completion status
      } else {
        console.error(`${type} scraping failed with code ${code}`);
      }
    });
    
    pythonProcess.on('error', (error) => {
      console.error(`Failed to start ${type} scraping:`, error);
    });
    
  } catch (error) {
    console.error('Error triggering scrape:', error);
    res.status(500).json({ 
      error: 'Failed to trigger scraping',
      message: error.message 
    });
  }
});

// Get scraping status (for checking if scraping is in progress)
app.get('/api/scrape/status', async (req, res) => {
  try {
    // Check if there are any recent reports (within last hour)
    const reportsDir = path.join(__dirname, '../../reports');
    const files = await fs.readdir(reportsDir);
    
    const recentReports = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(reportsDir, file);
        const stats = require('fs').statSync(filePath);
        return {
          filename: file,
          modified: stats.mtime,
          type: file.includes('weekly') ? 'weekly' : 'daily'
        };
      })
      .filter(report => {
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return new Date(report.modified) > hourAgo;
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));
    
    res.json({
      success: true,
      data: {
        recentActivity: recentReports.length > 0,
        lastReport: recentReports[0] || null,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error checking scrape status:', error);
    res.status(500).json({ 
      error: 'Failed to check scraping status',
      message: error.message 
    });
  }
});

// Get source status
app.get('/api/sources/status', async (req, res) => {
  try {
    // This would ideally check each source's availability
    // For now, return a mock status based on recent reports
    const sources = [
      { name: 'OpenAI Blog', status: 'active', lastCheck: new Date().toISOString() },
      { name: 'Anthropic Blog', status: 'active', lastCheck: new Date().toISOString() },
      { name: 'Google AI Blog', status: 'active', lastCheck: new Date().toISOString() },
      { name: 'ArXiv AI Papers', status: 'active', lastCheck: new Date().toISOString() },
      { name: 'Hugging Face Blog', status: 'active', lastCheck: new Date().toISOString() },
      { name: 'GitHub AI Trending', status: 'active', lastCheck: new Date().toISOString() },
      { name: 'r/MachineLearning', status: 'active', lastCheck: new Date().toISOString() },
      { name: 'Hacker News', status: 'active', lastCheck: new Date().toISOString() }
    ];
    
    res.json({
      success: true,
      data: {
        sources,
        totalSources: sources.length,
        activeSources: sources.filter(s => s.status === 'active').length,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching source status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch source status',
      message: error.message 
    });
  }
});

// Push notification subscription (placeholder for future implementation)
app.post('/api/notifications/subscribe', async (req, res) => {
  try {
    const { endpoint, keys, userAgent } = req.body;
    
    // TODO: Store subscription in database
    console.log('Push notification subscription received:', { endpoint, keys, userAgent });
    
    res.json({
      success: true,
      message: 'Push notification subscription registered',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    res.status(500).json({ 
      error: 'Failed to subscribe to push notifications',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI News Scraper API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📰 Latest report: http://localhost:${PORT}/api/reports/latest`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
