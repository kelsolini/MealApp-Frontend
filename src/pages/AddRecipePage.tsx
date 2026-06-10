import { useContext } from "react";
import { RecipeContext } from "../contexts/RecipeContext";
import type { IRecipeContext } from "../interfaces/Context/IRecipeContext";
import RecipeForm from "../components/Recipe/RecipeForm";

const AddRecipePage = () => {
    const { saveRecipe } = useContext(RecipeContext) as IRecipeContext;

    return (
        <main className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Legg til oppskrift</h1>
            <section className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
                <RecipeForm onSubmit={saveRecipe} submitLabel="Lagre oppskrift" />
            </section>
        </main>
    );
};

export default AddRecipePage;
