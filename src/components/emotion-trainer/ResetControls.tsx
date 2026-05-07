import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../i18n/LanguageProvider";

interface ResetControlsProps {
  resetStats: () => void;
}

export const ResetControls: React.FC<ResetControlsProps> = ({ resetStats }) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={resetStats}
        className="flex-1 text-xs border-matrix-accent/30 text-matrix-accent hover:bg-matrix-accent/10"
      >
        <RotateCcw className="w-3 h-3 mr-2" />
        {t.resetStats}
      </Button>
    </div>
  );
};
