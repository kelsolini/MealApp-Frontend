import {
    Pencil, Users, ChevronRight,
    ShoppingCart, Calendar
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { IRecipe } from "../../interfaces/Recipe/IRecipe";
import { FavoriteButton } from "./FavoriteButton";
import ShoppingListModal from "./ShoppingListModal";
import { useWeekPlan, DAYS, type WeekDay } from "../../contexts/WeekPlanContext";
import { API_URL } from "../../config";

interface RecipeDetailItemProps {
    recipe: IRecipe;
}

const scale = (value: number, factor: number) =>
    Math.round(value * factor * 10) / 10;

const RecipeDetailItem = ({ recipe }: RecipeDetailItemProps) => {
    const [portions, setPortions] = useState<number | "">(recipe.portions);
    const [editing, setEditing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [weekplanOpen, setWeekplanOpen] = useState(false);
    const [weekplanFeedback, setWeekplanFeedback] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const weekplanRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { setDayRecipe } = useWeekPlan();

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

    // Lukk dag-dropdown ved klikk utenfor
    useEffect(() => {
        if (!weekplanOpen) return;
        const handler = (e: MouseEvent) => {
            if (weekplanRef.current && !weekplanRef.current.contains(e.target as Node)) {
                setWeekplanOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [weekplanOpen]);

    const handleDaySelect = (day: WeekDay) => {
        setDayRecipe(day, recipe);
        setWeekplanOpen(false);
        setWeekplanFeedback(day);
        setTimeout(() => setWeekplanFeedback(null), 2500);
    };

    const scaledIngredients = recipe.ingredients.map(ing => ({
        name: ing.name,
        amount: scale(ing.amount, factor),
        unit: ing.unit,
    }));

    return (
        <div className="space-y-6">
            {/* Breadcrumb + handlinger */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <nav aria-label="Brødsmulesti" className="flex items-center gap-2 text-sm text-stone-600">
                    <Link to="/recipes" className="hover:text-stone-900">Oppskrifter</Link>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    <span className="text-stone-900">{recipe.title}</span>
                </nav>
                <div className="flex items-center gap-4 text-sm text-stone-600">
                    <button
                        onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
                        className="flex items-center gap-2 hover:text-stone-900"
                    >
                        <Pencil className="w-4 h-4" aria-hidden="true" /> Rediger
                    </button>
                </div>
            </div>

            {/* Hovedlayout: bilde + innhold */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bilde */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-200">
                    {recipe.image && (
                        <img
                            src={`${API_URL}/images-recipe/${recipe.image}`}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <FavoriteButton recipeId={recipe.id} className="absolute top-3 right-3" />
                </div>

                {/* Innhold */}
                <div className="space-y-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2" aria-label="Kategorier">
                        <Link
                            to={`/recipes?type=${encodeURIComponent(recipe.type)}`}
                            className="px-3 py-1 bg-stone-100 rounded-full text-sm flex items-center gap-2 hover:bg-stone-200 transition-colors"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-700" aria-hidden="true"></span>
                            {recipe.type}
                        </Link>
                        <Link
                            to={`/recipes?category=${encodeURIComponent(recipe.category)}`}
                            className="px-3 py-1 bg-stone-100 rounded-full text-sm hover:bg-stone-200 transition-colors"
                        >
                            {recipe.category}
                        </Link>
                        {recipe.cuisine && (
                            <Link
                                to={`/recipes?type=${encodeURIComponent(recipe.cuisine)}`}
                                className="px-3 py-1 bg-stone-100 rounded-full text-sm hover:bg-stone-200 transition-colors"
                            >
                                {recipe.cuisine}
                            </Link>
                        )}
                    </div>

                    {/* Tittel */}
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
                        {recipe.title}
                    </h1>

                    {/* Beskrivelse */}
                    {recipe.description && (
                        <p className="text-stone-600 leading-relaxed">{recipe.description}</p>
                    )}

                    {/* Porsjoner */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 inline-block">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 mb-2">
                            <Users className="w-3 h-3" aria-hidden="true" />
                            <span>Porsjoner</span>
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
                                aria-label="Endre antall porsjoner"
                                className="w-16 font-serif text-xl text-stone-900 border border-stone-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
                            />
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="font-serif text-xl text-stone-900 hover:text-red-900 transition-colors cursor-pointer"
                                aria-label={`${portions} porsjoner, klikk for å endre`}
                            >
                                {portions}
                            </button>
                        )}
                    </div>

                    {/* Handlingsknapper */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setModalOpen(true)}
                            aria-label="Legg ingredienser til handlelisten"
                            className="flex items-center gap-2 px-6 py-3 border border-stone-300 rounded-full hover:bg-stone-50 transition-colors"
                        >
                            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                            Legg til i handleliste
                        </button>

                        {/* Ukesplan dag-velger */}
                        <div className="relative" ref={weekplanRef}>
                            <button
                                onClick={() => setWeekplanOpen(o => !o)}
                                aria-expanded={weekplanOpen}
                                aria-haspopup="listbox"
                                aria-label="Legg til i ukesplan"
                                className={`flex items-center gap-2 px-6 py-3 border rounded-full transition-colors ${
                                    weekplanFeedback
                                        ? "border-green-600 text-green-700 bg-green-50"
                                        : "border-stone-300 hover:bg-stone-50"
                                }`}
                            >
                                <Calendar className="w-4 h-4" aria-hidden="true" />
                                {weekplanFeedback ? `Lagt til ${weekplanFeedback}!` : "Ukesplan"}
                            </button>

                            {weekplanOpen && (
                                <ul
                                    role="listbox"
                                    aria-label="Velg dag i ukesplanen"
                                    className="absolute left-0 top-full mt-2 z-20 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden min-w-36"
                                >
                                    {DAYS.map(day => (
                                        <li key={day}>
                                            <button
                                                role="option"
                                                aria-selected={false}
                                                onClick={() => handleDaySelect(day)}
                                                className="w-full text-left px-4 py-2.5 text-sm capitalize text-stone-700 hover:bg-stone-50 transition-colors"
                                            >
                                                {day}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingredienser + Fremgangsmåte */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-serif text-stone-900 mb-4">Ingredienser</h2>
                    <ul className="space-y-2" aria-label="Ingredienser">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex justify-between items-center py-2 border-b border-stone-100">
                                <span className="text-stone-800">{ing.name}</span>
                                <span className="text-stone-500 text-sm">
                                    {scale(ing.amount, factor)} {ing.unit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-serif text-stone-900 mb-4">Fremgangsmåte</h2>
                    <ol className="space-y-4" aria-label="Fremgangsmåte">
                        {recipe.method.map((step, i) => (
                            <li key={i} className="flex gap-4">
                                <span
                                    className="flex-shrink-0 w-7 h-7 rounded-full bg-red-900 text-white text-sm flex items-center justify-center font-serif"
                                    aria-hidden="true"
                                >
                                    {i + 1}
                                </span>
                                <p className="text-stone-700 leading-relaxed">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <ShoppingListModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                ingredients={scaledIngredients}
                recipeName={recipe.title}
            />
        </div>
    );
};

export default RecipeDetailItem;
