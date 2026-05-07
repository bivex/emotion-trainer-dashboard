import React from "react";
import { Zap } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { LanguageSelector } from "../LanguageSelector";
import { DevToolsToggle } from "../devtools-toggle";
import { useLanguage } from "../../i18n/LanguageProvider";

interface HeaderProps {
  accuracy: number;
  score: { correct: number; total: number };
  totalImages: number;
}

export const Header: React.FC<HeaderProps> = ({ accuracy, score, totalImages }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 sm:gap-8 mb-6 sm:mb-12">
      {/* Top Header */}
      <header className="flex justify-between items-center bg-black/20 backdrop-blur-md px-4 py-3 sm:px-8 sm:py-5 rounded-xl sm:rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-matrix-accent to-matrix-secondary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black rounded-lg p-2 sm:p-3 leading-none flex items-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-matrix-accent animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-matrix-bold text-lg sm:text-2xl tracking-[0.2em] text-white">
              {t.title} <span className="text-matrix-accent">{t.titleAccent}</span> {t.titleEnd}
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-matrix-accent animate-pulse" />
              <span className="text-[10px] sm:text-xs text-matrix-secondary font-matrix uppercase tracking-widest">
                {t.matrixReady}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <DevToolsToggle />
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <div className="text-center space-y-3 sm:space-y-4 px-4">
        <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl mx-auto uppercase tracking-[0.2em] leading-relaxed">
          {t.subtitle}
          <br />
          <span className="text-matrix-secondary/60">
            {t.subtitleLine2}
          </span>
        </p>
      </div>

      {/* Mobile Stats Bar */}
      <div className="lg:hidden matrix-glass rounded-xl p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="font-matrix text-emotion-joy text-lg">
              {accuracy}%
            </div>
            <div className="text-[10px] text-muted-foreground">
              {t.accuracy}
            </div>
          </div>
          <div className="w-px h-8 bg-matrix-accent/20" />
          <div className="text-center">
            <div className="font-matrix text-emotion-neutral">
              {score.correct}/{score.total}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {t.correct}
            </div>
          </div>
        </div>
        {totalImages > 0 && (
          <div className="text-right text-[10px] text-muted-foreground">
            <span className="font-matrix text-matrix-secondary">
              {totalImages}
            </span>{" "}
            {t.total}
          </div>
        )}
      </div>
    </div>
  );
};
