import { create } from 'zustand';

export type Store = {
    entropy: string;
    secrets: string[];
    setEntropy: (entropy: string) => void;
    setSecrets: (secrets: string[]) => void;
}

export const useEntropyStore = create<Store>((set) => ({
    entropy: '',
    secrets: [],
    setEntropy: (entropy: string) => set({ entropy: entropy }),
    setSecrets: (secrets: string[]) => set({ secrets: secrets }),
}));