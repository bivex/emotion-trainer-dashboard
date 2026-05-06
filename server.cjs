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
// Note: Express serves files in order of middleware registration
// More specific routes should come first, but since all start with /images,
// we need to handle this differently. Let's use a custom middleware.

app.use('/images/:folder/:emotion/:subfolder/:filename', (req, res, next) => {
  const { folder, emotion, subfolder, filename } = req.params;
  const filePath = path.join(__dirname, '..', '..', 'GenEmotions', folder, emotion, subfolder, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next();
  }
});

app.use('/images/:folder/:emotion/:filename', (req, res, next) => {
  const { folder, emotion, filename } = req.params;
  const filePath = path.join(__dirname, '..', '..', 'GenEmotions', folder, emotion, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next();
  }
});

// Fallback static serving for any other image requests
app.use('/images', express.static(path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g')));
app.use('/images', express.static(path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g1')));
app.use('/images', express.static(path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g2')));
app.use('/images', express.static(path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g3')));
app.use('/images', express.static(path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g4')));

const EMOTIONS = [
  'joy', 'sadness', 'anger', 'fear', 'surprise',
  'disgust', 'guilt', 'shame', 'suspicion', 'neutral'
];

const IMAGE_FOLDERS = [
  path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g'),
  path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g1'),
  path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g2'),
  path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g3'),
  path.join(__dirname, '..', '..', 'GenEmotions', 'generated_images_v2_g4')
];

// API endpoint to get all emotion images
app.get('/api/images', (req, res) => {
  const images = [];

  console.log('Scanning for emotion images...');

  IMAGE_FOLDERS.forEach(folder => {
    console.log(`Checking folder: ${folder}`);
    console.log(`Folder exists: ${fs.existsSync(folder)}`);

    EMOTIONS.forEach(emotion => {
      try {
        const emotionPath = path.join(folder, emotion);
        console.log(`  Checking emotion path: ${emotionPath}`);

        if (fs.existsSync(emotionPath)) {
          // Recursively scan all subdirectories for image files
          function scanDirectory(dir) {
            const items = fs.readdirSync(dir);

            for (const item of items) {
              const itemPath = path.join(dir, item);
              const stat = fs.statSync(itemPath);

              if (stat.isDirectory()) {
                // Recursively scan subdirectory
                scanDirectory(itemPath);
              } else               if (stat.isFile() && (item.endsWith('.png') || item.endsWith('.jpg') || item.endsWith('.jpeg'))) {
                // Found an image file
                const folderName = path.basename(folder);
                const relativePath = path.relative(path.dirname(emotionPath), itemPath);
                images.push({
                  path: `/images/${folderName}/${relativePath.replace(/\\/g, '/')}`,
                  emotion: emotion,
                  filename: item
                });
              }
            }
          }

          scanDirectory(emotionPath);
          console.log(`  Found ${images.length} total images so far`);
        }
      } catch (error) {
        console.log(`Error scanning ${folder}/${emotion}:`, error.message);
      }
    });
  });

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
