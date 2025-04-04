

import { create } from "zustand";

type TitleState = {
  title: string;
  setTitle: (title: string) => void;
}

export const useTitleStore = create<TitleState>((set) => ({
  title: "Accueil",
  setTitle: (title: string) => set({ title }),
}));
