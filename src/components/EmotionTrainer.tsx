/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-28T23:01:03
 * Last Updated: 2025-12-28T23:10:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import React, { useState, useEffect } from 'react';
import { fetchEmotionImages, type EmotionImage } from '../api/images';
import MatrixBackground from './MatrixBackground';
import { ThemeToggle } from './theme-toggle';
import { LanguageSelector } from './LanguageSelector';
import { DevToolsToggle } from './devtools-toggle';
import { useLanguage } from '../i18n/LanguageProvider';
import { Button } from './ui/button';
import { Brain, Zap, BarChart3, Microscope, Theater, RefreshCw, Shield, X, Target, RotateCcw, Grid3X3 } from 'lucide-react';

const EMOTIONS = [
  'joy', 'sadness', 'anger', 'fear', 'surprise',
  'disgust', 'guilt', 'shame', 'suspicion', 'neutral'
] as const;

type EmotionKey = typeof EMOTIONS[number];

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Types for confusion matrix and per-emotion stats
type ConfusionMatrix = { [actual: string]: { [predicted: string]: number } };
type EmotionStats = { [emotion: string]: { correct: number; total: number } };

// LocalStorage keys
const STORAGE_KEYS = {
  score: 'emotion-trainer-score',
  confusionMatrix: 'emotion-trainer-confusion',
  emotionStats: 'emotion-trainer-emotion-stats',
  trainingMode: 'emotion-trainer-training-mode',
};

// Initialize empty confusion matrix
const createEmptyConfusionMatrix = (): ConfusionMatrix => {
  const matrix: ConfusionMatrix = {};
  EMOTIONS.forEach(actual => {
    matrix[actual] = {};
    EMOTIONS.forEach(predicted => {
      matrix[actual][predicted] = 0;
    });
  });
  return matrix;
};

// Initialize empty emotion stats
const createEmptyEmotionStats = (): EmotionStats => {
  const stats: EmotionStats = {};
  EMOTIONS.forEach(emotion => {
    stats[emotion] = { correct: 0, total: 0 };
  });
  return stats;
};

const EmotionTrainer: React.FC = () => {
  const { t } = useLanguage();
  const [currentImage, setCurrentImage] = useState<EmotionImage | null>(null);
  const [imageQueue, setImageQueue] = useState<EmotionImage[]>([]); // Shuffled queue
  const [queueIndex, setQueueIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [score, setScore] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.score);
    return stored ? JSON.parse(stored) : { correct: 0, total: 0 };
  });
  const [showResult, setShowResult] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState(false);

  // Confusion matrix: tracks actual vs predicted emotions
  const [confusionMatrix, setConfusionMatrix] = useState<ConfusionMatrix>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.confusionMatrix);
    return stored ? JSON.parse(stored) : createEmptyConfusionMatrix();
  });

  // Per-emotion statistics
  const [emotionStats, setEmotionStats] = useState<EmotionStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.emotionStats);
    return stored ? JSON.parse(stored) : createEmptyEmotionStats();
  });

  // Training mode: focus on weak emotions
  const [trainingMode, setTrainingMode] = useState<'normal' | 'weak'>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.trainingMode);
    return (stored as 'normal' | 'weak') || 'normal';
  });

  // Show confusion matrix modal
  const [showConfusionMatrix, setShowConfusionMatrix] = useState(false);

  const getEmotionTranslation = (emotion: string): string => {
    return t.emotions[emotion as EmotionKey] || emotion;
  };

  // Calculate remaining images
  const remainingImages = imageQueue.length - queueIndex;

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.score, JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.confusionMatrix, JSON.stringify(confusionMatrix));
  }, [confusionMatrix]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.emotionStats, JSON.stringify(emotionStats));
  }, [emotionStats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.trainingMode, trainingMode);
  }, [trainingMode]);

  // Get weak emotions (accuracy < 70%)
  const getWeakEmotions = (): string[] => {
    return EMOTIONS.filter(emotion => {
      const stats = emotionStats[emotion];
      if (stats.total < 3) return false; // Need at least 3 attempts
      const accuracy = (stats.correct / stats.total) * 100;
      return accuracy < 70;
    });
  };

  // Get emotion accuracy for display
  const getEmotionAccuracy = (emotion: string): number => {
    const stats = emotionStats[emotion];
    if (stats.total === 0) return 0;
    return Math.round((stats.correct / stats.total) * 100);
  };

  // Reset all statistics
  const resetStats = () => {
    setScore({ correct: 0, total: 0 });
    setConfusionMatrix(createEmptyConfusionMatrix());
    setEmotionStats(createEmptyEmotionStats());
  };

  // Sound system
  const playEmotionSound = (emotion: string, isCorrect: boolean) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Emotion-specific frequencies
      const frequencies: { [key: string]: number } = {
        joy: 523, // C5
        sadness: 294, // D4
        anger: 175, // F3
        fear: 220, // A3
        surprise: 659, // E5
        disgust: 131, // C3
        guilt: 247, // B3
        shame: 196, // G3
        suspicion: 330, // E4
        neutral: 440, // A4
      };

      oscillator.frequency.setValueAtTime(
        frequencies[emotion] || 440,
        audioContext.currentTime
      );

      if (isCorrect) {
        // Success sound: ascending arpeggio
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.frequency.setValueAtTime(frequencies[emotion] || 440, audioContext.currentTime);
        oscillator.frequency.setValueAtTime((frequencies[emotion] || 440) * 1.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime((frequencies[emotion] || 440) * 1.5, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else {
        // Error sound: descending tone
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.frequency.setValueAtTime(frequencies[emotion] || 440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime((frequencies[emotion] || 440) * 0.5, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      // Silently fail if Web Audio API is not supported
      console.log('Audio not supported');
    }
  };

  // Initialize shuffled queue from images (with training mode support)
  const initializeQueue = (imageList: EmotionImage[], mode: 'normal' | 'weak' = trainingMode) => {
    let filteredList = imageList;

    if (mode === 'weak') {
      const weakEmotions = getWeakEmotions();
      if (weakEmotions.length > 0) {
        // Filter to only weak emotions
        filteredList = imageList.filter(img => weakEmotions.includes(img.emotion));
        console.log(`Training mode: focusing on ${weakEmotions.length} weak emotions (${weakEmotions.join(', ')})`);
      } else {
        console.log('No weak emotions found, using all images');
      }
    }

    const shuffled = shuffleArray(filteredList);
    setImageQueue(shuffled);
    setTotalImages(filteredList.length);
    setQueueIndex(0);
    if (shuffled.length > 0) {
      setCurrentImage(shuffled[0]);
    }
    console.log(`Initialized queue with ${shuffled.length} shuffled images`);
  };

  // Load next image from queue
  const loadNextImage = () => {
    const nextIndex = queueIndex + 1;

    if (nextIndex >= imageQueue.length) {
      // All images seen - reshuffle and start over
      console.log('All images seen, reshuffling...');
      const reshuffled = shuffleArray(imageQueue);
      setImageQueue(reshuffled);
      setQueueIndex(0);
      setCurrentImage(reshuffled[0]);
    } else {
      // Move to next image in queue
      setQueueIndex(nextIndex);
      setCurrentImage(imageQueue[nextIndex]);
    }

    setShowResult(false);
    setSelectedEmotion('');
  };

  // Загрузка изображений из API или mock данных
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Try to fetch from API first
        const imageList = await fetchEmotionImages();

        if (imageList.length > 0) {
          initializeQueue(imageList);
        }

        console.log(`Loaded ${imageList.length} emotion images from dataset`);
      } catch (error) {
        console.error('Error loading images:', error);
        // Fallback to mock data
        const mockImages: EmotionImage[] = EMOTIONS.flatMap(emotion =>
          Array.from({ length: 10 }, (_, i) => ({
            path: `/images/generated_images_v2_g/${emotion}/sample_${i}.png`,
            emotion: emotion,
            filename: `sample_${i}.png`
          }))
        );
        initializeQueue(mockImages);
        console.log('Using mock data due to API unavailability');
      }
    };

    loadImages();
  }, []);

  const checkAnswer = (emotion: string) => {
    if (!currentImage) return;

    const actualEmotion = currentImage.emotion;
    const correct = emotion === actualEmotion;
    setIsCorrect(correct);
    setSelectedEmotion(emotion);
    setShowResult(true);

    // Play emotion-specific sound
    playEmotionSound(emotion, correct);

    // Update score
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    // Update confusion matrix
    setConfusionMatrix(prev => ({
      ...prev,
      [actualEmotion]: {
        ...prev[actualEmotion],
        [emotion]: (prev[actualEmotion]?.[emotion] || 0) + 1
      }
    }));

    // Update per-emotion stats
    setEmotionStats(prev => ({
      ...prev,
      [actualEmotion]: {
        correct: prev[actualEmotion].correct + (correct ? 1 : 0),
        total: prev[actualEmotion].total + 1
      }
    }));

    // Автоматически перейти к следующему изображению через 2 секунды
    setTimeout(() => {
      loadNextImage();
    }, 2000);
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      joy: '😊',
      sadness: '😢',
      anger: '😠',
      fear: '😨',
      surprise: '😲',
      disgust: '🤢',
      guilt: '😔',
      shame: '😳',
      suspicion: '🤨',
      neutral: '😐'
    };
    return emojiMap[emotion] || '❓';
  };

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <MatrixBackground>
      <div className="p-2 sm:p-4 matrix-grid">
        <div className="max-w-8xl mx-auto relative" role="main" aria-label="Emotion Recognition Training Dashboard">
          {/* Compact Mobile Header */}
          <div className="mb-6 text-center sm:mb-10">
            {/* Logo bar - compact on mobile */}
            <div className="inline-flex items-center gap-2 sm:gap-4 matrix-glass rounded-xl sm:rounded-2xl px-4 sm:px-8 py-2 sm:py-4 mb-3 sm:mb-4 animate-matrix-float matrix-border">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-matrix-accent rounded-lg sm:rounded-xl flex items-center justify-center matrix-glow animate-matrix-pulse">
                <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-matrix-bg" />
              </div>
              <div className="font-matrix-display text-matrix-accent text-sm sm:text-lg tracking-wider">
                {t.appTitle}
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-matrix-secondary rounded-lg sm:rounded-xl flex items-center justify-center matrix-glow animate-matrix-pulse" style={{ animationDelay: '0.5s' }}>
                <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-matrix-bg" />
              </div>
            </div>

            <div className="matrix-hero-shell">
              {/* Title - hidden on mobile, shown on tablet+ */}
              <h1 className="matrix-hero-title hidden sm:block font-matrix-display text-display-lg mb-4 tracking-wider animate-matrix-glow" aria-label="Neural Emotion Scanner - AI-powered emotion recognition training">
                {t.title}
                <br />
                <span className="matrix-hero-accent">{t.titleAccent}</span>
                <br />
                {t.titleEnd}
              </h1>

              {/* Subtitle - hidden on mobile */}
              <p className="matrix-hero-subtitle hidden sm:block text-body-lg max-w-3xl mx-auto leading-relaxed font-medium mb-6">
                {t.subtitle}
                <br />
                {t.subtitleLine2}
              </p>
            </div>

            {/* Controls - compact on mobile */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <Button variant="secondary" size="sm" className="matrix-primary-action px-3 font-matrix text-xs uppercase tracking-wider sm:px-4 sm:text-sm">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t.matrixReady}</span>
              </Button>
              <ThemeToggle />
              <DevToolsToggle />
              <LanguageSelector />
            </div>
          </div>

          {/* Responsive Grid Layout - reordered for mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 mb-4 sm:mb-8" role="region" aria-label="Training Interface">

            {/* Mobile: Compact stats bar at top */}
            <div className="lg:hidden matrix-glass rounded-xl p-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="font-matrix text-emotion-joy text-lg">{accuracy}%</div>
                  <div className="text-[10px] text-muted-foreground">{t.accuracy}</div>
                </div>
                <div className="w-px h-8 bg-matrix-accent/20" />
                <div className="text-center">
                  <div className="font-matrix text-emotion-neutral">{score.correct}/{score.total}</div>
                  <div className="text-[10px] text-muted-foreground">{t.correct}</div>
                </div>
              </div>
              {totalImages > 0 && (
                <div className="text-right text-[10px] text-muted-foreground">
                  <span className="font-matrix text-matrix-secondary">{remainingImages}</span>
                  {' '}{t.imagesRemaining}
                </div>
              )}
            </div>

            {/* Neural Stats Panel - Left Side (hidden on mobile) */}
            <div className="hidden lg:block lg:col-span-1 xl:col-span-3 space-y-6">
              {/* Performance Metrics */}
              <div className="matrix-glass rounded-2xl p-6 matrix-interactive">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-matrix-accent rounded-lg flex items-center justify-center matrix-glow">
                    <BarChart3 className="w-5 h-5 text-matrix-bg" />
                  </div>
                  <h2 className="font-matrix-semibold text-matrix-accent text-heading-lg">{t.neuralPerformance}</h2>
                </div>

                <div className="space-y-4">
                  <div className="emotion-bg-joy rounded-xl p-4 border border-emotion-joy/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">{t.accuracy}</span>
                      <span className="font-matrix text-emotion-joy text-lg">{accuracy}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emotion-joy h-2 rounded-full transition-all duration-1000 data-stream"
                        style={{ width: `${accuracy}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="emotion-bg-neutral rounded-lg p-3 text-center">
                      <div className="font-matrix text-emotion-neutral text-2xl mb-1">{score.correct}</div>
                      <div className="text-xs text-muted-foreground">{t.correct}</div>
                    </div>
                    <div className="emotion-bg-sadness rounded-lg p-3 text-center">
                      <div className="font-matrix text-emotion-sadness text-2xl mb-1">{score.total}</div>
                      <div className="text-xs text-muted-foreground">{t.total}</div>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  {totalImages > 0 && (
                    <div className="mt-4 text-center text-xs text-muted-foreground">
                      <span className="font-matrix text-matrix-secondary">{remainingImages}</span>
                      {' '}{t.imagesRemaining}
                    </div>
                  )}
                </div>
              </div>

              {/* Emotion Accuracy - shows real stats */}
              <div className="matrix-glass rounded-2xl p-6">
                <h3 className="font-matrix text-matrix-accent text-lg mb-4">{t.emotionSpectrum}</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {EMOTIONS.map((emotion, index) => {
                    const acc = getEmotionAccuracy(emotion);
                    const stats = emotionStats[emotion];
                    const isWeak = stats.total >= 3 && acc < 70;
                    return (
                      <div key={emotion} className="flex items-center gap-2" style={{ animationDelay: `${index * 0.05}s` }}>
                        <span className="text-sm">{getEmotionEmoji(emotion)}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isWeak ? 'bg-emotion-anger' : acc >= 70 ? 'bg-emotion-joy' : 'bg-matrix-accent'}`}
                            style={{ width: `${acc}%` }}
                          />
                        </div>
                        <div className={`text-xs font-matrix min-w-[32px] text-right ${isWeak ? 'text-emotion-anger' : 'text-matrix-secondary'}`}>
                          {stats.total > 0 ? `${acc}%` : '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Training Mode Toggle */}
              <div className="matrix-glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-matrix-accent" />
                  <h3 className="font-matrix text-matrix-accent text-sm">{t.trainingMode}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={trainingMode === 'normal' ? 'default' : 'outline'}
                    onClick={() => {
                      setTrainingMode('normal');
                      fetchEmotionImages().then(imgs => initializeQueue(imgs, 'normal'));
                    }}
                    className={`flex-1 text-xs ${trainingMode === 'normal' ? 'bg-matrix-accent text-matrix-bg' : ''}`}
                  >
                    {t.normalMode}
                  </Button>
                  <Button
                    size="sm"
                    variant={trainingMode === 'weak' ? 'default' : 'outline'}
                    onClick={() => {
                      setTrainingMode('weak');
                      fetchEmotionImages().then(imgs => initializeQueue(imgs, 'weak'));
                    }}
                    className={`flex-1 text-xs ${trainingMode === 'weak' ? 'bg-emotion-anger text-white' : ''}`}
                  >
                    {t.weakMode}
                  </Button>
                </div>
                {trainingMode === 'weak' && getWeakEmotions().length > 0 && (
                  <div className="mt-2 text-[10px] text-muted-foreground">
                    {getWeakEmotions().map(e => getEmotionEmoji(e)).join(' ')}
                  </div>
                )}
              </div>

              {/* Confusion Matrix & Reset Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowConfusionMatrix(true)}
                  className="flex-1 text-xs"
                >
                  <Grid3X3 className="w-3 h-3 mr-1" />
                  {t.showMatrix}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm(t.resetConfirm)) resetStats();
                  }}
                  className="text-xs text-emotion-anger hover:bg-emotion-anger/10"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Main Analysis Area - Center */}
            <div className="lg:col-span-1 xl:col-span-6 order-first lg:order-none">
              <div className="matrix-glass rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 matrix-interactive">
                {/* Header - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-4 mb-6 lg:mb-8">
                  <div className="w-12 h-12 bg-matrix-secondary rounded-xl flex items-center justify-center matrix-glow">
                    <Microscope className="w-6 h-6 text-matrix-bg" />
                  </div>
                  <div>
                    <h3 className="font-matrix-semibold text-matrix-accent text-heading-xl">{t.neuralAnalysis}</h3>
                    <p className="text-muted-foreground text-body">{t.processingFacial}</p>
                  </div>
                </div>

                <div className="flex justify-center mb-3 sm:mb-6">
                  {currentImage ? (
                    <div className="relative group w-full">
                      {/* Emotion-specific glow border */}
                      <div className={`absolute -inset-1 sm:-inset-2 rounded-xl sm:rounded-2xl opacity-50 blur-xl emotion-bg-${currentImage.emotion} animate-matrix-glow`} />

                      <div className="relative">
                        <img
                          src={currentImage.path}
                          alt={`Neural scan: ${getEmotionTranslation(currentImage.emotion)}`}
                          className="w-full h-48 sm:h-64 md:h-80 object-contain rounded-lg sm:rounded-xl border-2 border-matrix-accent/30 matrix-interactive"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />

                        {/* Fallback UI */}
                        <div className="absolute inset-0 matrix-glass rounded-lg sm:rounded-xl flex items-center justify-center hidden">
                          <div className="text-center">
                            <div className={`text-4xl sm:text-6xl mb-2 sm:mb-4 animate-matrix-pulse emotion-text-${currentImage.emotion}`}>
                              {getEmotionEmoji(currentImage.emotion)}
                            </div>
                            <div className="font-matrix text-matrix-accent text-sm sm:text-lg mb-1 sm:mb-2 uppercase tracking-wider">
                              {getEmotionTranslation(currentImage.emotion)}
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm">
                              {t.neuralProcessing}
                            </div>
                          </div>
                        </div>

                        {/* Analysis result overlay */}
                        {showResult && (
                          <div className={`absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-matrix text-xs sm:text-sm matrix-glass border ${
                            isCorrect
                              ? 'border-emotion-joy/50 text-emotion-joy'
                              : 'border-emotion-anger/50 text-emotion-anger'
                          } animate-matrix-pulse`}>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span>{isCorrect ? '✓' : '✗'}</span>
                              <span className="uppercase tracking-wider">
                                {isCorrect ? t.confirmed : t.error}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Neural scan lines - hidden on mobile */}
                        <div className="hidden sm:block absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-matrix-accent to-transparent animate-matrix-scan opacity-30" />
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-matrix-accent to-transparent animate-matrix-scan opacity-30" style={{ animationDelay: '0.5s' }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 sm:h-64 md:h-80 matrix-glass rounded-lg sm:rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 animate-matrix-pulse text-matrix-accent flex items-center justify-center">
                          <Brain className="w-10 h-10 sm:w-16 sm:h-16" />
                        </div>
                        <div className="font-matrix text-matrix-accent text-base sm:text-xl mb-1 sm:mb-2 uppercase tracking-wider">
                          {t.initializing}
                        </div>
                        <div className="text-muted-foreground text-xs sm:text-base">
                          {t.loadingDatabase}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis feedback - compact on mobile */}
                {showResult && (
                  <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border sm:border-2 matrix-glass ${
                    isCorrect
                      ? 'border-emotion-joy/30 bg-emotion-joy/5'
                      : 'border-emotion-anger/30 bg-emotion-anger/5'
                  }`}>
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <span className={`text-lg sm:text-2xl ${isCorrect ? 'emotion-text-joy' : 'emotion-text-anger'}`}>
                        {isCorrect ? '🎯' : '⚠️'}
                      </span>
                      <h3 className="font-matrix text-sm sm:text-lg uppercase tracking-wider">
                        {isCorrect ? t.neuralMatch : t.analysisError}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t.detectedEmotion}: <span className={`font-matrix uppercase emotion-text-${currentImage?.emotion}`}>
                        {currentImage ? getEmotionTranslation(currentImage.emotion) : ''}
                      </span>
                      {selectedEmotion && !isCorrect && (
                        <span> ({t.predicted}: <span className="emotion-text-anger">{getEmotionTranslation(selectedEmotion)}</span>)</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Emotion Selection Matrix - Right Side */}
            <div className="lg:col-span-1 xl:col-span-3">
              <div className="matrix-glass rounded-xl sm:rounded-2xl p-3 sm:p-6">
                {/* Header - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-matrix-accent rounded-lg flex items-center justify-center matrix-glow">
                    <Theater className="w-5 h-5 text-matrix-bg" />
                  </div>
                  <h3 className="font-matrix-semibold text-matrix-accent text-heading-xl">{t.emotionMatrix}</h3>
                </div>

                {/* Mobile: 5 columns, Desktop: 2 columns */}
                <div className="grid grid-cols-5 sm:grid-cols-2 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
                  {EMOTIONS.map((emotion, index) => (
                    <Button
                      key={emotion}
                      onClick={() => checkAnswer(emotion)}
                      disabled={showResult}
                      variant="ghost"
                      aria-label={`Select ${getEmotionTranslation(emotion)} emotion`}
                      aria-pressed={selectedEmotion === emotion}
                      className={`h-12 sm:h-16 rounded-lg border sm:border-2 transition-all duration-300 matrix-interactive disabled:opacity-50 disabled:cursor-not-allowed font-matrix text-[9px] sm:text-xs uppercase tracking-wider focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-matrix-accent focus:ring-offset-1 sm:focus:ring-offset-2 focus:ring-offset-matrix-bg px-1 sm:px-4 ${
                        showResult && emotion === currentImage?.emotion
                          ? `bg-emotion-${emotion}/20 border-emotion-${emotion} emotion-text-${emotion} matrix-glow animate-matrix-pulse`
                          : showResult && emotion === selectedEmotion && !isCorrect
                          ? 'bg-emotion-anger/20 border-emotion-anger text-emotion-anger'
                          : `matrix-glass border-matrix-accent/20 text-foreground/80 hover:border-matrix-accent/50 hover:bg-matrix-accent/10 hover:text-matrix-accent`
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                        <span className="text-base sm:text-lg">{getEmotionEmoji(emotion)}</span>
                        <span className="hidden sm:inline">{getEmotionTranslation(emotion)}</span>
                      </div>
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={() => loadNextImage()}
                  className="matrix-primary-action matrix-glow w-full h-10 rounded-lg border font-matrix text-xs transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-matrix-secondary focus:ring-offset-2 focus:ring-offset-matrix-bg sm:h-12 sm:text-sm"
                  aria-label="Load next emotion image for analysis"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{t.nextScan}</span>
                </Button>
              </div>

              {/* Data streams visualization - hidden on mobile */}
              <div className="hidden sm:block mt-6 matrix-glass rounded-2xl p-4">
                <h4 className="font-matrix text-matrix-secondary text-sm mb-3 uppercase tracking-wider">{t.neuralActivity}</h4>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-matrix-accent rounded-full animate-matrix-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-matrix-accent to-matrix-secondary animate-matrix-scan"
                          style={{ animationDelay: `${i * 0.5}s`, animationDuration: '2s' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - simplified on mobile */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 sm:gap-6 matrix-glass rounded-xl sm:rounded-2xl px-3 sm:px-8 py-2 sm:py-4 border border-matrix-accent/20">
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-matrix-accent" />
                <span className="font-matrix text-[10px] sm:text-sm uppercase tracking-wider">{t.neuralNetwork}</span>
              </div>
              <div className="w-px h-4 sm:h-6 bg-matrix-accent/30"></div>
              <div className="hidden sm:block text-xs text-muted-foreground font-medium">
                {t.poweredBy}
              </div>
              <div className="hidden sm:block w-px h-6 bg-matrix-accent/30"></div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-matrix-secondary" />
                <span className="font-matrix text-[10px] sm:text-sm uppercase tracking-wider">{t.secure}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confusion Matrix Modal */}
        {showConfusionMatrix && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="matrix-glass rounded-2xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-matrix text-matrix-accent text-lg sm:text-xl">{t.confusionMatrix}</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowConfusionMatrix(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Matrix Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="p-1 sm:p-2 text-left text-muted-foreground font-matrix text-[10px] sm:text-xs">
                        {t.actualEmotion} ↓ / {t.predictedEmotion} →
                      </th>
                      {EMOTIONS.map(emotion => (
                        <th key={emotion} className="p-1 sm:p-2 text-center" title={getEmotionTranslation(emotion)}>
                          <span className="text-base sm:text-lg">{getEmotionEmoji(emotion)}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EMOTIONS.map(actual => {
                      const rowTotal = Object.values(confusionMatrix[actual] || {}).reduce((a, b) => a + b, 0);
                      return (
                        <tr key={actual} className="border-t border-matrix-accent/10">
                          <td className="p-1 sm:p-2 font-matrix text-muted-foreground" title={getEmotionTranslation(actual)}>
                            <span className="text-base sm:text-lg mr-1 sm:mr-2">{getEmotionEmoji(actual)}</span>
                            <span className="hidden sm:inline text-xs">{getEmotionTranslation(actual)}</span>
                          </td>
                          {EMOTIONS.map(predicted => {
                            const count = confusionMatrix[actual]?.[predicted] || 0;
                            const isCorrect = actual === predicted;
                            const intensity = rowTotal > 0 ? count / rowTotal : 0;
                            return (
                              <td
                                key={predicted}
                                className={`p-1 sm:p-2 text-center font-matrix transition-colors ${
                                  count === 0
                                    ? 'text-muted-foreground/30'
                                    : isCorrect
                                    ? 'text-emotion-joy'
                                    : 'text-emotion-anger'
                                }`}
                                style={{
                                  backgroundColor: count > 0
                                    ? isCorrect
                                      ? `rgba(34, 197, 94, ${intensity * 0.3})`
                                      : `rgba(239, 68, 68, ${intensity * 0.3})`
                                    : 'transparent'
                                }}
                              >
                                {count || '-'}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emotion-joy/30" />
                  <span>{t.confirmed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emotion-anger/30" />
                  <span>{t.error}</span>
                </div>
              </div>

              <Button
                onClick={() => setShowConfusionMatrix(false)}
                className="mt-4 w-full bg-matrix-accent hover:bg-matrix-accent/80 text-matrix-bg"
              >
                {t.closeMatrix}
              </Button>
            </div>
          </div>
        )}
      </div>
    </MatrixBackground>
  );
};

export default EmotionTrainer;
