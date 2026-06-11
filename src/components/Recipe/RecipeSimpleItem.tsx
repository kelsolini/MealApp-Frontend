import { Link } from "react-router-dom";
import type { IRecipe } from "../../interfaces/Recipe/IRecipe";
import { FavoriteButton } from "./FavoriteButton"; // juster stien til der filen faktisk ligger
import { getImageUrl } from "../../config";

interface RecipeItemProps {
    recipe: IRecipe;
}

const RecipeSimpleItem = ({ recipe }: RecipeItemProps) => {
    return (
        <Link to={`/oppskrifter/${recipe.id}`} className="block group max-w-sm w-full mx-auto">
            <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 transition-all hover:shadow-md hover:-translate-y-0.5">
                {/* Bilde */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={getImageUrl(recipe.image)}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-101"
                    />
                    <FavoriteButton recipeId={recipe.id} className="absolute top-3 right-3" />
                </div>

                {/* Innhold */}
                <div className="p-4">
                    <h3 className="text-xl font-serif font-semibold text-stone-900 line-clamp-2 min-h-[3.5rem]">
                        {recipe.title}
                    </h3>
                </div>
            </article>
        </Link>
    );
};

export default RecipeSimpleItem;