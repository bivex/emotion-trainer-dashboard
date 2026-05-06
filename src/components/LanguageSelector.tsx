import { useLanguage } from '../i18n/LanguageProvider';
import { Globe } from 'lucide-react';

const languages: { code: 'en' | 'ru' | 'zh' | 'es'; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative group">
      <button
        className="matrix-toolbar-button inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-matrix uppercase tracking-wider matrix-interactive sm:h-11"
        aria-label={t.selectLanguage}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{languages.find(l => l.code === language)?.flag}</span>
      </button>

      <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="matrix-glass min-w-[160px] rounded-xl p-2 shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                language === lang.code
                  ? 'bg-matrix-accent/20 text-matrix-accent'
                  : 'text-muted-foreground hover:bg-matrix-accent/8 hover:text-foreground'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
