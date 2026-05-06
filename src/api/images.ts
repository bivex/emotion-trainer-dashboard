import imageManifest from '../data/image-manifest.json';

export interface EmotionImage {
  path: string;
  absolute_path?: string;
  emotion: string;
  filename: string;
}

// All 39 emotions from the dataset (matches manifest)
const EMOTIONS = [
  'amusement', 'anger', 'anxiety', 'awe', 'callousness',
  'confusion', 'contempt', 'deceit', 'despair', 'determination',
  'disappointment', 'disgust', 'embarrassment', 'envy', 'excitement',
  'fear', 'fearlessness', 'frustration', 'guilt', 'hatred',
  'interest', 'jealousy', 'joy', 'loneliness', 'manipulative',
  'narcissism', 'neutral', 'predatory', 'pride', 'regret',
  'relief', 'remorselessness', 'resentment', 'sadness', 'shallow_affect',
  'shame', 'sociopathy', 'surprise', 'suspicion'
] as const;
export type EmotionKey = typeof EMOTIONS[number];

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export function getAllEmotionImages(): EmotionImage[] {
  const manifest = imageManifest as { images: EmotionImage[] };
  return manifest.images;
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
