// src/context/FavoritesContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { favoritesStorage, type RecipeId } from "../service/favoritesStorage";

interface FavoritesContextValue {
  favorites: RecipeId[];
  toggleFavorite: (recipeId: RecipeId) => void;
  isFavorite: (recipeId: RecipeId) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<RecipeId[]>(
      () => favoritesStorage.getAll()
  );

  // Lagre hver gang lista endrer seg
  useEffect(() => {
      favoritesStorage.save(favorites);
  }, [favorites]);

  const toggleFavorite = useCallback((recipeId: RecipeId) => {
      setFavorites((prev) =>
          prev.includes(recipeId)
              ? prev.filter((id) => id !== recipeId)
              : [...prev, recipeId]
      );
  }, []);

  const isFavorite = useCallback(
      (recipeId: RecipeId) => favorites.includes(recipeId),
      [favorites]
  );

  return (
      <FavoritesContext.Provider
          value={{ favorites, toggleFavorite, isFavorite }}
      >
          {children}
      </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
      throw new Error("useFavorites må brukes inni en FavoritesProvider");
  }
  return context;
}