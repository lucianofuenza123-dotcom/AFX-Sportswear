
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface FavoritesContextType {
  favoriteIds: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const savedFavorites = localStorage.getItem("afx-favorites");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("afx-favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  function toggleFavorite(productId: number) {
    setFavoriteIds((currentFavorites) =>
      currentFavorites.includes(productId)
        ? currentFavorites.filter((id) => id !== productId)
        : [...currentFavorites, productId]
    );
  }

  function isFavorite(productId: number) {
    return favoriteIds.includes(productId);
  }

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe utilizarse dentro de FavoritesProvider"
    );
  }

  return context;
}
