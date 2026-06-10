// src/components/Recipe/FavoritesList.tsx
import { Heart } from "lucide-react";
import type { IRecipe } from "../../interfaces/Recipe/IRecipe";
import { useFavorites } from "../../contexts/FavoritesContext";
import RecipeSimpleItem from "../Recipe/RecipeSimpleItem";

interface FavoritesListProps {
    recipes: IRecipe[];
}

const FavoritesList = ({ recipes }: FavoritesListProps) => {
    const { favorites } = useFavorites();

    const favoriteRecipes = recipes.filter((recipe) =>
        favorites.includes(recipe.id)
    );

    if (favoriteRecipes.length === 0) {
        return (
            <div className="text-center py-16">
                <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 font-serif text-lg">
                    Du har ingen favoritter ennå.
                </p>
            </div>
        );
    }

    return (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
                <RecipeSimpleItem key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
};

export default FavoritesList;