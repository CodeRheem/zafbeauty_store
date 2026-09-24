"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type FavoriteItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imagePath: string | null;
};

type FavoritesContextType = {
  items: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (productId: string) => boolean;
  removeFavorite: (productId: string) => void;
  totalItems: number;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "zafbeauty_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable
    }
  }, [items, hydrated]);

  function toggleFavorite(item: FavoriteItem) {
    setItems((prev) => {
      const exists = prev.some((i) => i.productId === item.productId);
      if (exists) return prev.filter((i) => i.productId !== item.productId);
      return [...prev, item];
    });
  }

  function removeFavorite(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function isFavorite(productId: string) {
    return items.some((i) => i.productId === productId);
  }

  return (
    <FavoritesContext.Provider
      value={{
        items,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        totalItems: items.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}