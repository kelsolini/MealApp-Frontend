import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { RecipeContext } from "../contexts/RecipeContext";
import type { IRecipeContext } from "../interfaces/Context/IRecipeContext";
import RecipeDetailItem from "../components/Recipe/RecipeDetailItem";

const RecipeDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { idRecipe, fetchRecipeById } = useContext(RecipeContext) as IRecipeContext;
    const numericId = id ? Number(id) : null;

    useEffect(() => {
        if (numericId === null) return;
        fetchRecipeById(numericId);
    }, [numericId, fetchRecipeById]);

    if (numericId === null || idRecipe?.id !== numericId) return <p className="p-8 text-stone-500">Laster oppskrift...</p>;

    return (
        <main className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-12">
                <RecipeDetailItem recipe={idRecipe} />
            </div>
        </main>
    );
};

export default RecipeDetailPage;
