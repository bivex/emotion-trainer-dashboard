import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_FOLDERS = [
  'generated_images1',
  'generated_images2',
  'generated_images3',
  'generated_images_v2_g',
  'generated_images_v2_g1',
  'generated_images_v2_g2',
  'generated_images_v2_g3',
  'generated_images_v2_g4'
];

const EMOTIONS = [
  'joy', 'sadness', 'anger', 'fear', 'surprise',
  'disgust', 'guilt', 'shame', 'suspicion', 'neutral'
];

const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'image-manifest.json');

function scanImages() {
  const images = [];

  for (const folder of IMAGE_FOLDERS) {
    const folderPath = path.join(publicImagesDir, folder);

    if (!fs.existsSync(folderPath)) {
      console.log(`Folder not found: ${folderPath}`);
      continue;
    }

    for (const emotion of EMOTIONS) {
      const emotionPath = path.join(folderPath, emotion);

      if (!fs.existsSync(emotionPath)) {
        continue;
      }

      // Scan person type subfolders
      const personTypes = fs.readdirSync(emotionPath);

      for (const personType of personTypes) {
        const personPath = path.join(emotionPath, personType);

        if (!fs.statSync(personPath).isDirectory()) {
          continue;
        }

        const files = fs.readdirSync(personPath);

        for (const file of files) {
          if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            images.push({
              path: `/images/${folder}/${emotion}/${personType}/${file}`,
              emotion: emotion,
              filename: file
            });
          }
        }
      }
    }
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
