/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-28T23:04:23
 * Last Updated: 2025-12-28T23:04:23
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { HelmetProvider } from 'react-helmet-async';
import EmotionTrainer from './components/EmotionTrainer';
import SEO from './components/SEO';
import { ThemeProvider } from './components/theme-provider';
import { LanguageProvider } from './i18n/LanguageProvider';
import './index.css';

const App = () => {
  return (
    <HelmetProvider>
      <SEO />
      <ThemeProvider defaultTheme="dark" storageKey="emotion-trainer-theme">
        <LanguageProvider>
          <EmotionTrainer />
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
