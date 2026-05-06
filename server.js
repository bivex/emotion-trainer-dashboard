const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static images from the generated_images folders
app.use('/images', express.static(path.join(__dirname, '..', 'generated_images_v2_g')));
app.use('/images', express.static(path.join(__dirname, '..', 'generated_images_v2_g1')));
app.use('/images', express.static(path.join(__dirname, '..', 'generated_images_v2_g2')));
app.use('/images', express.static(path.join(__dirname, '..', 'generated_images_v2_g3')));
app.use('/images', express.static(path.join(__dirname, '..', 'generated_images_v2_g4')));

const EMOTIONS = [
  'joy', 'sadness', 'anger', 'fear', 'surprise',
  'disgust', 'guilt', 'shame', 'suspicion', 'neutral'
];

const IMAGE_FOLDERS = [
  path.join(__dirname, '..', 'generated_images_v2_g'),
  path.join(__dirname, '..', 'generated_images_v2_g1'),
  path.join(__dirname, '..', 'generated_images_v2_g2'),
  path.join(__dirname, '..', 'generated_images_v2_g3'),
  path.join(__dirname, '..', 'generated_images_v2_g4')
];

// API endpoint to get all emotion images
app.get('/api/images', (req, res) => {
  const images = [];

  IMAGE_FOLDERS.forEach(folder => {
    EMOTIONS.forEach(emotion => {
      try {
        const emotionPath = path.join(folder, emotion);

        if (fs.existsSync(emotionPath)) {
          const files = fs.readdirSync(emotionPath);

          files.forEach(file => {
            if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
              const folderName = path.basename(folder);
              images.push({
                path: `/images/${folderName}/${emotion}/${file}`,
                emotion: emotion,
                filename: file
              });
            }
          });
        }
      } catch (error) {
        console.log(`Error scanning ${folder}/${emotion}:`, error.message);
      }
    });
  });

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

  IMAGE_FOLDERS.forEach(folder => {
    EMOTIONS.forEach(emotion => {
      try {
        const emotionPath = path.join(folder, emotion);

        if (fs.existsSync(emotionPath)) {
          const files = fs.readdirSync(emotionPath);
          const imageFiles = files.filter(file =>
            file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
          );
          stats[emotion] += imageFiles.length;
        }
      } catch (error) {
        // Ignore errors
      }
    });
  });

  res.json({ stats, emotions: EMOTIONS });
});

app.listen(PORT, () => {
  console.log(`🚀 Image server running on http://localhost:${PORT}`);
  console.log(`📸 Serving images from generated_images_v2_g* folders`);
  console.log(`🔗 API endpoints:`);
  console.log(`   GET /api/images - Get all emotion images`);
  console.log(`   GET /api/stats - Get emotion statistics`);
  console.log(`   GET /health - Health check`);
});
