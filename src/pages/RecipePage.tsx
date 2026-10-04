import { useEffect, useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import RecipeList from "../components/Recipe/RecipeList";
import { RecipeContext } from "../contexts/RecipeContext";
import type { IRecipeContext } from "../interfaces/Context/IRecipeContext";

const RecipePage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const typeFilter = searchParams.get("type");
    const categoryFilter = searchParams.get("category");
    const cuisineFilter = searchParams.get("cuisine");

    const { recipes, titleRecipes, filteredRecipes, loadingRecipes, loadingFiltered, fetchRecipeByTitle, fetchRecipesByType } = useContext(RecipeContext) as IRecipeContext;
    const [isSlow, setIsSlow] = useState(false);

    const isLoading = loadingRecipes || loadingFiltered;

    useEffect(() => {
        if (query) fetchRecipeByTitle(query);
        else if (typeFilter) fetchRecipesByType(typeFilter);
    }, [query, typeFilter, fetchRecipeByTitle, fetchRecipesByType]);

    useEffect(() => {
        if (!isLoading) {
            setIsSlow(false);
            return;
        }

        const timer = setTimeout(() => setIsSlow(true), 3000);
        return () => clearTimeout(timer);
    }, [isLoading]);

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

    if (isLoading) return (
        <main className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-12 flex flex-col items-center justify-center gap-2 py-12">
                <Loader2 className="animate-spin text-gray-500" size={32} />
                <p className="text-gray-500">Laster oppskrifter...</p>
                {isSlow && (
                    <p className="text-sm text-gray-400">
                        Serveren våkner fra dvale, dette kan ta opptil et minutt.
                    </p>
                )}
            </div>
        </main>
    );

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