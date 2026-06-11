import { useContext, useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";
import { RecipeContext } from "../../contexts/RecipeContext";
import type { IRecipe } from "../../interfaces/Recipe/IRecipe";
import type { WeekDay } from "../../contexts/WeekPlanContext";
import { getImageUrl } from "../../config";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    day: WeekDay | null;
    onSelect: (day: WeekDay, recipe: IRecipe) => void;
}

const RecipePickerModal = ({ isOpen, onClose, day, onSelect }: Props) => {
    const ctx = useContext(RecipeContext);
    const [search, setSearch] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = "recipe-picker-title";

    const recipes = ctx?.recipes ?? [];
    const filtered = search.trim()
        ? recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
        : recipes;

    useEffect(() => {
        if (!isOpen) return;
        setSearch("");
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen || !day) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
            aria-hidden="true"
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
                    <h2 id={titleId} className="text-xl font-serif text-stone-900 capitalize">
                        Velg oppskrift for {day}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Lukk dialog"
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-stone-600" />
                    </button>
                </div>

                {/* Søk */}
                <div className="px-6 py-3 border-b border-stone-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" aria-hidden="true" />
                        <input
                            type="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Søk etter oppskrift..."
                            aria-label="Søk etter oppskrift"
                            autoFocus
                            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                        />
                    </div>
                </div>

                {/* Oppskriftsliste */}
                <div className="flex-1 overflow-y-auto p-4">
                    {filtered.length === 0 ? (
                        <p className="text-center text-stone-400 py-10">Ingen oppskrifter funnet</p>
                    ) : (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3" aria-label="Tilgjengelige oppskrifter">
                            {filtered.map(recipe => (
                                <li key={recipe.id}>
                                    <button
                                        onClick={() => { onSelect(day, recipe); onClose(); }}
                                        aria-label={`Velg ${recipe.title}`}
                                        className="w-full text-left rounded-xl overflow-hidden border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all group"
                                    >
                                        <div className="aspect-video bg-stone-100 overflow-hidden">
                                            {recipe.image ? (
                                                <img
                                                    src={getImageUrl(recipe.image)}
                                                    alt={recipe.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-200 text-3xl">🍽</div>
                                            )}
                                        </div>
                                        <div className="p-2">
                                            <p className="text-sm font-medium text-stone-800 line-clamp-2 min-h-[2.5rem]">{recipe.title}</p>
                                            <p className="text-xs text-stone-400 capitalize">{recipe.type}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipePickerModal;
