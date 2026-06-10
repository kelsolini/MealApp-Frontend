import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { IRecipe } from "../../interfaces/Recipe/IRecipe";
import { RecipeContext } from "../../contexts/RecipeContext";
import type { IRecipeContext } from "../../interfaces/Context/IRecipeContext";
import { API_URL } from "../../config";

const scale = (value: number, factor: number) =>
    Math.round(value * factor * 10) / 10;

const RecipeItem = ({ recipe }: { recipe: IRecipe }) => {
    const [portions, setPortions] = useState<number | "">(recipe.portions);
    const [editing, setEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { deleteRecipe } = useContext(RecipeContext) as IRecipeContext;

    const handleDelete = async () => {
        await deleteRecipe(recipe.id);
    };

    const factor = portions ? portions / recipe.portions : 1;

    const handlePortionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (raw === "") return setPortions("");
        const val = Number(raw);
        if (val >= 1) setPortions(val);
    };

    const stopEditing = () => {
        if (!portions) setPortions(recipe.portions);
        setEditing(false);
    };

    return (
        <article className="bg-white border border-gray-200 rounded-lg p-6">
            {recipe.image && (
                <img
                    src={`${API_URL}/images-recipe/${recipe.image}`}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
            )}

            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                    <button
                        onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
                        className="text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                    >
                        Rediger
                    </button>
                    {confirmDelete ? (
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Sikker?</span>
                            <button
                                onClick={handleDelete}
                                className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors"
                            >
                                Ja
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                            >
                                Avbryt
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="text-xs text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                        >
                            Slett
                        </button>
                    )}
                </div>

                {editing ? (
                    <input
                        ref={inputRef}
                        type="number"
                        min={1}
                        value={portions}
                        onChange={handlePortionChange}
                        onBlur={stopEditing}
                        onKeyDown={(e) => e.key === "Enter" && stopEditing()}
                        autoFocus
                        className="w-20 text-sm text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors cursor-pointer"
                        title="Klikk for å endre porsjoner"
                    >
                        {portions} porsjoner
                    </button>
                )}
            </div>

            <div className="flex gap-2 mb-4">
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{recipe.type}</span>
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{recipe.category}</span>
                {recipe.cuisine && (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{recipe.cuisine}</span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Ingredienser</h3>
                    <ul className="space-y-1">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-sm text-gray-600">
                                {scale(ingredient.amount, factor)} {ingredient.unit} {ingredient.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Fremgangsmåte</h3>
                    <ol className="space-y-2">
                        {recipe.method.map((step, index) => (
                            <li key={index} className="text-sm text-gray-600 flex gap-2">
                                <span className="font-medium text-gray-400 shrink-0">{index + 1}.</span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {recipe.nutrition && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-2 text-center">
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{Math.round(recipe.nutrition.calories * factor)}</p>
                        <p className="text-xs text-gray-500">kcal</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{scale(recipe.nutrition.protein, factor)}g</p>
                        <p className="text-xs text-gray-500">protein</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{scale(recipe.nutrition.carbs, factor)}g</p>
                        <p className="text-xs text-gray-500">karbo</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{scale(recipe.nutrition.fat, factor)}g</p>
                        <p className="text-xs text-gray-500">fett</p>
                    </div>
                </div>
            )}
        </article>
    );
}

export default RecipeItem;