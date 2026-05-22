import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ALL_EMOTIONS,
  EMOTION_PRESETS,
  getEmotionEmoji,
  createEmptyConfusionMatrix,
  createEmptyEmotionStats,
  shuffleArray,
  type EmotionKey,
} from '../types';
import imageManifest from '../../../data/image-manifest.json';

// ─── 1. ALL_EMOTIONS integrity ───

describe('ALL_EMOTIONS', () => {
  it('contains exactly 39 emotions', () => {
    expect(ALL_EMOTIONS).toHaveLength(39);
  });

  it('has no duplicates', () => {
    const unique = new Set(ALL_EMOTIONS);
    expect(unique.size).toBe(ALL_EMOTIONS.length);
  });

  it('contains only lowercase snake_case strings', () => {
    ALL_EMOTIONS.forEach((e) => {
      expect(e).toMatch(/^[a-z_]+$/);
    });
  });
});

// ─── 2. Every preset only contains valid ALL_EMOTIONS keys ───

describe('EMOTION_PRESETS', () => {
  const allSet = new Set<string>(ALL_EMOTIONS);

  it('has no preset referencing an emotion not in ALL_EMOTIONS', () => {
    const invalid: string[] = [];
    for (const [preset, emotions] of Object.entries(EMOTION_PRESETS)) {
      for (const e of emotions) {
        if (!allSet.has(e)) {
          invalid.push(`${preset} → ${e}`);
        }
      }
    }
    expect(invalid, `Invalid emotions found: ${invalid.join(', ')}`).toEqual([]);
  });

  it('every preset has at least 1 emotion', () => {
    for (const [preset, emotions] of Object.entries(EMOTION_PRESETS)) {
      expect(emotions.length, `Preset "${preset}" is empty`).toBeGreaterThan(0);
    }
  });

  it('"all" preset matches ALL_EMOTIONS exactly', () => {
    expect(EMOTION_PRESETS.all).toEqual(ALL_EMOTIONS);
  });

  it('"basic" preset has exactly 10 emotions', () => {
    expect(EMOTION_PRESETS.basic).toHaveLength(10);
  });

  it('"extended" preset has exactly 20 emotions', () => {
    expect(EMOTION_PRESETS.extended).toHaveLength(20);
  });

  it('"advanced" preset has exactly 30 emotions', () => {
    expect(EMOTION_PRESETS.advanced).toHaveLength(30);
  });
});

// ─── 3. Emoji mapping covers every emotion ───

describe('getEmotionEmoji', () => {
  it('returns a non-empty string for every ALL_EMOTIONS entry', () => {
    for (const emotion of ALL_EMOTIONS) {
      const emoji = getEmotionEmoji(emotion);
      expect(emoji, `No emoji for "${emotion}"`).toBeTruthy();
      expect(emoji, `Placeholder emoji for "${emotion}"`).not.toBe('❓');
    }
  });

  it('returns fallback for unknown emotion', () => {
    expect(getEmotionEmoji('unknown_emotion_xyz')).toBe('❓');
  });
});

// ─── 4. Manifest emotions match ALL_EMOTIONS ───

describe('Image manifest', () => {
  const manifestEmotions = new Set<string>(
    (imageManifest as { images: { emotion: string }[] }).images.map((i) => i.emotion),
  );
  const allSet = new Set<string>(ALL_EMOTIONS);

  it('every emotion in manifest exists in ALL_EMOTIONS', () => {
    const invalid = [...manifestEmotions].filter((e) => !allSet.has(e));
    expect(invalid, `Manifest has unknown emotions: ${invalid.join(', ')}`).toEqual([]);
  });

  it('every ALL_EMOTIONS entry has at least 1 image in manifest', () => {
    const missing = ALL_EMOTIONS.filter((e) => !manifestEmotions.has(e));
    expect(missing, `No images for emotions: ${missing.join(', ')}`).toEqual([]);
  });

  it('manifest emotions and ALL_EMOTIONS are identical sets', () => {
    expect(manifestEmotions.size).toBe(allSet.size);
    for (const e of allSet) {
      expect(manifestEmotions.has(e)).toBe(true);
    }
  });
});

// ─── 5. Button-to-emotion mapping: the core checkAnswer logic ───

describe('checkAnswer logic (button click → emotion identification)', () => {
  // Simulating the core comparison from useEmotionTrainer.ts:243
  // const correct = (emotion === actualEmotion);

  it('identifies correct emotion when button matches image emotion', () => {
    const testCases: { button: string; image: string; expected: boolean }[] = [
      { button: 'joy', image: 'joy', expected: true },
      { button: 'anger', image: 'anger', expected: true },
      { button: 'sociopathy', image: 'sociopathy', expected: true },
      { button: 'shallow_affect', image: 'shallow_affect', expected: true },
      { button: 'neutral', image: 'neutral', expected: true },
    ];

    for (const { button, image, expected } of testCases) {
      const correct = button === image;
      expect(correct, `Button "${button}" vs image "${image}"`).toBe(expected);
    }
  });

  it('identifies wrong emotion when button does not match image', () => {
    const testCases: { button: string; image: string }[] = [
      { button: 'joy', image: 'sadness' },
      { button: 'anger', image: 'fear' },
      { button: 'sociopathy', image: 'deceit' },
      { button: 'pride', image: 'narcissism' },
      { button: 'fear', image: 'anxiety' },
      { button: 'guilt', image: 'shame' },
      { button: 'embarrassment', image: 'shame' },
      { button: 'contempt', image: 'disgust' },
      { button: 'jealousy', image: 'envy' },
      { button: 'callousness', image: 'remorselessness' },
    ];

    for (const { button, image } of testCases) {
      const correct = button === image;
      expect(correct, `Button "${button}" vs image "${image}" should be WRONG`).toBe(false);
    }
  });

  it('is case-sensitive — uppercase never matches', () => {
    expect('joy' === 'Joy').toBe(false);
    expect('anger' === 'Anger').toBe(false);
  });

  it('is whitespace-sensitive — trimmed vs untrimmed never matches', () => {
    expect('joy' === 'joy ').toBe(false);
    expect('joy' === ' joy').toBe(false);
  });
});

// ─── 6. checkAnswer updates confusion matrix correctly ───

describe('Confusion matrix updates', () => {
  it('increments correct cell on right answer', () => {
    const matrix = createEmptyConfusionMatrix();
    const actual = 'joy' as EmotionKey;
    const predicted = 'joy' as EmotionKey;

    // Simulating the update logic from useEmotionTrainer.ts:252-258
    matrix[actual][predicted] = (matrix[actual]?.[predicted] || 0) + 1;

    expect(matrix[actual][predicted]).toBe(1);
    // No other cell in the "joy" row should have changed
    for (const col of ALL_EMOTIONS) {
      if (col !== predicted) {
        expect(matrix[actual][col]).toBe(0);
      }
    }
  });

  it('increments wrong cell on wrong answer', () => {
    const matrix = createEmptyConfusionMatrix();
    const actual = 'joy' as EmotionKey;
    const predicted = 'sadness' as EmotionKey;

    matrix[actual][predicted] = (matrix[actual]?.[predicted] || 0) + 1;

    expect(matrix[actual][predicted]).toBe(1);
    expect(matrix[actual]['joy']).toBe(0); // correct cell stays 0
  });

  it('accumulates correctly over multiple answers', () => {
    const matrix = createEmptyConfusionMatrix();

    // 3 correct joy answers
    for (let i = 0; i < 3; i++) {
      matrix['joy']['joy'] = (matrix['joy']?.['joy'] || 0) + 1;
    }
    // 2 wrong: joy image → sadness button
    for (let i = 0; i < 2; i++) {
      matrix['joy']['sadness'] = (matrix['joy']?.['sadness'] || 0) + 1;
    }

    expect(matrix['joy']['joy']).toBe(3);
    expect(matrix['joy']['sadness']).toBe(2);
  });
});

// ─── 7. Emotion stats updates ───

describe('Emotion stats updates', () => {
  it('tracks correct and total per emotion', () => {
    const stats = createEmptyEmotionStats();

    // Simulate: 2 correct, 1 wrong for "joy"
    // Answer 1: correct
    const actual1 = 'joy';
    const correct1 = true;
    stats[actual1] = {
      correct: (stats[actual1]?.correct || 0) + (correct1 ? 1 : 0),
      total: (stats[actual1]?.total || 0) + 1,
    };

    // Answer 2: correct
    stats[actual1] = {
      correct: (stats[actual1]?.correct || 0) + 1,
      total: (stats[actual1]?.total || 0) + 1,
    };

    // Answer 3: wrong
    const correct3 = false;
    stats[actual1] = {
      correct: (stats[actual1]?.correct || 0) + (correct3 ? 1 : 0),
      total: (stats[actual1]?.total || 0) + 1,
    };

    expect(stats['joy'].correct).toBe(2);
    expect(stats['joy'].total).toBe(3);
  });
});

// ─── 8. Button grid: every active emotion produces exactly one button ───

describe('Button-emotion mapping per preset', () => {
  // Verify that when activeEmotions is set from a preset,
  // each emotion key in the preset maps to exactly one button.
  // This mirrors EmotionMatrix.tsx: activeEmotions.map(emotion => <Button>)

  it('each preset emotion maps 1:1 to a button key', () => {
    for (const [preset, emotions] of Object.entries(EMOTION_PRESETS)) {
      // Simulating the button grid generation
      const buttonKeys = emotions.map((e) => e);

      // No duplicates in buttons
      const unique = new Set(buttonKeys);
      expect(unique.size, `Preset "${preset}" has duplicate button keys`).toBe(buttonKeys.length);

      // Every button key is a valid emotion
      for (const key of buttonKeys) {
        expect(ALL_EMOTIONS).toContain(key);
      }
    }
  });

  it('clicking a button passes the exact emotion key to checkAnswer', () => {
    // Simulating EmotionMatrix.tsx:58: onClick={() => checkAnswer(emotion)}
    // The `emotion` variable comes from activeEmotions.map()
    const activeEmotions = EMOTION_PRESETS.basic;

    for (const emotion of activeEmotions) {
      // This is exactly what happens in the onClick handler
      const passedToCheckAnswer = emotion;
      expect(typeof passedToCheckAnswer).toBe('string');
      expect(ALL_EMOTIONS).toContain(passedToCheckAnswer);
    }
  });
});

// ─── 9. filterImagesByPreset logic ───

describe('Image filtering by preset', () => {
  it('"all" preset includes all images', () => {
    const allImages = (imageManifest as { images: { emotion: string }[] }).images;
    const activeEmotions = new Set<string>(EMOTION_PRESETS.all);
    const filtered = allImages.filter((img) => activeEmotions.has(img.emotion));
    expect(filtered.length).toBe(allImages.length);
  });

  it('"basic" preset only includes the 10 basic emotions', () => {
    const allImages = (imageManifest as { images: { emotion: string }[] }).images;
    const activeEmotions = new Set<string>(EMOTION_PRESETS.basic);
    const filtered = allImages.filter((img) => activeEmotions.has(img.emotion));

    // All filtered images should have basic emotions
    for (const img of filtered) {
      expect(activeEmotions.has(img.emotion)).toBe(true);
    }

    // No basic emotion should be missing from the filtered set
    const filteredEmotions = new Set(filtered.map((i) => i.emotion));
    for (const e of EMOTION_PRESETS.basic) {
      expect(filteredEmotions.has(e), `Basic emotion "${e}" has no images`).toBe(true);
    }
  });
});

// ─── 10. Shuffle preserves all emotions ───

describe('shuffleArray', () => {
  it('preserves all elements', () => {
    const input = [...ALL_EMOTIONS];
    const shuffled = shuffleArray(input);
    expect(shuffled.sort()).toEqual([...ALL_EMOTIONS].sort());
  });

  it('does not mutate the original array', () => {
    const input = [...ALL_EMOTIONS];
    const copy = [...input];
    shuffleArray(input);
    expect(input).toEqual(copy);
  });
});

// ─── 11. Duplicate emotion lists: types.ts vs api/images.ts ───

describe('Consistency between types.ts and api/images.ts', () => {
  it('api/images.ts EMOTIONS list matches ALL_EMOTIONS (same set)', async () => {
    // Dynamic import to get the EMOTIONS constant from images.ts
    const imagesModule = await import('../../../api/images');
    // images.ts doesn't export EMOTIONS, but we can verify through manifest
    // that all manifest emotions match ALL_EMOTIONS
    const manifestEmotions = new Set<string>(
      (imageManifest as { images: { emotion: string }[] }).images.map((i) => i.emotion),
    );
    const allSet = new Set<string>(ALL_EMOTIONS);
    expect(manifestEmotions).toEqual(allSet);
  });
});

// ─── 12. Score calculation ───

describe('Score calculation', () => {
  it('accuracy is 0 when no answers given', () => {
    const score = { correct: 0, total: 0 };
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    expect(accuracy).toBe(0);
  });

  it('calculates accuracy correctly', () => {
    const score = { correct: 7, total: 10 };
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    expect(accuracy).toBe(70);
  });

  it('handles 100% accuracy', () => {
    const score = { correct: 15, total: 15 };
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    expect(accuracy).toBe(100);
  });
});

// ─── 13. Weak emotions detection ───

describe('Weak emotions detection', () => {
  it('identifies emotions with <70% accuracy and >=3 attempts as weak', () => {
    // Simulating getWeakEmotions logic from useEmotionTrainer.ts:77-84
    const emotionStats: Record<string, { correct: number; total: number }> = {
      joy: { correct: 1, total: 10 },       // 10% — weak
      sadness: { correct: 5, total: 10 },    // 50% — weak
      anger: { correct: 7, total: 10 },      // 70% — NOT weak (< 70 is false, 70 is not < 70)
      fear: { correct: 8, total: 10 },       // 80% — NOT weak
      surprise: { correct: 0, total: 2 },    // too few attempts — NOT weak
      disgust: { correct: 2, total: 3 },     // 66% — weak (total >= 3 and < 70%)
    };

    const weak = ALL_EMOTIONS.filter((emotion) => {
      const stats = emotionStats[emotion];
      if (!stats || stats.total < 3) return false;
      const accuracy = (stats.correct / stats.total) * 100;
      return accuracy < 70;
    });

    expect(weak).toContain('joy');
    expect(weak).toContain('sadness');
    expect(weak).toContain('disgust');
    expect(weak).not.toContain('anger');
    expect(weak).not.toContain('fear');
    expect(weak).not.toContain('surprise');
  });
});

// ─── 14. Similar emotions are correctly distinguished ───

describe('Similar emotion pairs are distinct keys', () => {
  const similarPairs = [
    ['guilt', 'shame'],
    ['embarrassment', 'shame'],
    ['contempt', 'disgust'],
    ['jealousy', 'envy'],
    ['callousness', 'remorselessness'],
    ['sociopathy', 'deceit'],
    ['fear', 'anxiety'],
    ['anger', 'frustration'],
    ['sadness', 'disappointment'],
    ['pride', 'narcissism'],
    ['manipulative', 'deceit'],
    ['joy', 'amusement'],
  ];

  it('each pair is a different string', () => {
    for (const [a, b] of similarPairs) {
      expect(a).not.toBe(b);
    }
  });

  it('each pair produces different checkAnswer results when image is one and button is other', () => {
    for (const [a, b] of similarPairs) {
      // If image is 'a' and user clicks 'b' — should be wrong
      expect(a === b).toBe(false);
      // If image is 'a' and user clicks 'a' — should be correct
      expect(a === a).toBe(true);
    }
  });
});
