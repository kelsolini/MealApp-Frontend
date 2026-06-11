import { useContext } from "react";
import RecipeList from '../components/Recipe/RecipeList';
import { RecipeContext } from "../contexts/RecipeContext";
import type { IRecipeContext } from "../interfaces/Context/IRecipeContext";
import FavoritesList from "../components/Recipe/FavoritesList";

const HomePage = () => {
    const { recipes } = useContext(RecipeContext) as IRecipeContext;

    return (
        <main className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-12">
                <FavoritesList recipes={recipes} />
                <div className="mt-6">
                    <RecipeList recipes={recipes} />
                </div>
            </div>
        </main>
    );
}

export default HomePage;