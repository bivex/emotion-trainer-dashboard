import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_IMAGE_PATH = '/Volumes/External/Code/GenEmotions-RTX5070Ti';
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'image-manifest.json');

function scanImages() {
  const images = [];
  
  // Auto-detect emotion folders by scanning base directory
  const basePath = BASE_IMAGE_PATH;
  if (!fs.existsSync(basePath)) {
    console.error(`ERROR: Base image path does not exist: ${basePath}`);
    return images;
  }
  
  const items = fs.readdirSync(basePath);
  const emotionFolders = items.filter(item => {
    const fullPath = path.join(basePath, item);
    return fs.statSync(fullPath).isDirectory() && !item.startsWith('.');
  });
  
  console.log(`Found ${emotionFolders.length} emotion folders: ${emotionFolders.join(', ')}`);
  
  for (const emotion of emotionFolders) {
    const emotionPath = path.join(basePath, emotion);
    
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
            path: `/images/${relativePath.replace(/\\/g, '/')}`,
            emotion: emotion,
            filename: item
          });
        }
      }
    }
    
    scanDirectory(emotionPath, basePath);
  }
  
   return images;
}

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const images = scanImages();

fs.writeFileSync(outputFile, JSON.stringify({ images, total: images.length }, null, 2));

console.log(`Generated manifest with ${images.length} images`);
console.log(`Output: ${outputFile}`);
