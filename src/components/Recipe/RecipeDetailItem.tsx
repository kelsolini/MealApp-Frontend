import {
  Pencil,
  Users,
  ChevronRight,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { IRecipe } from "../../interfaces/Recipe/IRecipe";
import { FavoriteButton } from "./FavoriteButton";
import ShoppingListModal from "./ShoppingListModal";
import {
  useWeekPlan,
  DAYS,
  type WeekDay,
} from "../../contexts/WeekPlanContext";
import { getImageUrl } from "../../config";

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
      if (
        weekplanRef.current &&
        !weekplanRef.current.contains(e.target as Node)
      ) {
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

  const scaledIngredients = recipe.ingredients.map((ing) => ({
    name: ing.name,
    amount: scale(ing.amount, factor),
    unit: ing.unit,
  }));

  return (
    <div className="space-y-6">
      {/* Breadcrumb + handlinger */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav
          aria-label="Brødsmulesti"
          className="flex items-center gap-2 text-sm text-stone-600"
        >
          <Link to="/recipes" className="hover:text-stone-900">
            Oppskrifter
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-stone-900">{recipe.title}</span>
        </nav>
        <div className="flex items-center gap-4 text-sm text-stone-600">
          <button
            onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
            className="text-ink flex items-center gap-2 hover:text-mahogany"
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
              src={getImageUrl(recipe.image)}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          )}
          <FavoriteButton
            recipeId={recipe.id}
            className="absolute top-3 right-3"
          />
        </div>

        {/* Innhold */}
        <div className="space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2" aria-label="Kategorier">
            <Link
              to={`/recipes?type=${encodeURIComponent(recipe.type)}`}
              className="text-ink border border-mahogany px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-mahogany hover:text-surface transition-colors"
            >
              {recipe.type}
            </Link>
            <Link
              to={`/recipes?category=${encodeURIComponent(recipe.category)}`}
              className="text-ink border border-mahogany px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-mahogany hover:text-surface transition-colors"
            >
              {recipe.category}
            </Link>
            {recipe.cuisine && (
              <Link
                to={`/recipes?cuisine=${encodeURIComponent(recipe.cuisine)}`}
                className="text-ink border border-mahogany px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-mahogany hover:text-surface transition-colors"
              >
                {recipe.cuisine}
              </Link>
            )}
          </div>

          {/* Tittel */}
          <h1 className="color-ink text-4xl md:text-5xl font-serif leading-tight">
            {recipe.title}
          </h1>

          {/* Beskrivelse */}
          {recipe.description && (
            <p className="color-ink leading-relaxed">{recipe.description}</p>
          )}

          {/* Porsjoner */}
          <div className="bg-surface rounded-2xl p-6 inline-block">
            <div className="text-ink flex items-center gap-2 text-xs uppercase tracking-wider">
              <Users className="w-3 h-3" aria-hidden="true" />
              <span>Porsjoner</span>
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
                  className="text-ink w-16 font-serif text-xl normal-case tracking-normal border border-stone-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
                />
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="text-ink font-serif text-xl normal-case tracking-normal hover:text-mahogany transition-colors cursor-pointer"
                  aria-label={`${portions} porsjoner, klikk for å endre`}
                >
                  {portions}
                </button>
              )}
            </div>
          </div>

          {/* Handlingsknapper */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setModalOpen(true)}
              aria-label="Legg ingredienser til handlelisten"
              className="text-ink flex items-center gap-2 px-4 py-2 text-sm border border-mahogany rounded-full hover:bg-mahogany hover:text-surface transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
              Legg til i handleliste
            </button>

            {/* Ukesplan dag-velger */}
            <div className="relative" ref={weekplanRef}>
              <button
                onClick={() => setWeekplanOpen((o) => !o)}
                aria-expanded={weekplanOpen}
                aria-haspopup="listbox"
                aria-label="Legg til i ukesplan"
                className={`text-ink flex items-center gap-2 px-4 py-2 text-sm border rounded-full transition-colors hover:bg-mahogany hover:text-surface ${
                  weekplanFeedback
                    ? "border-green-600 text-green-700 bg-green-50"
                    : "border-mahogany hover:bg-mahogany hover:text-surface"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {weekplanFeedback
                  ? `Lagt til ${weekplanFeedback}!`
                  : "Ukesplan"}
              </button>

              {weekplanOpen && (
                <ul
                  role="listbox"
                  aria-label="Velg dag i ukesplanen"
                  className="absolute left-0 top-full mt-2 z-20 bg-surface border border-stone-200 rounded-xl shadow-lg overflow-hidden min-w-36"
                >
                  {DAYS.map((day) => (
                    <li key={day}>
                      <button
                        role="option"
                        aria-selected={false}
                        onClick={() => handleDaySelect(day)}
                        className="w-full text-left px-4 py-2.5 text-sm capitalize text-ink hover:bg-mahogany hover:text-surface transition-colors"
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
          <h2 className="color-ink text-2xl font-serif mb-4">Ingredienser</h2>
          <ul className="space-y-2" aria-label="Ingredienser">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-2 border-b border-stone-100"
              >
                <span className="color-ink">{ing.name}</span>
                <span className="color-ink text-sm">
                  {scale(ing.amount, factor)} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="color-ink text-2xl font-serif mb-4">Fremgangsmåte</h2>
          <ol className="space-y-4" aria-label="Fremgangsmåte">
            {recipe.method.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-red-900 text-white text-sm flex items-center justify-center font-serif"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="color-ink leading-relaxed">{step}</p>
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
