import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RecipeContext } from "../contexts/RecipeContext";
import type { IRecipeContext } from "../interfaces/Context/IRecipeContext";
import type { IRecipe } from "../interfaces/Recipe/IRecipe";
import RecipeForm from "../components/Recipe/RecipeForm";

const AddRecipePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { saveRecipe } = useContext(RecipeContext) as IRecipeContext;
    const draft = (location.state as { draft?: IRecipe } | null)?.draft;

    const handleSubmit = async (recipe: IRecipe, image: File | null) => {
        const response = await saveRecipe(recipe, image);
        if (response.success) navigate("/");
        return response;
    };

    return (
        <main className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Legg til oppskrift</h1>
            <section className="bg-surface rounded-lg shadow p-6 max-w-2xl mx-auto">
                <RecipeForm initialData={draft} onSubmit={handleSubmit} submitLabel="Lagre oppskrift" />
            </section>
        </main>
    );
};

export default AddRecipePage;
