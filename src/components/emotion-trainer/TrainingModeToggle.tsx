import React from "react";
import { Target } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../i18n/LanguageProvider";
import { getEmotionEmoji } from "./types";

interface TrainingModeToggleProps {
  trainingMode: "normal" | "weak";
  setTrainingMode: (mode: "normal" | "weak") => void;
  weakEmotions: string[];
}

export const TrainingModeToggle: React.FC<TrainingModeToggleProps> = ({
  trainingMode,
  setTrainingMode,
  weakEmotions,
}) => {
  const { t } = useLanguage();

  return (
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
          onClick={() => setTrainingMode("normal")}
          className={`flex-1 text-xs ${trainingMode === "normal" ? "bg-matrix-accent text-matrix-bg" : ""}`}
        >
          {t.normalMode}
        </Button>
        <Button
          size="sm"
          variant={trainingMode === "weak" ? "default" : "outline"}
          onClick={() => setTrainingMode("weak")}
          className={`flex-1 text-xs ${trainingMode === "weak" ? "bg-emotion-anger text-white" : ""}`}
        >
          {t.weakMode}
        </Button>
      </div>
      {trainingMode === "weak" && weakEmotions.length > 0 && (
        <div className="mt-2 text-[10px] text-muted-foreground">
          {weakEmotions.map((e) => getEmotionEmoji(e)).join(" ")}
        </div>
      )}
    </div>
  );
};
