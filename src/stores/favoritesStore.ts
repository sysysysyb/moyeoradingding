import { create } from 'zustand';

import { getBookmarkGroups, getBookmarkIdols } from '@/api/bookmarkIdolApi';
import type { BookmarkGroup, BookmarkIdol } from '@/types/bookmark';

interface FavoritesState {
  favorites: number[];
  favoriteGroups: BookmarkGroup[];
  favoriteIdols: BookmarkIdol[];
  isLoading: boolean;
  toggleFavorite: (idolId: number) => void;
  isFavorited: (idolId: number) => boolean;
  setFavorites: (ids: number[]) => void;
  fetchFavorites: () => Promise<void>;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favorites: [],
  favoriteGroups: [],
  favoriteIdols: [],
  isLoading: false,

  toggleFavorite: idolId =>
    set(s => ({
      favorites: s.favorites.includes(idolId)
        ? s.favorites.filter(id => id !== idolId)
        : [...s.favorites, idolId],
    })),

  isFavorited: idolId => get().favorites.includes(idolId),

  setFavorites: ids => set({ favorites: Array.from(new Set(ids)) }),

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const [groups, idols] = await Promise.all([
        getBookmarkGroups(),
        getBookmarkIdols(),
      ]);
      set({ favoriteGroups: groups, favoriteIdols: idols, isLoading: false });
      set({ favorites: idols.map(idol => idol.idol) });
    } catch {
      set({ isLoading: false });
    }
  },

  clear: () => set({ favorites: [], favoriteGroups: [], favoriteIdols: [] }),
}));
