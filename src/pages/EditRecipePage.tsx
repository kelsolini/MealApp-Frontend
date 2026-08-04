import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecipeContext } from "../contexts/RecipeContext";
import type { IRecipeContext } from "../interfaces/Context/IRecipeContext";
import type { IRecipe } from "../interfaces/Recipe/IRecipe";
import RecipeForm from "../components/Recipe/RecipeForm";

const EditRecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchRecipeById, putRecipe } = useContext(RecipeContext) as IRecipeContext;
    const [recipe, setRecipe] = useState<IRecipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetchRecipeById(Number(id)).then(response => {
            if (response.success && response.data) setRecipe(response.data);
            setLoading(false);
        });
    }, [id, fetchRecipeById]);

    const handleSubmit = async (updatedRecipe: IRecipe, image: File | null) => {
        const response = await putRecipe(updatedRecipe, image);
        if (response.success) navigate("/");
        return response;
    };

    if (loading) return (
        <main className="max-w-4xl mx-auto px-6 py-8">
            <p className="text-gray-500">Laster oppskrift...</p>
        </main>
    );

    if (!recipe) return (
        <main className="max-w-4xl mx-auto px-6 py-8">
            <p className="text-red-500">Oppskrift ikke funnet.</p>
        </main>
    );

    return (
        <main className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Rediger oppskrift</h1>
            <section className="bg-surface rounded-lg shadow p-6 max-w-2xl mx-auto">
                <RecipeForm initialData={recipe} onSubmit={handleSubmit} submitLabel="Oppdater oppskrift" />
            </section>
        </main>
    );
};

export default EditRecipePage;
