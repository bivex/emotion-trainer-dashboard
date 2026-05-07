import React from "react";
import { Theater, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../i18n/LanguageProvider";
import { getEmotionEmoji, EmotionKey } from "./types";
import { EmotionImage } from "../../api/images";

interface EmotionMatrixProps {
  activeEmotions: readonly EmotionKey[];
  selectedEmotion: string;
  showResult: boolean;
  revealEmotion: boolean;
  currentImage: EmotionImage | null;
  isCorrect: boolean;
  setRevealEmotion: (reveal: boolean) => void;
  checkAnswer: (emotion: string) => void;
  loadNextImage: () => void;
  getEmotionTranslation: (emotion: string) => string;
}

export const EmotionMatrix: React.FC<EmotionMatrixProps> = ({
  activeEmotions,
  selectedEmotion,
  showResult,
  revealEmotion,
  currentImage,
  isCorrect,
  setRevealEmotion,
  checkAnswer,
  loadNextImage,
  getEmotionTranslation,
}) => {
  const { t } = useLanguage();

  return (
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
          {activeEmotions.map((emotion) => {
            const isSelected = selectedEmotion === emotion;
            const showBlurred = showResult && isSelected && !revealEmotion;
            return (
              <Button
                key={emotion}
                onClick={showBlurred ? () => setRevealEmotion(true) : () => checkAnswer(emotion)}
                disabled={showResult && !showBlurred}
                variant="ghost"
                aria-label={`Select ${getEmotionTranslation(emotion)} emotion`}
                aria-pressed={isSelected}
                className={`h-12 sm:h-16 rounded-lg border sm:border-2 transition-all duration-300 matrix-interactive disabled:opacity-50 disabled:cursor-not-allowed font-matrix text-[9px] sm:text-xs uppercase tracking-wider focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-matrix-accent focus:ring-offset-1 sm:focus:ring-offset-2 focus:ring-offset-matrix-bg px-1 sm:px-4 ${
                  showBlurred
                    ? "blur-[3px] select-none opacity-70 cursor-pointer"
                    : showResult && emotion === currentImage?.emotion
                    ? `bg-emotion-${emotion}/20 border-emotion-${emotion} emotion-text-${emotion} matrix-glow animate-matrix-pulse`
                    : showResult && isSelected && !isCorrect
                    ? "bg-emotion-anger/20 border-emotion-anger emotion-text-anger"
                    : `hover:bg-emotion-${emotion}/10 border-border`
                }`}
              >
                <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                  <span className={`text-lg sm:text-xl ${showBlurred ? "blur-sm" : ""}`}>
                    {getEmotionEmoji(emotion)}
                  </span>
                  <span className={`truncate max-w-full ${showBlurred ? "blur-sm" : ""}`}>
                    {getEmotionTranslation(emotion)}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Current emotion display */}
        <div className="matrix-glass rounded-lg p-3 sm:p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-matrix-accent/5" />
          <div className="relative">
            {currentImage && showResult ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="text-[10px] uppercase tracking-[0.2em] text-matrix-secondary mb-1">
                  {t.neuralMatch}
                </div>
                <span className={`font-matrix text-lg sm:text-2xl uppercase emotion-text-${currentImage.emotion}`}>
                  {getEmotionTranslation(currentImage.emotion)}
                </span>
              </div>
            ) : (
              <span className="font-matrix text-muted-foreground text-xs sm:text-sm">
                {t.noImage}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={loadNextImage}
          disabled={showResult}
          className="w-full mt-3 sm:mt-4 font-matrix text-xs sm:text-sm uppercase tracking-wider disabled:opacity-50"
          size="sm"
        >
          <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${showResult ? "" : "animate-spin-slow"}`} />
          {t.nextScan}
        </Button>
      </div>
    </div>
  );
};
