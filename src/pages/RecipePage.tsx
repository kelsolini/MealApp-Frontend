import { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeList from "../components/Recipe/RecipeList";
import { RecipeContext } from "../contexts/RecipeContext";
import type { IRecipeContext } from "../interfaces/Context/IRecipeContext";

const RecipePage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const typeFilter = searchParams.get("type");
    const categoryFilter = searchParams.get("category");
    const cuisineFilter = searchParams.get("cuisine");

    const { recipes, titleRecipes, filteredRecipes, fetchRecipeByTitle, fetchRecipesByType, fetchRecipesByCategory, fetchRecipesByCuisine } = useContext(RecipeContext) as IRecipeContext;

    useEffect(() => {
        if (query) fetchRecipeByTitle(query);
        else if (typeFilter) fetchRecipesByType(typeFilter);
        else if (categoryFilter) fetchRecipesByCategory(categoryFilter);
        else if (cuisineFilter) fetchRecipesByCuisine(cuisineFilter);
    }, [query, typeFilter, categoryFilter, cuisineFilter]);

    let displayedRecipes = recipes;
    let filterLabel: string | null = null;

    if (query) { displayedRecipes = titleRecipes; filterLabel = `«${query}»`; }
    else if (typeFilter) { displayedRecipes = filteredRecipes; filterLabel = typeFilter; }
    else if (categoryFilter) { displayedRecipes = filteredRecipes; filterLabel = categoryFilter; }
    else if (cuisineFilter) { displayedRecipes = filteredRecipes; filterLabel = cuisineFilter; }

    return (
        <main className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-12">
                {filterLabel && (
                    <p className="text-sm text-stone-500 mb-4">
                        {displayedRecipes.length} treff for {filterLabel}
                    </p>
                )}
                <RecipeList recipes={displayedRecipes} />
            </div>
        </main>
    );
}

export default RecipePage;