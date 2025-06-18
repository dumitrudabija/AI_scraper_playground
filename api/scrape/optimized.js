const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

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
    const { chunk = 'all', sources = [] } = req.body;
    
    // Strategy 1: Chunked Processing
    if (chunk === 'chunk1') {
      return await processChunk1(res);
    } else if (chunk === 'chunk2') {
      return await processChunk2(res);
    } else if (chunk === 'chunk3') {
      return await processChunk3(res);
    } else if (chunk === 'combine') {
      return await combineChunks(res);
    }
    
    // Strategy 2: Source-specific processing
    if (sources.length > 0) {
      return await processSpecificSources(res, sources);
    }
    
    // Strategy 3: Quick scrape (no AI summarization)
    return await quickScrape(res);
    
  } catch (error) {
    console.error('Error in optimized scraping:', error);
    res.status(500).json({ 
      error: 'Failed to trigger optimized scraping',
      message: error.message
    });
  }
}

async function processChunk1(res) {
  // Process RSS feeds (fast sources): OpenAI, Anthropic, Google AI, ArXiv
  const sources = ['openai_blog', 'anthropic_blog', 'google_ai_blog', 'arxiv_ai'];
  
  try {
    const scriptPath = path.join(process.cwd(), 'scrapers', 'optimized_scraper.py');
    
    res.json({
      success: true,
      message: 'Processing chunk 1: RSS feeds (4 sources)',
      chunk: 'chunk1',
      sources: sources,
      timestamp: new Date().toISOString(),
      nextStep: 'Call with chunk=chunk2 after this completes'
    });
    
    // Run Python scraper with specific sources
    const pythonProcess = spawn('python3', [scriptPath, '--chunk', '1'], {
      cwd: process.cwd(),
      env: { ...process.env },
      stdio: 'pipe'
    });
    
    handlePythonProcess(pythonProcess, 'chunk1');
    
  } catch (error) {
    throw new Error(`Chunk 1 processing failed: ${error.message}`);
  }
}

async function processChunk2(res) {
  // Process social sources: Reddit, Hacker News
  const sources = ['reddit_ml', 'reddit_localllama', 'hackernews_ai'];
  
  try {
    const scriptPath = path.join(process.cwd(), 'scrapers', 'optimized_scraper.py');
    
    res.json({
      success: true,
      message: 'Processing chunk 2: Social sources (3 sources)',
      chunk: 'chunk2',
      sources: sources,
      timestamp: new Date().toISOString(),
      nextStep: 'Call with chunk=chunk3 after this completes'
    });
    
    const pythonProcess = spawn('python3', [scriptPath, '--chunk', '2'], {
      cwd: process.cwd(),
      env: { ...process.env },
      stdio: 'pipe'
    });
    
    handlePythonProcess(pythonProcess, 'chunk2');
    
  } catch (error) {
    throw new Error(`Chunk 2 processing failed: ${error.message}`);
  }
}

async function processChunk3(res) {
  // Process news sources: TechCrunch, VentureBeat, Hugging Face, GitHub
  const sources = ['techcrunch_ai', 'venturebeat_ai', 'huggingface_blog', 'github_ai_trending'];
  
  try {
    const scriptPath = path.join(process.cwd(), 'scrapers', 'optimized_scraper.py');
    
    res.json({
      success: true,
      message: 'Processing chunk 3: News sources (4 sources)',
      chunk: 'chunk3',
      sources: sources,
      timestamp: new Date().toISOString(),
      nextStep: 'Call with chunk=combine to generate final report'
    });
    
    const pythonProcess = spawn('python3', [scriptPath, '--chunk', '3'], {
      cwd: process.cwd(),
      env: { ...process.env },
      stdio: 'pipe'
    });
    
    handlePythonProcess(pythonProcess, 'chunk3');
    
  } catch (error) {
    throw new Error(`Chunk 3 processing failed: ${error.message}`);
  }
}

async function combineChunks(res) {
  // Combine all chunks and generate AI summary
  try {
    const scriptPath = path.join(process.cwd(), 'scrapers', 'optimized_scraper.py');
    
    res.json({
      success: true,
      message: 'Combining chunks and generating AI summary',
      chunk: 'combine',
      timestamp: new Date().toISOString(),
      note: 'Final report will be available at /api/reports/latest'
    });
    
    const pythonProcess = spawn('python3', [scriptPath, '--combine'], {
      cwd: process.cwd(),
      env: { ...process.env },
      stdio: 'pipe'
    });
    
    handlePythonProcess(pythonProcess, 'combine');
    
  } catch (error) {
    throw new Error(`Chunk combination failed: ${error.message}`);
  }
}

async function processSpecificSources(res, sources) {
  // Process only specific sources (for targeted updates)
  try {
    const scriptPath = path.join(process.cwd(), 'scrapers', 'optimized_scraper.py');
    
    res.json({
      success: true,
      message: `Processing specific sources: ${sources.join(', ')}`,
      sources: sources,
      timestamp: new Date().toISOString()
    });
    
    const pythonProcess = spawn('python3', [scriptPath, '--sources', ...sources], {
      cwd: process.cwd(),
      env: { ...process.env },
      stdio: 'pipe'
    });
    
    handlePythonProcess(pythonProcess, 'specific');
    
  } catch (error) {
    throw new Error(`Specific source processing failed: ${error.message}`);
  }
}

async function quickScrape(res) {
  // Quick scrape without AI summarization (under 30 seconds)
  try {
    const scriptPath = path.join(process.cwd(), 'scrapers', 'optimized_scraper.py');
    
    res.json({
      success: true,
      message: 'Running quick scrape (no AI summarization)',
      mode: 'quick',
      timestamp: new Date().toISOString(),
      note: 'Articles will be available without AI summary for speed'
    });
    
    const pythonProcess = spawn('python3', [scriptPath, '--quick'], {
      cwd: process.cwd(),
      env: { ...process.env },
      stdio: 'pipe'
    });
    
    handlePythonProcess(pythonProcess, 'quick');
    
  } catch (error) {
    throw new Error(`Quick scrape failed: ${error.message}`);
  }
}

function handlePythonProcess(pythonProcess, mode) {
  let output = '';
  let errorOutput = '';
  
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`Python stdout (${mode}): ${data}`);
  });
  
  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error(`Python stderr (${mode}): ${data}`);
  });
  
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`${mode} processing completed successfully`);
    } else {
      console.error(`${mode} processing failed with code ${code}`);
    }
  });
  
  pythonProcess.on('error', (error) => {
    console.error(`Failed to start ${mode} processing:`, error);
  });
}
