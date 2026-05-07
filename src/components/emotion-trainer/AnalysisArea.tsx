import React from "react";
import { Microscope, Brain } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";
import { EmotionImage } from "../../api/images";

interface AnalysisAreaProps {
  currentImage: EmotionImage | null;
  showResult: boolean;
  isCorrect: boolean;
  selectedEmotion: string;
  getEmotionTranslation: (emotion: string) => string;
}

export const AnalysisArea: React.FC<AnalysisAreaProps> = ({
  currentImage,
  showResult,
  isCorrect,
  selectedEmotion,
  getEmotionTranslation,
}) => {
  const { t } = useLanguage();

  return (
    <div className="lg:col-span-2 xl:col-span-6 space-y-4 sm:space-y-6">
      <div className="matrix-glass rounded-xl sm:rounded-3xl p-3 sm:p-8 relative overflow-hidden group min-h-[400px] flex flex-col items-center justify-center">
        {/* Background neural pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00ff41_1px,transparent_1px)] bg-[length:20px_20px]" />
        </div>

        {/* Content */}
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="hidden sm:flex items-center gap-4 mb-6 lg:mb-8">
            <div className="w-12 h-12 bg-matrix-secondary rounded-xl flex items-center justify-center matrix-glow">
              <Microscope className="w-6 h-6 text-matrix-bg" />
            </div>
            <div>
              <h2 className="font-matrix-semibold text-matrix-accent text-heading-xl">
                {t.neuralAnalysis}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-matrix-secondary animate-pulse" />
                {t.processingFacial}
              </div>
            </div>
          </div>

          <div className="relative aspect-square sm:aspect-video rounded-lg sm:rounded-2xl overflow-hidden matrix-glass border-2 border-matrix-accent/20 group-hover:border-matrix-accent/40 transition-all duration-500 bg-black/40">
            {currentImage ? (
              <>
                <img
                  src={currentImage.path}
                  alt="Target expression"
                  className={`w-full h-full object-cover transition-all duration-700 ${showResult ? "scale-105" : "hover:scale-105"}`}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 sm:w-16 sm:h-16 border-t-2 border-l-2 border-matrix-accent/40 rounded-tl-xl sm:rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 sm:w-16 sm:h-16 border-t-2 border-r-2 border-matrix-accent/40 rounded-tr-xl sm:rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-16 sm:h-16 border-b-2 border-l-2 border-matrix-accent/40 rounded-bl-xl sm:rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-16 sm:h-16 border-b-2 border-r-2 border-matrix-accent/40 rounded-br-xl sm:rounded-br-2xl" />
                  <div className="absolute top-1/2 left-0 w-full h-px bg-matrix-accent/10" />
                  <div className="absolute top-0 left-1/2 w-px h-full bg-matrix-accent/10" />
                </div>

                {showResult && (
                  <div
                    className={`absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-matrix text-xs sm:text-sm matrix-glass border ${
                      isCorrect
                        ? "border-emotion-joy/50 text-emotion-joy bg-emotion-joy/10"
                        : "border-emotion-anger/50 text-emotion-anger bg-emotion-anger/10"
                    }`}
                  >
                    {isCorrect ? t.confirmed : t.error}
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-matrix-accent/20 animate-pulse" />
                  <div className="absolute inset-0 bg-matrix-accent/5 blur-xl rounded-full" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="font-matrix text-matrix-accent/40 text-xs sm:text-sm uppercase tracking-widest">
                    {t.initializing}
                  </div>
                  <div className="text-muted-foreground text-[10px] sm:text-xs">
                    {t.loadingDatabase}
                  </div>
                </div>
              </div>
            )}
          </div>

          {showResult && (
            <div
              className={`mt-4 p-2 sm:p-4 rounded-lg sm:rounded-xl border sm:border-2 matrix-glass ${
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
    </div>
  );
};
