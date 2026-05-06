import imageManifest from '../data/image-manifest.json';

export interface EmotionImage {
  path: string;
  absolute_path?: string;
  emotion: string;
  filename: string;
}

const EMOTIONS = [
  'joy', 'sadness', 'anger', 'fear', 'surprise',
  'disgust', 'guilt', 'shame', 'suspicion', 'neutral'
];

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export function getAllEmotionImages(): EmotionImage[] {
  return imageManifest.images as EmotionImage[];
}

export function getEmotionStats(): { [emotion: string]: number } {
  const stats: { [emotion: string]: number } = {};
  const allImages = getAllEmotionImages();
  for (const emotion of EMOTIONS) {
    stats[emotion] = allImages.filter(img => img.emotion === emotion).length;
  }
  return stats;
}

export async function fetchEmotionImages(): Promise<EmotionImage[]> {
  if (isTauri()) {
    const { invoke } = await import('@tauri-apps/api/core');
    const { convertFileSrc } = await import('@tauri-apps/api/core');
    const images = await invoke<EmotionImage[]>('scan_images');
    return images.map(img => ({
      ...img,
      path: convertFileSrc(img.absolute_path || img.path),
    }));
  }
  return getAllEmotionImages();
}
