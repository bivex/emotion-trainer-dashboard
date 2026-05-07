import React from "react";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";

interface StatsPanelProps {
  accuracy: number;
  score: { correct: number; total: number };
  remainingImages: number;
  totalImages: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  accuracy,
  score,
  remainingImages,
  totalImages,
}) => {
  const { t } = useLanguage();

  return (
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
            <span className="text-sm text-muted-foreground">{t.accuracy}</span>
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
            <div className="text-xs text-muted-foreground">{t.correct}</div>
          </div>
          <div className="emotion-bg-sadness rounded-lg p-3 text-center">
            <div className="font-matrix text-emotion-sadness text-2xl mb-1">
              {score.total}
            </div>
            <div className="text-xs text-muted-foreground">{t.total}</div>
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
  );
};
