const { spawn } = require('child_process');
const path = require('path');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Note: In Vercel, long-running processes are limited
    // This endpoint will trigger scraping but may timeout for long operations
    // For production, consider using GitHub Actions or external cron jobs
    
    const scriptPath = path.join(process.cwd(), 'scrapers', 'news_scraper.py');
    
    console.log(`Triggering daily scrape with script: ${scriptPath}`);
    
    // Return immediate response for async processing
    res.json({
      success: true,
      message: 'Daily scraping triggered (11+ sources)',
      type: 'daily',
      timestamp: new Date().toISOString(),
      note: 'Scraping will complete in background. Check /api/reports/latest for updates.'
    });
    
    // Note: In Vercel, this process may be terminated due to function timeout
    // For production deployment, use GitHub Actions for reliable scraping
    try {
      const pythonProcess = spawn('python3', [scriptPath], {
        cwd: process.cwd(),
        env: { ...process.env },
        detached: false,
        stdio: 'pipe'
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
          console.log('Daily scraping completed successfully');
        } else {
          console.error(`Daily scraping failed with code ${code}`);
        }
      });
      
      pythonProcess.on('error', (error) => {
        console.error('Failed to start daily scraping:', error);
      });
      
    } catch (processError) {
      console.error('Error spawning Python process:', processError);
      // Don't return error since we already sent success response
    }
    
  } catch (error) {
    console.error('Error triggering scrape:', error);
    res.status(500).json({ 
      error: 'Failed to trigger scraping',
      message: error.message,
      recommendation: 'Use GitHub Actions for reliable daily scraping in production'
    });
  }
}
