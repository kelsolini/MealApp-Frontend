import type { IRecipe } from "../Recipe/IRecipe";
import type { IDefaultResponse, IRecipeListResponse, IRecipeSingleResponse } from "../Response/ResponseInterfaces";

export interface IRecipeContext {
    recipes: IRecipe[];
    idRecipe: IRecipe | null;
    titleRecipes: IRecipe[] | [];
    filteredRecipes: IRecipe[];
    fetchRecipeById: (id: number) => Promise<IRecipeSingleResponse>;
    fetchRecipeByTitle: (title: string) => Promise<IRecipeListResponse>;
    fetchRecipesByType: (type: string) => Promise<IRecipeListResponse>;
    fetchRecipesByCategory: (category: string) => Promise<IRecipeListResponse>;
    putRecipe: (editedRecipe: IRecipe, image: File | null) => Promise<IDefaultResponse>;
    saveRecipe: (newRecipe: IRecipe, image: File | null) => Promise<IDefaultResponse>;
    deleteRecipe: (id: number) => Promise<IDefaultResponse>;
}