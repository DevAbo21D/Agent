
export interface IElectronAPI {
  openExternal: (url: string) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
  const __GEMINI_API_KEY__: string;
}
