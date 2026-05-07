import React from "react";
import { useLanguage } from "../../i18n/LanguageProvider";
import { ALL_EMOTIONS, EmotionStats, getEmotionEmoji } from "./types";

interface EmotionSpectrumProps {
  emotionStats: EmotionStats;
  activeEmotions: readonly string[];
  getEmotionAccuracy: (emotion: string) => number;
}

export const EmotionSpectrum: React.FC<EmotionSpectrumProps> = ({
  emotionStats,
  activeEmotions,
  getEmotionAccuracy,
}) => {
  const { t } = useLanguage();

  return (
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
              <span className="text-sm">{getEmotionEmoji(emotion)}</span>
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
  );
};
