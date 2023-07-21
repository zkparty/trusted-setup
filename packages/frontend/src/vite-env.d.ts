/// <reference types="vite/client" />
declare module 'especial/client';

interface ImportMetaEnv {
  readonly VITE_PROJECT_TITLE: string;
  readonly VITE_TITLE_CHANGING_SPEED: number;
  readonly VITE_TITLE_RESET_TIME: number;
  readonly VITE_TITLE_CHANGES_BACK_TO_NORMAL: number;

  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;

  readonly VITE_KEEP_ALIVE_PADDING: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snarkjs: any;
}