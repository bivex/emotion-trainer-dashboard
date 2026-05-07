import { EmotionImage } from "../../api/images";

export const ALL_EMOTIONS = [
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

export type EmotionKey = (typeof ALL_EMOTIONS)[number];

export type EmotionPreset =
  | "all" | "basic" | "extended" | "advanced" | "custom"
  | "personality" | "social" | "cognitive" | "affective" | "behavioral"
  | "threat_level1" | "threat_level2" | "threat_level3"
  | "manipulation" | "deception" | "aggression" | "distress" | "antisocial"
  | "manipulation_core" | "deception_core" | "aggression_core" | "stress_core" | "antisocial_core";

export const EMOTION_PRESETS: Record<EmotionPreset, readonly EmotionKey[]> = {
  all: ALL_EMOTIONS,
  basic: [
    "joy", "sadness", "anger", "fear", "surprise", "disgust", "guilt", "shame", "suspicion", "neutral"
  ] as const,
  extended: [
    "joy", "sadness", "anger", "fear", "surprise", "disgust", "guilt", "shame", "suspicion", "neutral",
    "amusement", "excitement", "pride", "relief", "anxiety", "confusion", "contempt", "embarrassment", "envy", "frustration"
  ] as const,
  advanced: [
    "joy", "sadness", "anger", "fear", "surprise", "disgust", "guilt", "shame", "suspicion", "neutral",
    "amusement", "excitement", "pride", "relief", "anxiety", "confusion", "contempt", "embarrassment", "envy", "frustration",
    "disappointment", "regret", "interest", "determination", "loneliness", "jealousy"
  ] as const,
  personality: [
    "joy", "anger", "fear", "sadness", "disgust", "surprise", "shame", "guilt", "pride", "embarrassment",
    "anxiety", "frustration", "contempt", "envy", "jealousy", "suspicion", "interest", "determination", "loneliness",
    "amusement", "excitement", "relief"
  ] as const,
  social: [
    "joy", "amusement", "excitement", "pride", "relief", "sadness", "anger", "fear", "anxiety", "shame",
    "guilt", "embarrassment", "loneliness", "envy", "jealousy", "contempt", "suspicion", "disgust", "deceit",
    "manipulative", "narcissism", "callousness"
  ] as const,
  cognitive: [
    "surprise", "confusion", "interest", "disappointment", "regret", "determination", "suspicion", "awe"
  ] as const,
  affective: [
    "joy", "excitement", "pride", "relief", "amusement", "sadness", "anger", "fear", "disgust", "despair",
    "guilt", "shame", "embarrassment", "anxiety", "frustration", "disappointment", "regret", "loneliness"
  ] as const,
  behavioral: [
    "predatory", "manipulative", "narcissism", "callousness", "remorselessness", "shallow_affect", "sociopathy",
    "deceit", "suspicion", "fearlessness", "determination", "anger", "frustration", "contempt"
  ] as const,
  threat_level1: [
    "anxiety", "suspicion", "frustration", "disappointment", "embarrassment", "envy", "jealousy", "contempt", "confusion"
  ] as const,
  threat_level2: [
    "anger", "hatred", "resentment", "deceit", "manipulative", "narcissism", "callousness", "fearlessness", "predatory"
  ] as const,
  threat_level3: [
    "sociopathy", "remorselessness", "shallow_affect", "despair"
  ] as const,
  manipulation: [
    "deceit", "manipulative", "narcissism", "sociopathy", "shame", "guilt", "embarrassment", "fear", "anxiety",
    "suspicion", "callousness", "remorselessness"
  ] as const,
  deception: [
    "deceit", "suspicion", "fear", "anxiety", "guilt", "shame", "embarrassment", "pride", "surprise", "confusion",
    "disgust", "anger"
  ] as const,
  aggression: [
    "anger", "hatred", "frustration", "contempt", "disgust", "predatory", "determination", "fearlessness",
    "sociopathy", "callousness", "remorselessness"
  ] as const,
  distress: [
    "anxiety", "fear", "sadness", "despair", "guilt", "shame", "embarrassment", "loneliness", "disappointment",
    "regret", "frustration", "confusion", "suspicion"
  ] as const,
  antisocial: [
    "sociopathy", "narcissism", "callousness", "remorselessness", "shallow_affect", "predatory", "manipulative",
    "deceit", "fearlessness"
  ] as const,
  manipulation_core: ["manipulative", "deceit", "shame", "guilt"] as const,
  deception_core: ["deceit", "suspicion", "fear", "anxiety"] as const,
  aggression_core: ["anger", "hatred", "frustration", "contempt"] as const,
  stress_core: ["anxiety", "fear", "sadness", "despair"] as const,
  antisocial_core: ["sociopathy", "narcissism", "callousness", "remorselessness"] as const,
  custom: ALL_EMOTIONS,
};

export type ConfusionMatrix = { [actual: string]: { [predicted: string]: number } };
export type EmotionStats = { [emotion: string]: { correct: number; total: number } };

export const STORAGE_KEYS = {
  score: "emotion-trainer-score",
  confusionMatrix: "emotion-trainer-confusion",
  emotionStats: "emotion-trainer-emotion-stats",
  trainingMode: "emotion-trainer-training-mode",
  emotionPreset: "emotion-trainer-preset",
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const createEmptyConfusionMatrix = (): ConfusionMatrix => {
  const matrix: ConfusionMatrix = {};
  ALL_EMOTIONS.forEach((actual) => {
    matrix[actual] = {};
    ALL_EMOTIONS.forEach((predicted) => {
      matrix[actual][predicted] = 0;
    });
  });
  return matrix;
};

export const createEmptyEmotionStats = (): EmotionStats => {
  const stats: EmotionStats = {};
  ALL_EMOTIONS.forEach((emotion) => {
    stats[emotion] = { correct: 0, total: 0 };
  });
  return stats;
};

export const getEmotionEmoji = (emotion: string) => {
  const emojiMap: Record<string, string> = {
    joy: "😊", amusement: "😄", excitement: "🤩", pride: "😁", relief: "😅",
    sadness: "😢", despair: "😩", disappointment: "😞", regret: "😔", guilt: "😔",
    shame: "😳", embarrassment: "😳", loneliness: "😔", anger: "😠", hatred: "👿",
    frustration: "😤", resentment: "😒", contempt: "😏", determination: "😠",
    fear: "😨", anxiety: "😰", fearlessness: "😏", neutral: "😐", suspicion: "🤨",
    surprise: "😲", awe: "🤩", confusion: "😕", interest: "🤔", disgust: "🤢",
    deceit: "😈", manipulative: "😈", narcissism: "😏", callousness: "😶",
    remorselessness: "😶", shallow_affect: "😑", sociopathy: "😈", predatory: "👁️",
    envy: "😒", jealousy: "😒",
  };
  return emojiMap[emotion] || "❓";
};
