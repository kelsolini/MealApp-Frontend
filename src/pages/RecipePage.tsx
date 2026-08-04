import { useEffect, useContext, useMemo } from "react";
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

    const { recipes, titleRecipes, filteredRecipes, fetchRecipeByTitle, fetchRecipesByType } = useContext(RecipeContext) as IRecipeContext;

    useEffect(() => {
        if (query) fetchRecipeByTitle(query);
        else if (typeFilter) fetchRecipesByType(typeFilter);
    }, [query, typeFilter, fetchRecipeByTitle, fetchRecipesByType]);

    const displayedRecipes = useMemo(() => {
        if (query) return titleRecipes;
        if (typeFilter) return filteredRecipes;
        if (categoryFilter) return recipes.filter(r => r.category.toLowerCase() === categoryFilter.toLowerCase());
        if (cuisineFilter) return recipes.filter(r => r.cuisine?.toLowerCase() === cuisineFilter.toLowerCase());
        return recipes;
    }, [query, typeFilter, categoryFilter, cuisineFilter, recipes, titleRecipes, filteredRecipes]);

    const filterLabel = query
        ? `«${query}»`
        : typeFilter ?? categoryFilter ?? cuisineFilter ?? null;

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