/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENDAMENTO_API?: string;
  readonly VITE_WHATSAPP?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
