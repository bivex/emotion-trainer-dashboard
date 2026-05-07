import React from "react";
import { Shield } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-8 text-center">
      <div className="inline-flex items-center gap-4 sm:gap-6 matrix-glass rounded-xl sm:rounded-2xl px-6 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-2">
          <img
            src="/favicon.png"
            alt="logo"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span className="font-matrix text-matrix-secondary text-xs sm:text-sm">
            {t.neuralNetwork}
          </span>
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground">
          {t.poweredBy}
        </div>
        <div className="flex items-center gap-1 text-emotion-joy">
          <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-matrix text-xs sm:text-sm">
            {t.secure}
          </span>
        </div>
      </div>
    </div>
  );
};
