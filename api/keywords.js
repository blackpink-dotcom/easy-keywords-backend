// api/keywords.js - FIXED VERSION
const express = require('express');

// Create Express app
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Parse JSON
app.use(express.json());

// ================ FAKE AI GENERATOR ================
function generateKeywords(title) {
  if (!title || title.trim() === '') {
    return [
      'digital', 'art', 'creative', 'design', 'innovation',
      'technology', 'background', 'abstract', 'modern', 'concept'
    ];
  }
  
  const keywords = new Set();
  const titleLower = title.toLowerCase();
  
  // Add words from title
  titleLower.split(/[\s,.]+/).forEach(word => {
    if (word.length > 3) {
      keywords.add(word);
    }
  });
  
  // Add related keywords
  const related = [
    'digital', 'art', 'creative', 'design', 'innovation',
    'technology', 'background', 'abstract', 'modern', 'concept',
    'graphic', 'visual', 'contemporary', 'minimal', 'professional'
  ];
  
  related.forEach(keyword => keywords.add(keyword));
  
  return Array.from(keywords).slice(0, 30);
}

// ================ API ENDPOINTS ================

// 1. ROOT ENDPOINT - Fix "Cannot GET /"
app.get('/', (req, res) => {
  res.json({
    message: 'Easy Keywords Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generate: '/api/keywords/generate (POST)',
      test: '/api/test'
    },
    usage: 'Send POST request to /api/keywords/generate with { "title": "your title" }'
  });
});

// 2. HEALTH CHECK
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    service: 'Easy Keywords Backend',
    uptime: process.uptime()
  });
});

// 3. TEST ENDPOINT
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    endpoints: [
      'GET /api/health',
      'POST /api/keywords/generate',
      'GET /api/test'
    ],
    example: {
      url: '/api/keywords/generate',
      method: 'POST',
      body: { "title": "Digital art background" }
    }
  });
});

// 4. GENERATE KEYWORDS - MAIN ENDPOINT
app.post('/api/keywords/generate', (req, res) => {
  try {
    console.log('Generate request received:', req.body);
    
    const { title, description } = req.body || {};
    const inputText = title || description || '';
    
    const keywords = generateKeywords(inputText);
    
    res.json({
      success: true,
      keywords: keywords,
      count: keywords.length,
      input: inputText || 'No input provided',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Generation error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      fallbackKeywords: [
        'digital', 'art', 'creative', 'design', 'innovation',
        'technology', 'background', 'abstract', 'modern', 'concept'
      ]
    });
  }
});

// 5. CATCH-ALL FOR UNDEFINED ROUTES
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requested: req.path,
    available: [
      '/',
      '/api/health',
      '/api/keywords/generate',
      '/api/test'
    ]
  });
});

// ================ SERVER SETUP ================

// For Vercel, we need to export the app
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
  });
}