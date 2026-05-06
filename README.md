# Emotion Trainer Dashboard

An interactive emotion training application built with React, TypeScript, TailwindCSS, and Tauri for native desktop deployments.

## Features

- **Emotion Recognition Training**: Interactive exercises to improve emotional intelligence
- **Multilingual Support**: Full internationalization with language switching
- **Cross-Platform**: Runs as a web app and native desktop application via Tauri
- **Modern UI**: Clean, accessible interface with dark/light theme support
- **Offline Capable**: Works without internet connection once loaded

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS with CSS custom properties for theming
- **Build Tool**: Rsbuild with Tauri plugin for desktop builds
- **UI Components**: Radix UI primitives with custom variants via class-variance-authority
- **Icons**: Lucide React
- **Internationalization**: Custom i18n context with translations

## Development

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- For Tauri builds: Rust and system dependencies (macOS/Linux/Windows)

### Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production (web)
bun run build

# Build Tauri desktop app
bun run tauri build
```

### Available Scripts

- `bun run dev` – Start development server with hot reload
- `bun run build` – Build production web bundle
- `bun run preview` – Preview production build locally
- `bun run tauri dev` – Launch Tauri development window
- `bun run tauri build` – Compile native desktop application
- `bun run lint` – Run ESLint
- `bun run typecheck` – Run TypeScript compiler checks

## Project Structure

```
├── src/
│   ├── components/       # React components (UI + feature)
│   │   ├── ui/          # Reusable UI primitives
│   │   └── EmotionTrainer.tsx
│   ├── i18n/            # Internationalization
│   ├── lib/             # Utilities
│   ├── api/             # API layer
│   └── data/            # Static assets (image manifest)
├── src-tauri/           # Tauri backend (Rust)
├── public/              # Static web assets
├── scripts/             # Build and utility scripts
└── dist/                # Production build output
```

## Architecture

- **Component Design**: Uses Radix UI for accessibility + TailwindCSS for styling
- **State Management**: React hooks + context for global state (language, theme)
- **Type Safety**: Full TypeScript coverage with strict mode
- **Theming**: CSS custom properties for dark/light mode switching
- **Performance**: Code splitting, lazy loading, optimized asset pipeline

## Internationalization

The app supports multiple languages through a custom `LanguageProvider` context. Translations are located in `src/i18n/translations.ts`. Add new languages by extending the `TranslationKey` type and adding translation objects.

## Contributing

1. Follow existing code style (Prettier + ESLint configuration)
2. Write TypeScript interfaces for all new props and data structures
3. Keep components modular and focused on single responsibilities
4. Use TailwindCSS utility classes; avoid custom CSS when possible
5. Ensure accessibility (ARIA labels, keyboard navigation, proper semantics)

## License

MIT
