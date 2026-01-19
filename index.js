// index.js - SIMPLE WORKING VERSION
const express = require('express');
const app = express();

app.use(require('cors')());
app.use(express.json());

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Easy Keywords API Ready!',
    timestamp: new Date().toISOString() 
  });
});

// ✅ Generate Keywords
app.post('/api/keywords/generate', (req, res) => {
  const { title } = req.body || {};
  const baseKeywords = ['digital', 'art', 'creative', 'design', 'technology', 'background'];
  
  let keywords = [...baseKeywords];
  if (title) {
    keywords = [...keywords, ...title.toLowerCase().split(' ').filter(w => w.length > 2)];
  }
  
  res.json({ 
    success: true, 
    keywords: [...new Set(keywords)].slice(0, 20),
    count: keywords.length 
  });
});

// ✅ Root
app.get('/', (req, res) => {
  res.json({ 
    service: 'Easy Keywords Backend',
    endpoints: ['GET /api/health', 'POST /api/keywords/generate']
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));