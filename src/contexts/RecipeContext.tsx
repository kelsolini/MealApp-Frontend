import { useState, useEffect, type ReactNode, createContext } from "react";
import type { IRecipe } from "../interfaces/Recipe/IRecipe";
import type { IRecipeContext } from "../interfaces/Context/IRecipeContext";
import type { IRecipeSingleResponse, IDefaultResponse, IRecipeListResponse } from "../interfaces/Response/ResponseInterfaces";
import recipeService from "../service/RecipeService";

// eslint-disable-next-line react-refresh/only-export-components
export const RecipeContext = createContext<IRecipeContext | null>(null);

interface Props { 
    children: ReactNode 
}

export const RecipeProvider = ({ children }: Props) => {
    const [recipes, setRecipes] = useState<IRecipe[]>([]);
    const [idRecipe, setIdRecipe] = useState<IRecipe | null>(null);
    const [titleRecipes, setTitleRecipes] = useState<IRecipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<IRecipe[]>([]);

    useEffect(() => {
        recipeService.getAllRecipes().then(response => {
            if (response.success && response.data) {
                setRecipes(response.data);
            } else {
                console.error("Error when trying to get [recipes] from service");
            }
        });
    }, [])

    /* GET BY ID */
    const fetchRecipeById = async (id: number): Promise<IRecipeSingleResponse> => {
        const response = await recipeService.getRecipeById(id);
        if (response.success && response.data) {
            setIdRecipe(response.data);
            return { success: true, data: response.data }
        } else {
            return { success: false, data: null }
        }
    }
    /* GET RECIPE ON TITLE */
    const fetchRecipeByTitle = async (title: string) : Promise<IRecipeListResponse> => {
        const response = await recipeService.getRecipeByTitle(title);
        if(response.success && response.data){
            setTitleRecipes(response.data);
            return { success: true, data: response.data }
        } else {
            return { success: false, data: null }
        }
    }

    /* GET RECIPES BY TYPE */
    const fetchRecipesByType = async (type: string): Promise<IRecipeListResponse> => {
        const response = await recipeService.getRecipesByType(type);
        if (response.success && response.data) {
            setFilteredRecipes(response.data);
            return { success: true, data: response.data }
        } else {
            return { success: false, data: null }
        }
    }

    /* PUT RECIPE */
    const putRecipe = async (editedRecipe: IRecipe, image: File | null): Promise<IDefaultResponse> => {
        try {
            const response = await recipeService.putRecipe(editedRecipe, image);
            if (response.success && response.data) {
                setRecipes(prev =>
                    prev.map(r => r.id === editedRecipe.id ? response.data : r)
                );
            }
            return response;
        } catch {
            return { success: false };
        }
    }

    /* POST RECIPE */
    const saveRecipe = async (newRecipe: IRecipe, image: File | null): Promise<IDefaultResponse> => {
        const response = await recipeService.postRecipe(newRecipe, image);
        if (response.success && response.data) {
            setRecipes(prev => [...prev, response.data]);
        }
        return response;
    }

    /* DELETE RECIPE */
    const deleteRecipe = async (id: number): Promise<IDefaultResponse> => {
        const response = await recipeService.deleteRecipe(id);
        if (response.success) {
            setRecipes(prev => prev.filter(r => r.id !== id));
        }
        return response;
    }

    return (
        <RecipeContext.Provider value={{
            recipes,
            idRecipe,
            fetchRecipeById,
            fetchRecipeByTitle,
            fetchRecipesByType,
            titleRecipes,
            filteredRecipes,
            putRecipe,
            saveRecipe,
            deleteRecipe
        }}>
            {children}
        </RecipeContext.Provider>
    );
}