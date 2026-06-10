import RecipeSimpleItem from "./RecipeSimpleItem";
import type { IRecipe } from "../../interfaces/Recipe/IRecipe";

const RecipeList = ({ recipes }: { recipes: IRecipe[] }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map(recipe => (
                <RecipeSimpleItem key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
};

export default RecipeList;