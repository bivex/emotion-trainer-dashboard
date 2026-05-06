import { Button } from './ui/button';
import { Code2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageProvider';

export function DevToolsToggle() {
  const { t } = useLanguage();

  const handleOpenDevTools = async () => {
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      const { invoke } = await import('@tauri-apps/api/core');
      try {
        await invoke('open_devtools');
      } catch (error) {
        console.error('Failed to open DevTools:', error);
      }
    }
  };

  // Only show in Tauri app
  if (typeof window !== 'undefined' && !('__TAURI_INTERNALS__' in window)) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleOpenDevTools}
      className="relative overflow-hidden group"
      title={t.openDevTools}
    >
      <Code2 className="h-4 w-4" />
    </Button>
  );
}
