import React from "react";
import { ListFilter } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../i18n/LanguageProvider";
import { EmotionPreset } from "./types";

interface PresetSelectorProps {
  emotionPreset: EmotionPreset;
  setEmotionPreset: (preset: EmotionPreset) => void;
  activeEmotionsCount: number;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  emotionPreset,
  setEmotionPreset,
  activeEmotionsCount,
}) => {
  const { t } = useLanguage();

  return (
    <div className="matrix-glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <ListFilter className="w-4 h-4 text-matrix-accent" />
        <h3 className="font-matrix text-matrix-accent text-sm">
          {t.emotionPreset}
        </h3>
      </div>
      <div className="space-y-6">
        {/* LEVEL 1: ACADEMY */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <div className="h-px flex-1 bg-blue-500/30" />
            <span className="text-[11px] uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">
              {t.categoryAcademy}
            </span>
            <div className="h-px flex-1 bg-blue-500/30" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "basic" ? "default" : "outline"}
              onClick={() => setEmotionPreset("basic")}
              className={`text-xs ${emotionPreset === "basic" ? "bg-blue-600 text-white" : "text-blue-600 border-blue-600/50 hover:bg-blue-600/10"}`}
            >
              <span className="font-semibold">{t.presetBasic}</span>
              <span className="ml-1.5 opacity-70">(10)</span>
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 ml-2">
            {t.presetDescBasic}
          </p>
        </div>

        {/* LEVEL 2: FIELD */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <div className="h-px flex-1 bg-cyan-500/30" />
            <span className="text-[11px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
              {t.categoryField}
            </span>
            <div className="h-px flex-1 bg-cyan-500/30" />
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "extended" ? "default" : "outline"}
              onClick={() => setEmotionPreset("extended")}
              className={`text-xs ${emotionPreset === "extended" ? "bg-cyan-600 text-white" : "text-cyan-600 border-cyan-600/50 hover:bg-cyan-600/10"}`}
            >
              <span className="font-semibold">{t.presetExtended}</span>
              <span className="ml-1.5 opacity-70">(20)</span>
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 ml-2">
            {t.presetDescExtended}
          </p>
        </div>

        {/* LEVEL 3: EXPERT */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <div className="h-px flex-1 bg-purple-500/30" />
            <span className="text-[11px] uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
              {t.categoryExpert}
            </span>
            <div className="h-px flex-1 bg-purple-500/30" />
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "advanced" ? "default" : "outline"}
              onClick={() => setEmotionPreset("advanced")}
              className={`text-xs ${emotionPreset === "advanced" ? "bg-purple-600 text-white" : "text-purple-600 border-purple-600/50 hover:bg-purple-600/10"}`}
            >
              <span className="font-semibold">{t.presetAdvanced}</span>
              <span className="ml-1.5 opacity-70">(30)</span>
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 ml-2">
            {t.presetDescAdvanced}
          </p>
        </div>

        {/* MASTER LEVEL: ALL */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 animate-pulse" />
            <div className="h-px flex-1 bg-gradient-to-r from-yellow-400/30 to-red-500/30" />
            <span className="text-[11px] uppercase tracking-widest text-yellow-600 dark:text-yellow-500 font-bold">
              {t.categoryMastery}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-yellow-400/30 to-red-500/30" />
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "all" ? "default" : "outline"}
              onClick={() => setEmotionPreset("all")}
              className={`text-xs ${emotionPreset === "all" ? "bg-gradient-to-r from-yellow-400 to-red-500 text-black" : "text-yellow-600 border-yellow-600/50 hover:bg-yellow-600/10 dark:text-yellow-500"}`}
            >
              <span className="font-bold">{t.presetAll}</span>
              <span className="ml-1.5 opacity-70">(39)</span>
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 ml-2">
            {t.presetDescAll}
          </p>
        </div>

        {/* SPECIALIZATIONS: BEHAVIORAL */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="h-px flex-1 bg-orange-500/30" />
            <span className="text-[11px] uppercase tracking-widest text-orange-600 dark:text-orange-500 font-bold">
              {t.categoryBehavioral}
            </span>
            <div className="h-px flex-1 bg-orange-500/30" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "personality" ? "default" : "outline"}
              onClick={() => setEmotionPreset("personality")}
              className={`text-xs ${emotionPreset === "personality" ? "bg-orange-600 text-white" : "text-orange-600 border-orange-600/50 hover:bg-orange-600/10"}`}
            >
              {t.presetPersonality}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "social" ? "default" : "outline"}
              onClick={() => setEmotionPreset("social")}
              className={`text-xs ${emotionPreset === "social" ? "bg-orange-600 text-white" : "text-orange-600 border-orange-600/50 hover:bg-orange-600/10"}`}
            >
              {t.presetSocial}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "behavioral" ? "default" : "outline"}
              onClick={() => setEmotionPreset("behavioral")}
              className={`text-xs ${emotionPreset === "behavioral" ? "bg-orange-600 text-white" : "text-orange-600 border-orange-600/50 hover:bg-orange-600/10"}`}
            >
              {t.presetBehavioral}
            </Button>
          </div>
        </div>

        {/* THREAT ASSESSMENT */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="h-px flex-1 bg-red-500/30" />
            <span className="text-[11px] uppercase tracking-widest text-red-600 dark:text-red-500 font-bold">
              {t.categoryThreat}
            </span>
            <div className="h-px flex-1 bg-red-500/30" />
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "threat_level1" ? "default" : "outline"}
              onClick={() => setEmotionPreset("threat_level1")}
              className={`text-xs ${emotionPreset === "threat_level1" ? "bg-red-600 text-white" : "text-red-600 border-red-600/50 hover:bg-red-600/10"}`}
            >
              {t.presetThreat1}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "threat_level2" ? "default" : "outline"}
              onClick={() => setEmotionPreset("threat_level2")}
              className={`text-xs ${emotionPreset === "threat_level2" ? "bg-red-600 text-white" : "text-red-600 border-red-600/50 hover:bg-red-600/10"}`}
            >
              {t.presetThreat2}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "threat_level3" ? "default" : "outline"}
              onClick={() => setEmotionPreset("threat_level3")}
              className={`text-xs ${emotionPreset === "threat_level3" ? "bg-red-600 text-white" : "text-red-600 border-red-600/50 hover:bg-red-600/10"}`}
            >
              {t.presetThreat3}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 ml-2">
            {t.presetDescThreat1}
          </p>
        </div>

        {/* DANGEROUS PATTERNS */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-rose-700 dark:bg-rose-600" />
            <div className="h-px flex-1 bg-rose-700/30 dark:bg-rose-600/30" />
            <span className="text-[11px] uppercase tracking-widest text-rose-700 dark:text-rose-600 font-bold">
              {t.categoryPatterns}
            </span>
            <div className="h-px flex-1 bg-rose-700/30 dark:bg-rose-600/30" />
            <div className="w-2 h-2 rounded-full bg-rose-700 dark:bg-rose-600" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "manipulation" ? "default" : "outline"}
              onClick={() => setEmotionPreset("manipulation")}
              className={`text-xs ${emotionPreset === "manipulation" ? "bg-rose-700 text-white" : "text-rose-700 border-rose-700/50 hover:bg-rose-700/10 dark:text-rose-600"}`}
            >
              {t.presetManipulation}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "deception" ? "default" : "outline"}
              onClick={() => setEmotionPreset("deception")}
              className={`text-xs ${emotionPreset === "deception" ? "bg-rose-700 text-white" : "text-rose-700 border-rose-700/50 hover:bg-rose-700/10 dark:text-rose-600"}`}
            >
              {t.presetDeception}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "aggression" ? "default" : "outline"}
              onClick={() => setEmotionPreset("aggression")}
              className={`text-xs ${emotionPreset === "aggression" ? "bg-rose-700 text-white" : "text-rose-700 border-rose-700/50 hover:bg-rose-700/10 dark:text-rose-600"}`}
            >
              {t.presetAggression}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "distress" ? "default" : "outline"}
              onClick={() => setEmotionPreset("distress")}
              className={`text-xs ${emotionPreset === "distress" ? "bg-rose-700 text-white" : "text-rose-700 border-rose-700/50 hover:bg-rose-700/10 dark:text-rose-600"}`}
            >
              {t.presetDistress}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "antisocial" ? "default" : "outline"}
              onClick={() => setEmotionPreset("antisocial")}
              className={`text-xs ${emotionPreset === "antisocial" ? "bg-rose-700 text-white" : "text-rose-700 border-rose-700/50 hover:bg-rose-700/10 dark:text-rose-600"}`}
            >
              {t.presetAntisocial}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 ml-2">
            {t.presetDescManipulation}
          </p>
        </div>

        {/* CORE PATTERNS */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <div className="h-px flex-1 bg-red-600/30" />
            <span className="text-[11px] uppercase tracking-widest text-red-700 dark:text-red-500 font-bold">
              {t.categoryCore}
            </span>
            <div className="h-px flex-1 bg-red-600/30" />
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "manipulation_core" ? "default" : "outline"}
              onClick={() => setEmotionPreset("manipulation_core")}
              className={`text-xs ${emotionPreset === "manipulation_core" ? "bg-red-700 text-white" : "text-red-700 border-red-700/50 hover:bg-red-700/10 dark:text-red-600"}`}
            >
              {t.presetManipulationCore}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "deception_core" ? "default" : "outline"}
              onClick={() => setEmotionPreset("deception_core")}
              className={`text-xs ${emotionPreset === "deception_core" ? "bg-red-700 text-white" : "text-red-700 border-red-700/50 hover:bg-red-700/10 dark:text-red-600"}`}
            >
              {t.presetDeceptionCore}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "aggression_core" ? "default" : "outline"}
              onClick={() => setEmotionPreset("aggression_core")}
              className={`text-xs ${emotionPreset === "aggression_core" ? "bg-red-700 text-white" : "text-red-700 border-red-700/50 hover:bg-red-700/10 dark:text-red-600"}`}
            >
              {t.presetAggressionCore}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "stress_core" ? "default" : "outline"}
              onClick={() => setEmotionPreset("stress_core")}
              className={`text-xs ${emotionPreset === "stress_core" ? "bg-red-700 text-white" : "text-red-700 border-red-700/50 hover:bg-red-700/10 dark:text-red-600"}`}
            >
              {t.presetStressCore}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "antisocial_core" ? "default" : "outline"}
              onClick={() => setEmotionPreset("antisocial_core")}
              className={`text-xs ${emotionPreset === "antisocial_core" ? "bg-red-700 text-white" : "text-red-700 border-red-700/50 hover:bg-red-700/10 dark:text-red-600"}`}
            >
              {t.presetAntisocialCore}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 ml-2">
            {t.presetDescManipulationCore}
          </p>
        </div>

        {/* PSYCHOLOGICAL STATES */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <div className="h-px flex-1 bg-teal-500/30" />
            <span className="text-[11px] uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold">
              {t.categoryPsychological}
            </span>
            <div className="h-px flex-1 bg-teal-500/30" />
            <div className="w-2 h-2 rounded-full bg-teal-500" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "cognitive" ? "default" : "outline"}
              onClick={() => setEmotionPreset("cognitive")}
              className={`text-xs ${emotionPreset === "cognitive" ? "bg-teal-600 text-white" : "text-teal-600 border-teal-600/50 hover:bg-teal-600/10"}`}
            >
              {t.presetCognitive}
            </Button>
            <Button
              size="sm"
              variant={emotionPreset === "affective" ? "default" : "outline"}
              onClick={() => setEmotionPreset("affective")}
              className={`text-xs ${emotionPreset === "affective" ? "bg-teal-600 text-white" : "text-teal-600 border-teal-600/50 hover:bg-teal-600/10"}`}
            >
              {t.presetAffective}
            </Button>
          </div>
        </div>

        {/* CUSTOM */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <div className="h-px flex-1 bg-gray-400/30" />
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
              {t.categoryCustom}
            </span>
            <div className="h-px flex-1 bg-gray-400/30" />
            <div className="w-2 h-2 rounded-full bg-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2 ml-2">
            <Button
              size="sm"
              variant={emotionPreset === "custom" ? "default" : "outline"}
              onClick={() => setEmotionPreset("custom")}
              className={`text-xs ${emotionPreset === "custom" ? "bg-matrix-accent text-matrix-bg" : ""}`}
            >
              {t.presetCustom}
            </Button>
          </div>
        </div>
      </div>

      {emotionPreset !== "all" && (
        <div className="mt-2 text-[10px] text-muted-foreground">
          {t.activeEmotionsCount.replace('{count}', activeEmotionsCount.toString())}
        </div>
      )}

      {/* Preset description logic */}
      {emotionPreset && (
        <div className="mt-2 p-2 rounded-lg bg-matrix-accent/5 border border-matrix-accent/20">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {(() => {
              const descriptions: Record<EmotionPreset, string> = {
                all: t.presetDescAll || 'All 39 emotions for comprehensive training',
                basic: t.presetDescBasic || '10 core emotions for beginners',
                extended: t.presetDescExtended || '20 common emotions for intermediate training',
                advanced: t.presetDescAdvanced || '30 emotions for advanced practitioners',
                personality: t.presetDescPersonality || '22 emotions for personality and character analysis',
                social: t.presetDescSocial || '22 emotions for social dynamics and relationship intelligence',
                cognitive: t.presetDescCognitive || '8 emotions related to thinking, learning, and appraisal',
                affective: t.presetDescAffective || '18 emotions organized by positive/negative valence',
                behavioral: t.presetDescBehavioral || '14 emotions linked to behavioral tendencies and risk assessment',
                threat_level1: t.presetDescThreat1 || '9 low-level monitoring emotions for routine assessment',
                threat_level2: t.presetDescThreat2 || '9 high-risk emotions requiring heightened awareness',
                threat_level3: t.presetDescThreat3 || '4 critical threat emotions indicating potential danger',
                manipulation: t.presetDescManipulation || '12 emotions commonly used in manipulative contexts',
                deception: t.presetDescDeception || '12 emotions associated with dishonesty and concealment',
                aggression: t.presetDescAggression || '11 emotions signaling hostile intent or violence',
                distress: t.presetDescDistress || '13 emotions indicating heightened anxiety or suffering',
                antisocial: t.presetDescAntisocial || '9 emotions characteristic of antisocial patterns',
                manipulation_core: t.presetDescManipulationCore || '4 core manipulation emotions',
                deception_core: t.presetDescDeceptionCore || '4 core deception emotions',
                aggression_core: t.presetDescAggressionCore || '4 core aggression emotions',
                stress_core: t.presetDescStressCore || '4 core stress-related emotions',
                antisocial_core: t.presetDescAntisocialCore || '4 core antisocial personality emotions',
                custom: t.presetDescCustom || 'Your personalized selection',
              };
              return descriptions[emotionPreset] || '';
            })()}
          </p>
        </div>
      )}
    </div>
  );
};
