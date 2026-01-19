// File: api/keywords.js
// SIMPLE VERSION - No Firebase, No Database
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// FAKE AI KEYWORD GENERATOR (No API Key Needed)
// ============================================
class FakeAIService {
    generateKeywords(title, category = 'general') {
        if (!title) {
            return this.getFallbackKeywords();
        }

        const keywords = new Set();
        const titleLower = title.toLowerCase();
        
        // Extract words from title
        titleLower.split(/[\s,.]+/).forEach(word => {
            if (word.length > 3) keywords.add(word);
        });
        
        // Add category-based keywords
        const categoryKeywords = {
            technology: ['digital', 'tech', 'computer', 'innovation', 'future', 'ai', 'software', 'hardware'],
            nature: ['nature', 'landscape', 'forest', 'tree', 'environment', 'green', 'eco', 'sustainable'],
            business: ['business', 'office', 'corporate', 'professional', 'success', 'teamwork', 'meeting'],
            people: ['people', 'portrait', 'smile', 'happy', 'person', 'face', 'family', 'community'],
            art: ['art', 'creative', 'design', 'abstract', 'colorful', 'painting', 'illustration', 'graphic']
        };
        
        // Add keywords based on category
        if (categoryKeywords[category]) {
            categoryKeywords[category].forEach(kw => keywords.add(kw));
        }
        
        // Add general keywords
        const generalKeywords = [
            'creative', 'design', 'background', 'modern', 'concept',
            'innovation', 'technology', 'digital', 'abstract', 'graphic',
            'visual', 'contemporary', 'minimal', 'professional', 'solution'
        ];
        
        generalKeywords.forEach(kw => keywords.add(kw));
        
        // Return 20-30 keywords
        return Array.from(keywords).slice(0, 30);
    }
    
    getFallbackKeywords() {
        return [
            'digital', 'art', 'creative', 'design', 'innovation',
            'technology', 'background', 'abstract', 'modern', 'concept',
            'graphic', 'visual', 'contemporary', 'minimal', 'professional'
        ];
    }
}

// ============================================
// API ENDPOINTS
// ============================================

const aiService = new FakeAIService();

// 1. Health Check - Test if server is working
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: '1.0.0',
        message: 'Easy Keywords Backend is working!',
        timestamp: new Date().toISOString(),
        free: true
    });
});

// 2. Generate Keywords - MAIN ENDPOINT
app.post('/api/keywords/generate', (req, res) => {
    try {
        const { title, description, category } = req.body;
        
        console.log('📝 Generating keywords for:', title || 'No title');
        
        const keywords = aiService.generateKeywords(title || description, category || 'general');
        
        res.json({
            success: true,
            keywords: keywords,
            count: keywords.length,
            processingTime: 0.1,
            model: 'local-generator',
            message: 'Keywords generated successfully!'
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            fallbackKeywords: aiService.getFallbackKeywords()
        });
    }
});

// 3. Simple Test Endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Easy Keywords API is working!',
        endpoints: [
            'GET /api/health',
            'POST /api/keywords/generate',
            'GET /api/test',
            'GET /api/sample-keywords'
        ]
    });
});

// 4. Sample Keywords for Testing
app.get('/api/sample-keywords', (req, res) => {
    const samples = [
        {
            title: "Sunset over mountains",
            keywords: ["sunset", "mountains", "landscape", "nature", "sky", "evening", "scenic", "view"]
        },
        {
            title: "Digital technology background",
            keywords: ["digital", "technology", "background", "abstract", "tech", "innovation", "future", "data"]
        },
        {
            title: "Business meeting office",
            keywords: ["business", "meeting", "office", "professional", "teamwork", "corporate", "work", "success"]
        }
    ];
    
    res.json({
        success: true,
        samples: samples
    });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🚀 EASY KEYWORDS BACKEND STARTED!
    =================================
    📡 Local: http://localhost:${PORT}
    📊 Health: http://localhost:${PORT}/api/health
    🎯 Ready for Chrome Extension!
    
    🔧 Endpoints:
    - POST /api/keywords/generate
    - GET  /api/health
    - GET  /api/test
    
    💡 Tip: Test with curl:
    curl -X POST http://localhost:3000/api/keywords/generate \\
      -H "Content-Type: application/json" \\
      -d '{"title":"Digital art background"}'
    =================================
    `);
});

// Export for Vercel
module.exports = app;