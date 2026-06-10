import { useState, useEffect } from "react";
import { Trash2, Plus, ShoppingBasket } from "lucide-react";
import { useWeekPlan, DAYS, type WeekDay } from "../contexts/WeekPlanContext";
import { useShoppingList } from "../contexts/ShoppingListContext";
import RecipePickerModal from "../components/WeekPlan/RecipePickerModal";
import type { IRecipe } from "../interfaces/Recipe/IRecipe";

const SHORT: Record<WeekDay, string> = {
    mandag: "Man", tirsdag: "Tir", onsdag: "Ons",
    torsdag: "Tor", fredag: "Fre", lørdag: "Lør", søndag: "Søn",
};

const WeekPlanPage = () => {
    const { weekPlan, setDayRecipe, removeDayRecipe } = useWeekPlan();
    const { addItems } = useShoppingList();
    const [pickerDay, setPickerDay] = useState<WeekDay | null>(null);
    const [addedFeedback, setAddedFeedback] = useState(false);

    const plannedCount = DAYS.filter(d => weekPlan[d]).length;

    useEffect(() => {
        setAddedFeedback(false);
    }, [weekPlan]);

    const handleAddAllToShoppingList = () => {
        const allIngredients = DAYS.flatMap(day =>
            weekPlan[day]?.ingredients.map(ing => ({
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit,
            })) ?? []
        );
        addItems(allIngredients);
        setAddedFeedback(true);
    };

    const handleSelect = (day: WeekDay, recipe: IRecipe) => setDayRecipe(day, recipe);

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-serif text-stone-900">Ukesplan</h1>
                {plannedCount > 0 && (
                    <button
                        onClick={handleAddAllToShoppingList}
                        aria-label={`Legg ingredienser for ${plannedCount} retter i handlelisten`}
                        className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg text-white font-light transition-colors whitespace-nowrap ${
                            addedFeedback
                                ? "bg-green-700 text-white"
                                : "bg-[#4c0000] text-white hover:bg-[#6a1a14]"
                        }`}
                    >
                    <ShoppingBasket className="w-4 h-4" aria-hidden="true" />
                    {addedFeedback
                        ? "Lagt til i handlelisten!"
                        : `Legg til alle ingredienser (${plannedCount} retter)`}
                </button>
                )}
            </div>

            {/* 7-dagers grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {DAYS.map(day => {
                    const recipe = weekPlan[day];
                    return (
                        <article
                            key={day}
                            aria-label={`${day}${recipe ? `: ${recipe.title}` : ": ingen rett planlagt"}`}
                            className="flex flex-col rounded-2xl border border-stone-200 overflow-hidden bg-white min-h-48"
                        >
                            {/* Dag-header */}
                            <div className="px-3 py-2 bg-stone-50 border-b border-stone-100 flex-shrink-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                                    {SHORT[day]}
                                </p>
                                <p className="text-xs text-stone-400 capitalize hidden sm:block">{day}</p>
                            </div>

                            {recipe ? (
                                <div className="flex flex-col flex-1">
                                    <div className="aspect-video bg-stone-100 overflow-hidden flex-shrink-0">
                                        {recipe.image ? (
                                            <img
                                                src={`http://localhost:5149/images-recipe/${recipe.image}`}
                                                alt={recipe.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl text-stone-200">
                                                🍽
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 px-3 py-2">
                                        <p className="text-sm font-medium text-stone-800 leading-snug line-clamp-2">
                                            {recipe.title}
                                        </p>
                                        <p className="text-xs text-stone-400 mt-0.5 capitalize">{recipe.type}</p>
                                    </div>
                                    <div className="flex gap-1 px-2 pb-2 flex-shrink-0">
                                        <button
                                            onClick={() => setPickerDay(day)}
                                            aria-label={`Bytt oppskrift for ${day}`}
                                            className="flex-1 text-xs py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-500 transition-colors"
                                        >
                                            Bytt
                                        </button>
                                        <button
                                            onClick={() => removeDayRecipe(day)}
                                            aria-label={`Fjern oppskrift fra ${day}`}
                                            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-stone-300 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setPickerDay(day)}
                                    aria-label={`Legg til oppskrift for ${day}`}
                                    className="flex-1 flex flex-col items-center justify-center gap-2 py-6 text-stone-300 hover:text-stone-500 hover:bg-stone-50 transition-colors"
                                >
                                    <Plus className="w-6 h-6" aria-hidden="true" />
                                    <span className="text-xs">Legg til</span>
                                </button>
                            )}
                        </article>
                    );
                })}
            </div>

            {plannedCount === 0 && (
                <p className="text-center text-stone-400 mt-12 text-sm">
                    Ingen retter planlagt. Klikk på en dag for å legge til en oppskrift.
                </p>
            )}

            <RecipePickerModal
                isOpen={pickerDay !== null}
                onClose={() => setPickerDay(null)}
                day={pickerDay}
                onSelect={handleSelect}
            />
        </main>
    );
};

export default WeekPlanPage;
