export const ALL_EMOTIONS = [
  // === BASIC 10 (универсальные/фундаментальные) ===
  "joy",
  "sadness",
  "anger",
  "fear",
  "surprise",
  "disgust",
  "contempt",
  "anxiety",
  "shame",
  "guilt",

  // === EXTENDED 20 (промежуточная сложность) ===
  "excitement",
  "embarrassment",
  "regret",
  "relief",
  "suspicion",
  "confusion",
  "disappointment",
  "frustration",
  "resentment",
  "envy",

  // === ADVANCED 30 (специализированные/фореnsic niche) ===
  "jealousy",
  "amusement",
  "interest",
  "pride",
  "determination",
  "awe",
  "loneliness",
  "fearlessness",
  "despair",
  "hatred",

  // === ПАТОЛОГИЧЕСКИЕ / ПОВЕДЕНЧЕСКИЕ ИНДИКАТОРЫ ===
  "manipulative",
  "narcissism",
  "predatory",
  "callousness",
  "remorselessness",
  "shallow_affect",
  "sociopathy",
  "deceit",

  "neutral",
] as const;

export type EmotionKey = (typeof ALL_EMOTIONS)[number];

export type EmotionPreset =
  | "all" | "basic" | "extended" | "advanced" | "custom"
  | "personality" | "social" | "cognitive" | "affective" | "behavioral"
  | "threat_level1" | "threat_level2" | "threat_level3"
  | "manipulation" | "deception" | "aggression" | "distress" | "antisocial"
  | "manipulation_core" | "deception_core" | "aggression_core" | "stress_core" | "antisocial_core"
  // Learning profiles — emotion families for discrimination training
  | "profile_joy" | "profile_sadness" | "profile_aggression" | "profile_fear" | "profile_selfesteem" | "profile_coldness" | "profile_cognitive"
  // Archetype profiles — character templates for podcast/storytelling
  | "archetype_leader" | "archetype_strategist" | "archetype_romantic" | "archetype_rebel" | "archetype_predator" | "archetype_analyst" | "archetype_supporter"
  // Juvenile police archetypes
  | "archetype_runaway" | "archetype_victim" | "archetype_manipulator" | "archetype_aggressor" | "archetype_anxious" | "archetype_resilient";

export const EMOTION_PRESETS: Record<EmotionPreset, readonly EmotionKey[]> = {
  all: ALL_EMOTIONS,
  basic: [
    "joy", "sadness", "anger", "fear", "surprise", "disgust", "contempt", "anxiety", "shame", "guilt"
  ] as const,
  extended: [
    "joy", "sadness", "anger", "fear", "surprise", "disgust", "contempt", "anxiety", "shame", "guilt",
    "excitement", "embarrassment", "regret", "relief", "suspicion", "confusion", "disappointment", "frustration", "resentment", "envy"
  ] as const,
  advanced: [
    "joy", "sadness", "anger", "fear", "surprise", "disgust", "contempt", "anxiety", "shame", "guilt",
    "excitement", "embarrassment", "regret", "relief", "suspicion", "confusion", "disappointment", "frustration", "resentment", "envy",
    "jealousy", "amusement", "interest", "pride", "determination", "awe", "loneliness", "fearlessness", "despair", "hatred"
  ] as const,

  // === SPECIALIZATION: BEHAVIORAL ANALYSIS ===
  personality: [
    "shame", "guilt", "pride", "embarrassment", "narcissism",
    "contempt", "disgust", "resentment", "envy", "jealousy",
    "sociopathy", "callousness", "remorselessness", "shallow_affect",
    "loneliness", "awe", "interest", "amusement", "determination",
    "fearlessness", "predatory", "manipulative"
  ] as const,
  social: [
    "embarrassment", "shame", "guilt", "jealousy", "envy",
    "resentment", "pride", "contempt", "disgust", "suspicion",
    "excitement", "amusement", "interest", "awe", "loneliness",
    "relief", "frustration", "disappointment", "confusion", "anxiety",
    "fear", "surprise"
  ] as const,
  behavioral: [
    "predatory", "manipulative", "narcissism", "callousness", "remorselessness",
    "shallow_affect", "sociopathy", "deceit", "suspicion", "fearlessness",
    "determination", "anger", "frustration", "contempt"
  ] as const,

  // === SPECIALIZATION: PSYCHOLOGICAL STATES ===
  cognitive: [
    "surprise", "confusion", "interest", "disappointment", "regret",
    "determination", "awe", "suspicion"
  ] as const,
  affective: [
    "joy", "sadness", "anger", "fear", "disgust", "excitement",
    "relief", "pride", "shame", "guilt", "envy", "jealousy",
    "loneliness", "despair", "hatred", "awe", "amusement", "embarrassment"
  ] as const,

  // === SPECIALIZATION: THREAT ASSESSMENT ===
  threat_level1: [
    "anxiety", "suspicion", "confusion", "embarrassment", "disappointment",
    "frustration", "envy", "jealousy", "loneliness"
  ] as const,
  threat_level2: [
    "anger", "fear", "disgust", "contempt", "hatred",
    "resentment", "shame", "guilt", "despair"
  ] as const,
  threat_level3: [
    "predatory", "callousness", "remorselessness", "sociopathy"
  ] as const,

  // === SPECIALIZATION: DANGEROUS PATTERNS ===
  manipulation: [
    "deceit", "manipulative", "narcissism", "sociopathy", "shame", "guilt",
    "embarrassment", "fear", "anxiety", "suspicion", "callousness", "remorselessness"
  ] as const,
  deception: [
    "deceit", "suspicion", "fear", "anxiety", "guilt", "shame", "embarrassment",
    "pride", "surprise", "confusion", "disgust", "anger"
  ] as const,
  aggression: [
    "anger", "hatred", "frustration", "contempt", "disgust", "predatory",
    "determination", "fearlessness", "sociopathy", "callousness", "remorselessness"
  ] as const,
  distress: [
    "anxiety", "fear", "despair", "shame", "guilt", "embarrassment",
    "disappointment", "frustration", "loneliness", "envy", "jealousy", "confusion", "suspicion"
  ] as const,
  antisocial: [
    "sociopathy", "callousness", "remorselessness", "shallow_affect",
    "predatory", "manipulative", "deceit", "narcissism", "contempt"
  ] as const,

  // === QUICK REFERENCE: CORE PATTERNS ===
  manipulation_core: ["manipulative", "deceit", "suspicion", "confusion"] as const,
  deception_core: ["deceit", "shame", "guilt", "anxiety"] as const,
  aggression_core: ["anger", "hatred", "contempt", "frustration"] as const,
  stress_core: ["anxiety", "fear", "frustration", "disappointment"] as const,
  antisocial_core: ["sociopathy", "callousness", "remorselessness", "shallow_affect"] as const,

  // === LEARNING PROFILES — emotion families for discrimination training ===
  profile_joy: ["joy", "amusement", "excitement", "awe", "interest", "relief"] as const,
  profile_sadness: ["sadness", "disappointment", "regret", "despair", "loneliness"] as const,
  profile_aggression: ["anger", "frustration", "hatred", "contempt", "resentment"] as const,
  profile_fear: ["fear", "anxiety", "suspicion", "jealousy", "envy"] as const,
  profile_selfesteem: ["guilt", "shame", "embarrassment", "pride", "narcissism"] as const,
  profile_coldness: ["callousness", "manipulative", "deceit", "remorselessness", "shallow_affect", "sociopathy", "predatory"] as const,
  profile_cognitive: ["surprise", "confusion", "determination", "fearlessness", "neutral"] as const,

  // === ARCHETYPE PROFILES — character templates for podcast/storytelling ===
  archetype_leader: ["determination", "excitement", "pride", "anger", "fearlessness"] as const,
  archetype_strategist: ["neutral", "interest", "suspicion", "manipulative", "callousness"] as const,
  archetype_romantic: ["sadness", "loneliness", "disappointment", "regret", "awe"] as const,
  archetype_rebel: ["anger", "excitement", "frustration", "contempt", "fearlessness"] as const,
  archetype_predator: ["deceit", "manipulative", "shallow_affect", "remorselessness", "narcissism"] as const,
  archetype_analyst: ["anxiety", "suspicion", "confusion", "fear", "interest"] as const,
  archetype_supporter: ["joy", "interest", "relief", "awe", "pride"] as const,

  // === ARCHETYPE PROFILES — Juvenile police context ===
  archetype_runaway: ["fear", "anxiety", "determination", "loneliness", "suspicion", "relief"] as const,
  archetype_victim: ["fear", "anxiety", "shame", "sadness", "loneliness", "confusion"] as const,
  archetype_manipulator: ["manipulative", "deceit", "suspicion", "shame", "guilt", "narcissism"] as const,
  archetype_aggressor: ["anger", "hatred", "contempt", "disgust", "predatory", "frustration"] as const,
  archetype_anxious: ["anxiety", "fear", "confusion", "suspicion", "despair", "shame"] as const,
  archetype_resilient: ["determination", "fearlessness", "pride", "joy", "relief", "interest"] as const,

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
