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

import React, { useState, useEffect } from "react";
import { fetchEmotionImages, type EmotionImage } from "../api/images";
import MatrixBackground from "./MatrixBackground";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSelector } from "./LanguageSelector";
import { DevToolsToggle } from "./devtools-toggle";
import { useLanguage } from "../i18n/LanguageProvider";
import { Button } from "./ui/button";
import {
  Brain,
  Zap,
  BarChart3,
  Microscope,
  Theater,
  RefreshCw,
  Shield,
  RotateCcw,
  ListFilter,
  Target,
} from "lucide-react";

// All 39 emotions from dataset
const ALL_EMOTIONS = [
  "amusement",
  "anger",
  "anxiety",
  "awe",
  "callousness",
  "confusion",
  "contempt",
  "deceit",
  "despair",
  "determination",
  "disappointment",
  "disgust",
  "embarrassment",
  "envy",
  "excitement",
  "fear",
  "fearlessness",
  "frustration",
  "guilt",
  "hatred",
  "interest",
  "jealousy",
  "joy",
  "loneliness",
  "manipulative",
  "narcissism",
  "neutral",
  "predatory",
  "pride",
  "regret",
  "relief",
  "remorselessness",
  "resentment",
  "sadness",
  "shallow_affect",
  "shame",
  "sociopathy",
  "surprise",
  "suspicion",
] as const;

type EmotionKey = (typeof ALL_EMOTIONS)[number];

// Emotion presets
type EmotionPreset = "all" | "basic" | "extended" | "advanced" | "custom";

const EMOTION_PRESETS: Record<EmotionPreset, readonly EmotionKey[]> = {
  all: ALL_EMOTIONS,
  basic: [
    "joy",
    "sadness",
    "anger",
    "fear",
    "surprise",
    "disgust",
    "guilt",
    "shame",
    "suspicion",
    "neutral",
  ] as const,
  extended: [
    "joy",
    "sadness",
    "anger",
    "fear",
    "surprise",
    "disgust",
    "guilt",
    "shame",
    "suspicion",
    "neutral",
    "amusement",
    "excitement",
    "pride",
    "relief",
    "anxiety",
    "confusion",
    "contempt",
    "embarrassment",
    "envy",
    "frustration",
  ] as const,
  advanced: [
    "joy",
    "sadness",
    "anger",
    "fear",
    "surprise",
    "disgust",
    "guilt",
    "shame",
    "suspicion",
    "neutral",
    "amusement",
    "excitement",
    "pride",
    "relief",
    "anxiety",
    "confusion",
    "contempt",
    "embarrassment",
    "envy",
    "frustration",
    "disappointment",
    "regret",
    "interest",
    "determination",
    "loneliness",
    "jealousy",
  ] as const,
  custom: ALL_EMOTIONS,
};

// Mapping preset keys to translation keys
const PRESET_LABEL_KEYS: Record<EmotionPreset, string> = {
  all: "presetAll",
  basic: "presetBasic",
  extended: "presetExtended",
  advanced: "presetAdvanced",
  custom: "presetCustom",
};

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Types
type ConfusionMatrix = { [actual: string]: { [predicted: string]: number } };
type EmotionStats = { [emotion: string]: { correct: number; total: number } };

// Storage keys
const STORAGE_KEYS = {
  score: "emotion-trainer-score",
  confusionMatrix: "emotion-trainer-confusion",
  emotionStats: "emotion-trainer-emotion-stats",
  trainingMode: "emotion-trainer-training-mode",
  emotionPreset: "emotion-trainer-preset",
};

// Initialize empty data
const createEmptyConfusionMatrix = (): ConfusionMatrix => {
  const matrix: ConfusionMatrix = {};
  ALL_EMOTIONS.forEach((actual) => {
    matrix[actual] = {};
    ALL_EMOTIONS.forEach((predicted) => {
      matrix[actual][predicted] = 0;
    });
  });
  return matrix;
};

const createEmptyEmotionStats = (): EmotionStats => {
  const stats: EmotionStats = {};
  ALL_EMOTIONS.forEach((emotion) => {
    stats[emotion] = { correct: 0, total: 0 };
  });
  return stats;
};

const EmotionTrainer: React.FC = () => {
  const { t } = useLanguage();

  // State
  const [currentImage, setCurrentImage] = useState<EmotionImage | null>(null);
  const [imageQueue, setImageQueue] = useState<EmotionImage[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [score, setScore] = useState<{ correct: number; total: number }>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.score);
    return stored ? JSON.parse(stored) : { correct: 0, total: 0 };
  });
  const [showResult, setShowResult] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [confusionMatrix, setConfusionMatrix] = useState<ConfusionMatrix>(
    () => {
      const stored = localStorage.getItem(STORAGE_KEYS.confusionMatrix);
      return stored ? JSON.parse(stored) : createEmptyConfusionMatrix();
    },
  );
  const [emotionStats, setEmotionStats] = useState<EmotionStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.emotionStats);
    return stored ? JSON.parse(stored) : createEmptyEmotionStats();
  });
  const [trainingMode, setTrainingMode] = useState<"normal" | "weak">(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.trainingMode);
    return (stored as "normal" | "weak") || "normal";
  });
  const [emotionPreset, setEmotionPreset] = useState<EmotionPreset>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.emotionPreset);
    return (stored as EmotionPreset) || "all";
  });

  // Helpers
  const getActiveEmotions = (): readonly EmotionKey[] =>
    EMOTION_PRESETS[emotionPreset];

  const filterImagesByPreset = (images: EmotionImage[]): EmotionImage[] => {
    if (emotionPreset === "all") return images;
    const activeSet = new Set(getActiveEmotions());
    return images.filter((img) => activeSet.has(img.emotion as EmotionKey));
  };

  const getEmotionTranslation = (emotion: string): string => {
    return (t.emotions as Record<string, string>)[emotion] || emotion;
  };

  const getEmotionAccuracy = (emotion: string): number => {
    const stats = emotionStats[emotion];
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.correct / stats.total) * 100);
  };

  const getWeakEmotions = (): string[] => {
    return ALL_EMOTIONS.filter((emotion) => {
      const stats = emotionStats[emotion];
      if (!stats || stats.total < 3) return false;
      const accuracy = (stats.correct / stats.total) * 100;
      return accuracy < 70;
    });
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: Record<string, string> = {
      joy: "😊",
      amusement: "😄",
      excitement: "🤩",
      pride: "😁",
      relief: "😅",
      sadness: "😢",
      despair: "😩",
      disappointment: "😞",
      regret: "😔",
      guilt: "😔",
      shame: "😳",
      embarrassment: "😳",
      loneliness: "😔",
      anger: "😠",
      hatred: "👿",
      frustration: "😤",
      resentment: "😒",
      contempt: "😏",
      determination: "😠",
      fear: "😨",
      anxiety: "😰",
      fearlessness: "😏",
      neutral: "😐",
      suspicion: "🤨",
      surprise: "😲",
      awe: "🤩",
      confusion: "😕",
      interest: "🤔",
      disgust: "🤢",
      deceit: "😈",
      manipulative: "😈",
      narcissism: "😏",
      callousness: "😶",
      remorselessness: "😶",
      shallow_affect: "😑",
      sociopathy: "😈",
      predatory: "👁️",
      envy: "😒",
      jealousy: "😒",
    };
    return emojiMap[emotion] || "❓";
  };

  const remainingImages = imageQueue.length - queueIndex;
  const accuracy =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const activeEmotions = getActiveEmotions();

  // Initialize queue
  const initializeQueue = (
    imageList: EmotionImage[],
    mode: "normal" | "weak" = trainingMode,
  ) => {
    let filteredList = imageList;

    if (mode === "weak") {
      const weakEmotions = getWeakEmotions();
      if (weakEmotions.length > 0) {
        filteredList = imageList.filter((img) =>
          weakEmotions.includes(img.emotion),
        );
        console.log(
          `Training mode: focusing on ${weakEmotions.length} weak emotions (${weakEmotions.join(", ")})`,
        );
      }
    } else {
      filteredList = filterImagesByPreset(imageList);
      console.log(
        `Normal mode: using preset "${emotionPreset}" with ${filteredList.length} images`,
      );
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

  const loadNextImage = () => {
    const nextIndex = queueIndex + 1;
    if (nextIndex >= imageQueue.length) {
      const reshuffled = shuffleArray(imageQueue);
      setImageQueue(reshuffled);
      setQueueIndex(0);
      setCurrentImage(reshuffled[0]);
    } else {
      setQueueIndex(nextIndex);
      setCurrentImage(imageQueue[nextIndex]);
    }
    setShowResult(false);
    setSelectedEmotion("");
  };

  // Sound
  const playEmotionSound = (emotion: string, isCorrect: boolean) => {
    try {
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const frequencies: Record<string, number> = {
        joy: 523,
        excitement: 587,
        pride: 659,
        relief: 698,
        sadness: 294,
        despair: 262,
        disappointment: 293,
        regret: 330,
        guilt: 247,
        shame: 220,
        embarrassment: 246,
        loneliness: 262,
        anger: 175,
        hatred: 164,
        frustration: 196,
        resentment: 185,
        contempt: 174,
        determination: 174,
        fear: 220,
        anxiety: 208,
        fearlessness: 233,
        neutral: 440,
        suspicion: 330,
        surprise: 784,
        awe: 622,
        confusion: 277,
        interest: 392,
        disgust: 131,
        deceit: 123,
        manipulative: 116,
        narcissism: 138,
        callousness: 110,
        remorselessness: 103,
        shallow_affect: 97,
        sociopathy: 92,
        predatory: 82,
        envy: 155,
        jealousy: 146,
      };

      oscillator.frequency.setValueAtTime(
        frequencies[emotion] || 440,
        audioContext.currentTime,
      );

      if (isCorrect) {
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5,
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          (frequencies[emotion] || 440) * 2,
          audioContext.currentTime + 0.5,
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else {
        oscillator.type = "sawtooth";
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3,
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          (frequencies[emotion] || 440) * 0.5,
          audioContext.currentTime + 0.3,
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const resetStats = () => {
    setScore({ correct: 0, total: 0 });
    setConfusionMatrix(createEmptyConfusionMatrix());
    setEmotionStats(createEmptyEmotionStats());
  };

  // Load images on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageList = await fetchEmotionImages();
        if (imageList.length > 0) {
          initializeQueue(imageList, trainingMode);
        }
        console.log(`Loaded ${imageList.length} emotion images from dataset`);
      } catch (error) {
        console.error("Error loading images:", error);
        const mockImages: EmotionImage[] = ALL_EMOTIONS.flatMap((emotion) =>
          Array.from({ length: 5 }, (_, i) => ({
            path: `/images/generated_images_v2_g/${emotion}/sample_${i}.png`,
            emotion: emotion,
            filename: `sample_${i}.png`,
          })),
        );
        initializeQueue(mockImages, trainingMode);
        console.log("Using mock data due to API unavailability");
      }
    };
    loadImages();
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.score, JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.confusionMatrix,
      JSON.stringify(confusionMatrix),
    );
  }, [confusionMatrix]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.emotionStats,
      JSON.stringify(emotionStats),
    );
  }, [emotionStats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.trainingMode, trainingMode);
  }, [trainingMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.emotionPreset, emotionPreset);
  }, [emotionPreset]);

  // Reload queue when preset changes
  useEffect(() => {
    fetchEmotionImages().then((images) => {
      initializeQueue(filterImagesByPreset(images), trainingMode);
    });
  }, [emotionPreset]);

  // Reload queue when training mode changes
  useEffect(() => {
    fetchEmotionImages().then((images) => {
      initializeQueue(images, trainingMode);
    });
  }, [trainingMode]);

  const checkAnswer = (emotion: string) => {
    if (!currentImage) return;

    const actualEmotion = currentImage.emotion;
    setSelectedEmotion(emotion);
    setShowResult(true);

    if (!getActiveEmotions().includes(emotion as EmotionKey)) return;

    const correct = emotion === actualEmotion;
    setIsCorrect(correct);

    playEmotionSound(emotion, correct);

    setScore((prev: { correct: number; total: number }) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    setConfusionMatrix((prev: ConfusionMatrix) => ({
      ...prev,
      [actualEmotion]: {
        ...(prev[actualEmotion] || {}),
        [emotion]: (prev[actualEmotion]?.[emotion] || 0) + 1,
      },
    }));

    setEmotionStats((prev: EmotionStats) => ({
      ...prev,
      [actualEmotion]: {
        correct: (prev[actualEmotion]?.correct || 0) + (correct ? 1 : 0),
        total: (prev[actualEmotion]?.total || 0) + 1,
      },
    }));

    setTimeout(() => {
      loadNextImage();
    }, 2000);
  };

  // Render
  return (
    <MatrixBackground>
      <div className="p-2 sm:p-4 matrix-grid">
          <div
            className="max-w-8xl mx-auto relative"
            role="main"
            aria-label={t.ariaLabelDashboard}
          >
          {/* Compact Mobile Header */}
          <div className="mb-6 text-center sm:mb-10">
            <div className="inline-flex items-center gap-2 sm:gap-4 matrix-glass rounded-xl sm:rounded-2xl px-4 sm:px-8 py-2 sm:py-4 mb-3 sm:mb-4 animate-matrix-float matrix-border">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-matrix-accent rounded-lg sm:rounded-xl flex items-center justify-center matrix-glow animate-matrix-pulse">
                <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-matrix-bg" />
              </div>
              <div className="font-matrix-display text-matrix-accent text-sm sm:text-lg tracking-wider">
                {t.appTitle}
              </div>
              <div
                className="w-8 h-8 sm:w-12 sm:h-12 bg-matrix-secondary rounded-lg sm:rounded-xl flex items-center justify-center matrix-glow animate-matrix-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-matrix-bg" />
              </div>
            </div>

            <div className="matrix-hero-shell">
              <h1
                className="matrix-hero-title hidden sm:block font-matrix-display text-display-lg mb-4 tracking-wider animate-matrix-glow"
                aria-label={t.ariaLabelNeuralScanner}
              >
                {t.title}
                <br />
                <span className="matrix-hero-accent">{t.titleAccent}</span>
                <br />
                {t.titleEnd}
              </h1>
              <p className="matrix-hero-subtitle hidden sm:block text-body-lg max-w-3xl mx-auto leading-relaxed font-medium mb-6">
                {t.subtitle}
                <br />
                {t.subtitleLine2}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <Button
                variant="secondary"
                size="sm"
                className="matrix-primary-action px-3 font-matrix text-xs uppercase tracking-wider sm:px-4 sm:text-sm"
              >
                <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t.matrixReady}</span>
              </Button>
              <ThemeToggle />
              <DevToolsToggle />
              <LanguageSelector />
            </div>
          </div>

          {/* Responsive Grid Layout */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 mb-4 sm:mb-8"
            role="region"
            aria-label={t.ariaLabelTrainingInterface}
          >
            {/* Mobile: Compact stats bar */}
            <div className="lg:hidden matrix-glass rounded-xl p-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="font-matrix text-emotion-joy text-lg">
                    {accuracy}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {t.accuracy}
                  </div>
                </div>
                <div className="w-px h-8 bg-matrix-accent/20" />
                <div className="text-center">
                  <div className="font-matrix text-emotion-neutral">
                    {score.correct}/{score.total}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {t.correct}
                  </div>
                </div>
              </div>
              {totalImages > 0 && (
                <div className="text-right text-[10px] text-muted-foreground">
                  <span className="font-matrix text-matrix-secondary">
                    {remainingImages}
                  </span>{" "}
                  {t.imagesRemaining}
                </div>
              )}
            </div>

            {/* Left Panel - Stats & Controls */}
            <div className="hidden lg:block lg:col-span-1 xl:col-span-3 space-y-6">
              {/* Performance Metrics */}
              <div className="matrix-glass rounded-2xl p-6 matrix-interactive">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-matrix-accent rounded-lg flex items-center justify-center matrix-glow">
                    <BarChart3 className="w-5 h-5 text-matrix-bg" />
                  </div>
                  <h2 className="font-matrix-semibold text-matrix-accent text-heading-lg">
                    {t.neuralPerformance}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="emotion-bg-joy rounded-xl p-4 border border-emotion-joy/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        {t.accuracy}
                      </span>
                      <span className="font-matrix text-emotion-joy text-lg">
                        {accuracy}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emotion-joy h-2 rounded-full transition-all duration-1000 data-stream"
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="emotion-bg-neutral rounded-lg p-3 text-center">
                      <div className="font-matrix text-emotion-neutral text-2xl mb-1">
                        {score.correct}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.correct}
                      </div>
                    </div>
                    <div className="emotion-bg-sadness rounded-lg p-3 text-center">
                      <div className="font-matrix text-emotion-sadness text-2xl mb-1">
                        {score.total}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.total}
                      </div>
                    </div>
                  </div>
                  {totalImages > 0 && (
                    <div className="mt-4 text-center text-xs text-muted-foreground">
                      <span className="font-matrix text-matrix-secondary">
                        {remainingImages}
                      </span>{" "}
                      {t.imagesRemaining}
                    </div>
                  )}
                </div>
              </div>

              {/* Emotion Preset Selector */}
              <div className="matrix-glass rounded-2xl p-4">
                 <div className="flex items-center gap-2 mb-3">
                   <ListFilter className="w-4 h-4 text-matrix-accent" />
                   <h3 className="font-matrix text-matrix-accent text-sm">
                     {t.emotionPreset}
                   </h3>
                 </div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(EMOTION_PRESETS) as EmotionPreset[]).map(
                    (preset) => (
                       <Button
                         key={preset}
                         size="sm"
                         variant={
                           emotionPreset === preset ? "default" : "outline"
                         }
                         onClick={() => setEmotionPreset(preset)}
                         className={`text-xs ${emotionPreset === preset ? "bg-matrix-accent text-matrix-bg" : ""}`}
                       >
                         {t[PRESET_LABEL_KEYS[preset] as keyof typeof t] as React.ReactNode}
                       </Button>
                    ),
                  )}
                </div>
                {emotionPreset !== "all" && (
                  <div className="mt-2 text-[10px] text-muted-foreground">
                    {t.activeEmotionsCount.replace('{count}', activeEmotions.length.toString())}
                  </div>
                )}
              </div>

              {/* Emotion Spectrum */}
              <div className="matrix-glass rounded-2xl p-6">
                <h3 className="font-matrix text-matrix-accent text-lg mb-4">
                  {t.emotionSpectrum}
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {ALL_EMOTIONS.map((emotion, index) => {
                    const acc = getEmotionAccuracy(emotion);
                    const stats = emotionStats[emotion];
                    const isWeak = stats && stats.total >= 3 && acc < 70;
                    const isActive = activeEmotions.includes(emotion);
                    return (
                      <div
                        key={emotion}
                        className={`flex items-center gap-2 ${!isActive ? "opacity-40" : ""}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <span className="text-sm">
                          {getEmotionEmoji(emotion)}
                        </span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isWeak ? "bg-emotion-anger" : acc >= 70 ? "bg-emotion-joy" : "bg-matrix-accent"}`}
                            style={{ width: `${acc}%` }}
                          />
                        </div>
                        <div
                          className={`text-xs font-matrix min-w-[32px] text-right ${isWeak ? "text-emotion-anger" : "text-matrix-secondary"}`}
                        >
                          {stats && stats.total > 0 ? `${acc}%` : "-"}
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
                  <h3 className="font-matrix text-matrix-accent text-sm">
                    {t.trainingMode}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={trainingMode === "normal" ? "default" : "outline"}
                    onClick={() => {
                      setTrainingMode("normal");
                      fetchEmotionImages().then((imgs) =>
                        initializeQueue(imgs, "normal"),
                      );
                    }}
                    className={`flex-1 text-xs ${trainingMode === "normal" ? "bg-matrix-accent text-matrix-bg" : ""}`}
                  >
                    {t.normalMode}
                  </Button>
                  <Button
                    size="sm"
                    variant={trainingMode === "weak" ? "default" : "outline"}
                    onClick={() => {
                      setTrainingMode("weak");
                      fetchEmotionImages().then((imgs) =>
                        initializeQueue(imgs, "weak"),
                      );
                    }}
                    className={`flex-1 text-xs ${trainingMode === "weak" ? "bg-emotion-anger text-white" : ""}`}
                  >
                    {t.weakMode}
                  </Button>
                </div>
                {trainingMode === "weak" && getWeakEmotions().length > 0 && (
                  <div className="mt-2 text-[10px] text-muted-foreground">
                    {getWeakEmotions()
                      .map((e) => getEmotionEmoji(e))
                      .join(" ")}
                  </div>
                )}
              </div>

              {/* Reset Stats */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm(t.resetConfirm)) resetStats();
                  }}
                  className="flex-1 text-xs text-emotion-anger hover:bg-emotion-anger/10"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  {t.resetStats}
                </Button>
              </div>

              {/* Matrix & Reset */}
              <div className="flex gap-2">
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
                <div className="hidden sm:flex items-center gap-4 mb-6 lg:mb-8">
                  <div className="w-12 h-12 bg-matrix-secondary rounded-xl flex items-center justify-center matrix-glow">
                    <Microscope className="w-6 h-6 text-matrix-bg" />
                  </div>
                  <div>
                    <h3 className="font-matrix-semibold text-matrix-accent text-heading-xl">
                      {t.neuralAnalysis}
                    </h3>
                    <p className="text-muted-foreground text-body">
                      {t.processingFacial}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mb-3 sm:mb-6">
                  {currentImage ? (
                    <div className="relative group w-full">
                      <div
                        className={`absolute -inset-1 sm:-inset-2 rounded-xl sm:rounded-2xl opacity-50 blur-xl emotion-bg-${currentImage.emotion} animate-matrix-glow`}
                      />
                      <div className="relative">
                        <img
                          src={currentImage.path}
                          alt={`Neural scan: ${getEmotionTranslation(currentImage.emotion)}`}
                          className="w-full h-48 sm:h-64 md:h-80 object-contain rounded-lg sm:rounded-xl border-2 border-matrix-accent/30 matrix-interactive"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                            const fallback = (e.target as HTMLElement)
                              .nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        {/* Fallback UI */}
                        <div className="absolute inset-0 matrix-glass rounded-lg sm:rounded-xl flex items-center justify-center hidden">
                          <div className="text-center">
                            <div
                              className={`text-4xl sm:text-6xl mb-2 sm:mb-4 animate-matrix-pulse emotion-text-${currentImage.emotion}`}
                            >
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
                        {/* Result overlay */}
                        {showResult && (
                          <div
                            className={`absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-matrix text-xs sm:text-sm matrix-glass border ${
                              isCorrect
                                ? "border-emotion-joy/50 text-emotion-joy"
                                : "border-emotion-anger/50 text-emotion-anger"
                            } animate-matrix-pulse`}
                          >
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span>{isCorrect ? "✓" : "✗"}</span>
                              <span className="uppercase tracking-wider">
                                {isCorrect ? t.confirmed : t.error}
                              </span>
                            </div>
                          </div>
                        )}
                        {/* Scan lines */}
                        <div className="hidden sm:block absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-matrix-accent to-transparent animate-matrix-scan opacity-30" />
                          <div
                            className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-matrix-accent to-transparent animate-matrix-scan opacity-30"
                            style={{ animationDelay: "0.5s" }}
                          />
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

                {showResult && (
                  <div
                    className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border sm:border-2 matrix-glass ${
                      isCorrect
                        ? "border-emotion-joy/30 bg-emotion-joy/5"
                        : "border-emotion-anger/30 bg-emotion-anger/5"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <span
                        className={`text-lg sm:text-2xl ${isCorrect ? "emotion-text-joy" : "emotion-text-anger"}`}
                      >
                        {isCorrect ? "🎯" : "⚠️"}
                      </span>
                      <h3 className="font-matrix text-sm sm:text-lg uppercase tracking-wider">
                        {isCorrect ? t.neuralMatch : t.analysisError}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t.detectedEmotion}:{" "}
                      <span
                        className={`font-matrix uppercase emotion-text-${currentImage?.emotion}`}
                      >
                        {currentImage
                          ? getEmotionTranslation(currentImage.emotion)
                          : ""}
                      </span>
                      {selectedEmotion && !isCorrect && (
                        <span>
                          {" "}
                          ({t.predicted}:{" "}
                          <span className="emotion-text-anger">
                            {getEmotionTranslation(selectedEmotion)}
                          </span>
                          )
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Emotion Selector */}
            <div className="lg:col-span-1 xl:col-span-3">
              <div className="matrix-glass rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <div className="hidden sm:flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-matrix-accent rounded-lg flex items-center justify-center matrix-glow">
                    <Theater className="w-5 h-5 text-matrix-bg" />
                  </div>
                  <h3 className="font-matrix-semibold text-matrix-accent text-heading-xl">
                    {t.emotionMatrix}
                  </h3>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-2 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
                  {activeEmotions.map((emotion) => (
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
                          : showResult &&
                              emotion === selectedEmotion &&
                              !isCorrect
                            ? "bg-emotion-anger/20 border-emotion-anger emotion-text-anger"
                            : `hover:bg-emotion-${emotion}/10 border-border`
                      }`}
                    >
                      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                        <span className="text-lg sm:text-xl">
                          {getEmotionEmoji(emotion)}
                        </span>
                        <span className="truncate max-w-full">
                          {emotion.substring(0, 3)}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>

                {/* Current emotion display */}
                <div className="matrix-glass rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-muted-foreground text-xs sm:text-sm mb-1">
                    {t.neuralActivity}
                  </div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {currentImage ? (
                      <>
                        <span className="text-2xl sm:text-3xl">
                          {getEmotionEmoji(currentImage.emotion)}
                        </span>
                        <span className="font-matrix text-matrix-accent text-sm sm:text-base uppercase">
                          {getEmotionTranslation(currentImage.emotion)}
                        </span>
                      </>
                     ) : (
                       <span className="font-matrix text-muted-foreground text-xs sm:text-sm">
                         {t.noImage}
                       </span>
                     )}
                  </div>
                </div>

                <Button
                  onClick={loadNextImage}
                  className="w-full mt-3 sm:mt-4 font-matrix text-xs sm:text-sm uppercase tracking-wider"
                  size="sm"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {t.nextScan}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 sm:gap-6 matrix-glass rounded-xl sm:rounded-2xl px-6 sm:px-8 py-3 sm:py-4">
              <div className="flex items-center gap-2">
                <img
                  src="/favicon.png"
                  alt="logo"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="font-matrix text-matrix-secondary text-xs sm:text-sm">
                  {t.neuralNetwork}
                </span>
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                {t.poweredBy}
              </div>
              <div className="flex items-center gap-1 text-emotion-joy">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-matrix text-xs sm:text-sm">
                  {t.secure}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MatrixBackground>
  );
};

export default EmotionTrainer;
