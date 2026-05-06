const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Base path for emotion images (RTX5070Ti storage)
const BASE_IMAGE_PATH = '/Volumes/External/Code/GenEmotions-RTX5070Ti';

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static images directly from base path
app.use('/images', express.static(BASE_IMAGE_PATH));

// Auto-detect emotion folders
let EMOTIONS = [];
if (fs.existsSync(BASE_IMAGE_PATH)) {
  const items = fs.readdirSync(BASE_IMAGE_PATH);
  EMOTIONS = items.filter(item => {
    const fullPath = path.join(BASE_IMAGE_PATH, item);
    return fs.statSync(fullPath).isDirectory() && !item.startsWith('.');
  });
}

// API endpoint to get all emotion images
app.get('/api/images', (req, res) => {
  const images = [];
  
  console.log('Scanning for emotion images...');
  console.log(`Base path: ${BASE_IMAGE_PATH}`);
  
  for (const emotion of EMOTIONS) {
    try {
      const emotionPath = path.join(BASE_IMAGE_PATH, emotion);
      
      if (fs.existsSync(emotionPath)) {
        // Recursively scan all subdirectories for image files
        function scanDirectory(dir, relativeTo) {
          const items = fs.readdirSync(dir);
          
          for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
              scanDirectory(itemPath, relativeTo);
            } else if (stat.isFile() && (item.endsWith('.png') || item.endsWith('.jpg') || item.endsWith('.jpeg'))) {
              const relativePath = path.relative(relativeTo, itemPath);
              images.push({
                path: `/images${relativePath.replace(/\\/g, '/')}`,
                emotion: emotion,
                filename: item
              });
            }
          }
        }
        
        scanDirectory(emotionPath, BASE_IMAGE_PATH);
      }
    } catch (error) {
      console.log(`Error scanning ${emotion}:`, error.message);
    }
  }
  
  console.log(`Total images found: ${images.length}`);
  res.json({ images, total: images.length });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Image server is running' });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  const stats = {};
  
  EMOTIONS.forEach(emotion => {
    stats[emotion] = 0;
  });
  
  for (const emotion of EMOTIONS) {
    try {
      const emotionPath = path.join(BASE_IMAGE_PATH, emotion);
      
      if (fs.existsSync(emotionPath)) {
        // Count all image files recursively
        function countImages(dir) {
          let count = 0;
          const items = fs.readdirSync(dir);
          
          for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
              count += countImages(itemPath);
            } else if (stat.isFile() && (item.endsWith('.png') || item.endsWith('.jpg') || item.endsWith('.jpeg'))) {
              count++;
            }
          }
          
          return count;
        }
        
        stats[emotion] = countImages(emotionPath);
      }
    } catch (error) {
      // Ignore errors
    }
  }
  
  res.json({ stats, emotions: EMOTIONS });
});

app.listen(PORT, () => {
  console.log(`🚀 Image server running on http://localhost:${PORT}`);
  console.log(`📸 Serving images from ${BASE_IMAGE_PATH}`);
  console.log(`🔗 API endpoints:`);
  console.log(`   GET /api/images - Get all emotion images`);
  console.log(`   GET /api/stats - Get emotion statistics`);
  console.log(`   GET /health - Health check`);
});
