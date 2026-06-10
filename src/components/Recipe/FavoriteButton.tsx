// FavoriteButton.tsx
import { Heart } from "lucide-react";
import { useFavorites } from "../../contexts/FavoritesContext";
import type { RecipeId } from "../../service/favoritesStorage";

interface FavoriteButtonProps {
    recipeId: RecipeId;
    className?: string;
}

export function FavoriteButton({ recipeId, className = "" }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const active = isFavorite(recipeId);

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(recipeId);
            }}
            aria-pressed={active}
            aria-label={active ? "Fjern fra favoritter" : "Legg til favoritter"}
            className={`bg-white rounded-full p-2 shadow-md hover:bg-stone-50 ${className}`}
        >
            <Heart
                className={`w-4 h-4 ${active ? "fill-red-500 text-red-500" : "text-stone-700"}`}
            />
        </button>
    );
}