import { createContext, useContext } from "react";
import type { RecipeId } from "../service/favoritesStorage";

export interface FavoritesContextValue {
  favorites: RecipeId[];
  toggleFavorite: (recipeId: RecipeId) => void;
  isFavorite: (recipeId: RecipeId) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
      throw new Error("useFavorites må brukes inni en FavoritesProvider");
  }
  return context;
}
