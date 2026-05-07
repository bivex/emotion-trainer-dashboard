import React from "react";
import MatrixBackground from "../MatrixBackground";
import { useEmotionTrainer } from "./useEmotionTrainer";
import { Header } from "./Header";
import { StatsPanel } from "./StatsPanel";
import { PresetSelector } from "./PresetSelector";
import { EmotionSpectrum } from "./EmotionSpectrum";
import { TrainingModeToggle } from "./TrainingModeToggle";
import { ResetControls } from "./ResetControls";
import { AnalysisArea } from "./AnalysisArea";
import { EmotionMatrix } from "./EmotionMatrix";
import { Footer } from "./Footer";

const EmotionTrainer: React.FC = () => {
  const {
    t,
    currentImage,
    score,
    showResult,
    selectedEmotion,
    isCorrect,
    revealEmotion,
    emotionStats,
    trainingMode,
    emotionPreset,
    accuracy,
    remainingImages,
    totalImages,
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
  } = useEmotionTrainer();

  return (
    <MatrixBackground>
      <div className="min-h-screen p-4 sm:p-6 lg:p-12 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto">
          <Header
            accuracy={accuracy}
            score={score}
            totalImages={totalImages}
          />

          <div
            className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 mb-4 sm:mb-8"
            role="region"
            aria-label={t.ariaLabelTrainingInterface}
          >
            {/* Left Panel */}
            <div className="lg:col-span-1 xl:col-span-3 space-y-4 sm:space-y-6">
              <StatsPanel
                accuracy={accuracy}
                score={score}
                remainingImages={remainingImages}
                totalImages={totalImages}
              />
              <PresetSelector
                emotionPreset={emotionPreset}
                setEmotionPreset={setEmotionPreset}
                activeEmotionsCount={activeEmotions.length}
              />
              <EmotionSpectrum
                emotionStats={emotionStats}
                activeEmotions={activeEmotions}
                getEmotionAccuracy={getEmotionAccuracy}
              />
              <TrainingModeToggle
                trainingMode={trainingMode}
                setTrainingMode={setTrainingMode}
                weakEmotions={getWeakEmotions()}
              />
              <ResetControls resetStats={resetStats} />
            </div>

            {/* Center Panel */}
            <AnalysisArea
              currentImage={currentImage}
              showResult={showResult}
              isCorrect={isCorrect}
              selectedEmotion={selectedEmotion}
              getEmotionTranslation={getEmotionTranslation}
            />

            {/* Right Panel */}
            <EmotionMatrix
              activeEmotions={activeEmotions}
              selectedEmotion={selectedEmotion}
              showResult={showResult}
              revealEmotion={revealEmotion}
              currentImage={currentImage}
              isCorrect={isCorrect}
              setRevealEmotion={setRevealEmotion}
              checkAnswer={checkAnswer}
              loadNextImage={loadNextImage}
              getEmotionTranslation={getEmotionTranslation}
            />
          </div>

          <Footer />
        </div>
      </div>
    </MatrixBackground>
  );
};

export default EmotionTrainer;
export { EmotionTrainer };
