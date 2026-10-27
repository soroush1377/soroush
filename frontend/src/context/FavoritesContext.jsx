import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'horizon:favorites';

const FavoritesContext = createContext(null);

const readStored = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((slug) => typeof slug === 'string') : [];
  } catch {
    return [];
  }
};

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage can be unavailable (private mode); favorites stay in memory.
    }
  }, [favorites]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setFavorites(readStored());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((slug) => {
    setFavorites((previous) =>
      previous.includes(slug) ? previous.filter((item) => item !== slug) : [slug, ...previous],
    );
  }, []);

  const clear = useCallback(() => setFavorites([]), []);

  const value = useMemo(
    () => ({
      favorites,
      count: favorites.length,
      isFavorite: (slug) => favorites.includes(slug),
      toggle,
      clear,
    }),
    [favorites, toggle, clear],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used inside a FavoritesProvider');
  return context;
}
