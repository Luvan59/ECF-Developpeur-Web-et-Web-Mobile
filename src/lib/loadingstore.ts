import { create } from "zustand";

type LoadingStore = {
  isLoading: boolean;
  message: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  message: "Chargement...",
  startLoading: (message = "Chargement...") =>
    set({
      isLoading: true,
      message,
    }),
  stopLoading: () =>
    set({
      isLoading: false,
      message: "Chargement...",
    }),
}));
