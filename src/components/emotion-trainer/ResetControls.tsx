import React from "react";
import { RotateCcw, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../i18n/LanguageProvider";

interface ResetControlsProps {
  resetStats: () => void;
  resetGoodStats: () => void;
  resetBadStats: () => void;
}

export const ResetControls: React.FC<ResetControlsProps> = ({ 
  resetStats,
  resetGoodStats,
  resetBadStats
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={resetGoodStats}
          className="flex-1 text-xs border-emotion-joy/30 text-emotion-joy hover:bg-emotion-joy/10"
        >
          <CheckCircle2 className="w-3 h-3 mr-2" />
          {t.resetGood}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={resetBadStats}
          className="flex-1 text-xs border-emotion-anger/30 text-emotion-anger hover:bg-emotion-anger/10"
        >
          <XCircle className="w-3 h-3 mr-2" />
          {t.resetBad}
        </Button>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={resetStats}
        className="w-full text-xs border-matrix-accent/30 text-matrix-accent hover:bg-matrix-accent/10"
      >
        <RotateCcw className="w-3 h-3 mr-2" />
        {t.resetStats}
      </Button>
    </div>
  );
};
