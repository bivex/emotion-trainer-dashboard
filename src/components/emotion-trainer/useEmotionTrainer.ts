import { useState, useEffect, useCallback } from "react";
import { fetchEmotionImages, type EmotionImage } from "../../api/images";
import { useLanguage } from "../../i18n/LanguageProvider";
import {
  ALL_EMOTIONS,
  EmotionKey,
  EmotionPreset,
  EMOTION_PRESETS,
  STORAGE_KEYS,
  ConfusionMatrix,
  EmotionStats,
  createEmptyConfusionMatrix,
  createEmptyEmotionStats,
  shuffleArray,
} from "./types";

export const useEmotionTrainer = () => {
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
  const [revealEmotion, setRevealEmotion] = useState(false);
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
  const getActiveEmotions = useCallback((): readonly EmotionKey[] =>
    EMOTION_PRESETS[emotionPreset], [emotionPreset]);

  const filterImagesByPreset = useCallback((images: EmotionImage[]): EmotionImage[] => {
    if (emotionPreset === "all") return images;
    const activeSet = new Set(getActiveEmotions());
    return images.filter((img) => activeSet.has(img.emotion as EmotionKey));
  }, [emotionPreset, getActiveEmotions]);

  const getEmotionTranslation = useCallback((emotion: string): string => {
    return (t.emotions as Record<string, string>)[emotion] || emotion;
  }, [t.emotions]);

  const getEmotionAccuracy = useCallback((emotion: string): number => {
    const stats = emotionStats[emotion];
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.correct / stats.total) * 100);
  }, [emotionStats]);

  const getWeakEmotions = useCallback((): string[] => {
    return ALL_EMOTIONS.filter((emotion) => {
      const stats = emotionStats[emotion];
      if (!stats || stats.total < 3) return false;
      const accuracy = (stats.correct / stats.total) * 100;
      return accuracy < 70;
    });
  }, [emotionStats]);

  const remainingImages = imageQueue.length - queueIndex;
  const accuracy =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const activeEmotions = getActiveEmotions();

  const initializeQueue = useCallback((
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
      }
    } else {
      filteredList = filterImagesByPreset(imageList);
    }

    const shuffled = shuffleArray(filteredList);
    setImageQueue(shuffled);
    setTotalImages(filteredList.length);
    setQueueIndex(0);
    if (shuffled.length > 0) {
      setCurrentImage(shuffled[0]);
    }
  }, [trainingMode, getWeakEmotions, filterImagesByPreset]);

  const loadNextImage = useCallback(() => {
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
    setRevealEmotion(false);
  }, [imageQueue, queueIndex]);

  const playEmotionSound = useCallback((emotion: string, isCorrect: boolean) => {
    try {
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const frequencies: Record<string, number> = {
        joy: 523, amusement: 587, excitement: 659, pride: 698,
        sadness: 294, despair: 262, disappointment: 293, regret: 330,
        guilt: 247, shame: 220, embarrassment: 246, loneliness: 262,
        anger: 175, hatred: 164, frustration: 196, resentment: 185,
        contempt: 174, determination: 174, fear: 220, anxiety: 208,
        fearlessness: 233, neutral: 440, suspicion: 330, surprise: 784,
        awe: 622, confusion: 277, interest: 392, disgust: 131,
        deceit: 123, manipulative: 116, narcissism: 138, callousness: 110,
        remorselessness: 103, shallow_affect: 97, sociopathy: 92,
        predatory: 82, envy: 155, jealousy: 146,
      };

      oscillator.frequency.setValueAtTime(
        frequencies[emotion] || 440,
        audioContext.currentTime,
      );

      if (isCorrect) {
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime((frequencies[emotion] || 440) * 2, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else {
        oscillator.type = "sawtooth";
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.frequency.exponentialRampToValueAtTime((frequencies[emotion] || 440) * 0.5, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.log("Audio not supported");
    }
  }, []);

  const resetStats = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    setConfusionMatrix(createEmptyConfusionMatrix());
    setEmotionStats(createEmptyEmotionStats());
  }, []);

  const checkAnswer = useCallback((emotion: string) => {
    if (!currentImage) return;

    const actualEmotion = currentImage.emotion;
    setSelectedEmotion(emotion);
    setShowResult(true);

    if (!getActiveEmotions().includes(emotion as EmotionKey)) return;

    const correct = emotion === actualEmotion;
    setIsCorrect(correct);
    playEmotionSound(emotion, correct);

    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    setConfusionMatrix((prev) => ({
      ...prev,
      [actualEmotion]: {
        ...(prev[actualEmotion] || {}),
        [emotion]: (prev[actualEmotion]?.[emotion] || 0) + 1,
      },
    }));

    setEmotionStats((prev) => ({
      ...prev,
      [actualEmotion]: {
        correct: (prev[actualEmotion]?.correct || 0) + (correct ? 1 : 0),
        total: (prev[actualEmotion]?.total || 0) + 1,
      },
    }));

    setTimeout(() => {
      loadNextImage();
    }, 2000);
  }, [currentImage, getActiveEmotions, playEmotionSound, loadNextImage]);

  // Effects
  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageList = await fetchEmotionImages();
        if (imageList.length > 0) {
          initializeQueue(imageList, trainingMode);
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    loadImages();
  }, []); // Initial load only

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.emotionPreset, emotionPreset);
  }, [emotionPreset]);

  // Reload queue when preset or training mode changes
  useEffect(() => {
    fetchEmotionImages().then((images) => {
      initializeQueue(images, trainingMode);
    });
  }, [emotionPreset, trainingMode, initializeQueue]);

  return {
    t,
    currentImage,
    imageQueue,
    queueIndex,
    totalImages,
    score,
    showResult,
    selectedEmotion,
    isCorrect,
    revealEmotion,
    confusionMatrix,
    emotionStats,
    trainingMode,
    emotionPreset,
    accuracy,
    remainingImages,
    activeEmotions,
    setTrainingMode,
    setEmotionPreset,
    setRevealEmotion,
    checkAnswer,
    loadNextImage,
    resetStats,
    getEmotionAccuracy,
    getEmotionTranslation,
    getWeakEmotions,
  };
};
