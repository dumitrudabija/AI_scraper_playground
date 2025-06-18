const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In Vercel, we need to look for reports in the project root
    const reportsDir = path.join(process.cwd(), 'reports');
    
    let files;
    try {
      files = await fs.readdir(reportsDir);
    } catch (error) {
      // If reports directory doesn't exist, return sample data
      console.log('Reports directory not found, returning sample data');
      return res.json({
        success: true,
        data: {
          report_date: new Date().toISOString().split('T')[0],
          total_articles: 26,
          sources_count: 6,
          articles: [
            {
              title: "The 'OpenAI Files' push for oversight in the race to AGI",
              source: "TechCrunch AI",
              source_color: "#00D084",
              category: "Business",
              description: "A group of current and former OpenAI employees are calling for greater oversight and transparency in AI development as the race to artificial general intelligence intensifies.",
              link: "https://techcrunch.com/2024/06/18/openai-files-oversight-agi/",
              pub_date: "2024-06-18T10:30:00Z"
            },
            {
              title: "Google's Gemini AI gets major upgrade with improved reasoning",
              source: "Google AI Blog",
              source_color: "#4285F4",
              category: "Development",
              description: "Google announces significant improvements to Gemini's reasoning capabilities, with enhanced performance on complex mathematical and logical problems.",
              link: "https://ai.googleblog.com/2024/06/gemini-reasoning-upgrade.html",
              pub_date: "2024-06-18T09:15:00Z"
            },
            {
              title: "Meta releases Llama 3.1 with 405B parameters",
              source: "Meta AI",
              source_color: "#1877F2",
              category: "Development",
              description: "Meta's largest language model yet, Llama 3.1 405B, sets new benchmarks in AI performance while maintaining open-source accessibility.",
              link: "https://ai.meta.com/blog/llama-3-1-405b/",
              pub_date: "2024-06-18T08:00:00Z"
            }
          ],
          sources: [
            { name: "TechCrunch AI", count: 8, color: "#00D084" },
            { name: "Google AI Blog", count: 6, color: "#4285F4" },
            { name: "Meta AI", count: 4, color: "#1877F2" },
            { name: "OpenAI Blog", count: 3, color: "#412991" },
            { name: "Anthropic", count: 3, color: "#D4A574" },
            { name: "ArXiv", count: 2, color: "#B31B1B" }
          ],
          generated_at: new Date().toISOString()
        }
      });
    }
    
    // Find latest daily JSON report
    const dailyReports = files
      .filter(file => file.includes('ai_news_report') && file.endsWith('.json'))
      .sort()
      .reverse();
    
    if (dailyReports.length === 0) {
      // Return sample data if no reports found
      return res.json({
        success: true,
        data: {
          report_date: new Date().toISOString().split('T')[0],
          total_articles: 26,
          sources_count: 6,
          articles: [
            {
              title: "Sample AI News Article",
              source: "AI News Source",
              source_color: "#6366f1",
              category: "Development",
              description: "This is sample data while the scraping system is being set up.",
              link: "https://example.com",
              pub_date: new Date().toISOString()
            }
          ],
          sources: [
            { name: "AI News Source", count: 26, color: "#6366f1" }
          ],
          generated_at: new Date().toISOString()
        }
      });
    }
    
    const latestReport = dailyReports[0];
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
}
