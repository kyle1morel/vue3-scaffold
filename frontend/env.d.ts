/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Frontend package.json version, injected at build time by vite.config.mts.
  readonly APP_VERSION: string;
}
