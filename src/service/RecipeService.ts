import axios from "axios";
import type { IRecipe } from "../interfaces/Recipe/IRecipe";
import type { IIngredients } from "../interfaces/Recipe/IIngredients";
import type { IRecipeListResponse, IRecipeSingleResponse } from "../interfaces/Response/ResponseInterfaces";
import { API_URL } from "../config";

const endpoint = `${API_URL}/api/recipe`;
const endpointImageUpload = `${API_URL}/api/recipeimageupload`;

/* GET ALL RECIPES */
const getAllRecipes = async (): Promise<IRecipeListResponse> => {
    try {
        const response = await axios.get(endpoint);
        return {
            success: true,
            data: response.data
        }
    } catch {
        return {
            success: false,
            data: null
        }
    } 
}

/* GET BY ID */
const getRecipeById = async (id: number): Promise<IRecipeSingleResponse> => {
    try {
        const response = await axios.get(`${endpoint}/getbyid/${id}`);
        return {
            success: true,
            data: response.data
        }
    } catch {
        return {
            success: false,
            data: null
        }
    }
}

/* GET BY TYPE */
const getRecipesByType = async (type: string): Promise<IRecipeListResponse> => {
    try {
        const response = await axios.get(`${endpoint}/getbytype/${encodeURIComponent(type)}`);
        return { success: true, data: response.data }
    } catch {
        return { success: false, data: null }
    }
}

/* GET BY CATEGORY */
const getRecipesByCategory = async (category: string): Promise<IRecipeListResponse> => {
    try {
        const response = await axios.get(`${endpoint}/getbycategory/${encodeURIComponent(category)}`);
        return { success: true, data: response.data }
    } catch {
        return { success: false, data: null }
    }
}

/* GET BY TITLE */
const getRecipeByTitle = async (title: string): Promise<IRecipeListResponse> => {
    try {
        const response = await axios.get(`${endpoint}/getbytitle/${encodeURIComponent(title)}`);
        return {
            success: true,
            data: response.data
        }
    } catch {
        return {
            success: false,
            data: null
        }
    }
}

const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(endpointImageUpload, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data.url;
};

/* PUT RECIPE */
const putRecipe = async (editedRecipe: IRecipe, newImage: File | null) => {
    try {
        const recipeToSave = newImage
            ? { ...editedRecipe, image: await uploadImage(newImage) }
            : editedRecipe;
        const response = await axios.put(endpoint, recipeToSave);
        return {
            success: true,
            data: response.data
        }
    } catch {
        return {
            success: false,
            data: null
        }
    }
}

/* POST RECIPE */
const postRecipe = async (recipe: IRecipe, image: File | null) => {
    try {
        const recipeToSave = image
            ? { ...recipe, image: await uploadImage(image) }
            : recipe;
        const response = await axios.post(endpoint, recipeToSave);
        return {
            success: true,
            data: response.data
        }
    } catch {
        return {
            success: false,
            data: null
        }
    }
}

type ImportErrorType = 'not_found' | 'fetch_failed';

export interface IImportDraft {
    title: string;
    type: string;
    category: string;
    cuisine?: string;
    source?: string;
    description?: string;
    image?: string;
    portions: number;
    ingredients: (Omit<IIngredients, 'amount'> & { amount: number | null })[];
    method: string[];
}

export interface IImportResponse {
    success: boolean;
    errorType?: ImportErrorType;
    data: IImportDraft | null;
}

/* IMPORT FROM URL */
const importFromUrl = async (url: string): Promise<IImportResponse> => {
    try {
        const response = await axios.post(`${API_URL}/api/import/url`, { url });
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return { success: false, errorType: 'not_found', data: null };
            }
            if (error.response?.status === 422) {
                return { success: false, errorType: 'fetch_failed', data: null };
            }
        }
        return { success: false, errorType: 'fetch_failed', data: null };
    }
};

/* DELETE RECIPE */
const deleteRecipe = async (id: number) => {
    try {
        await axios.delete(`${endpoint}/${id}`);
        return {
            success: true
        }
    } catch {
        return {
            success: false
        }
    }
}

export default {
    getAllRecipes,
    getRecipeById,
    getRecipeByTitle,
    getRecipesByType,
    getRecipesByCategory,
    putRecipe,
    postRecipe,
    deleteRecipe,
    importFromUrl
}