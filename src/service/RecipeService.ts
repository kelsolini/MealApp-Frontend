import axios from "axios";
import type { IRecipe } from "../interfaces/Recipe/IRecipe";
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

/* PUT RECIPE */
const putRecipe = async (editedRecipe: IRecipe, newImage: File | null) => {
    try {
        const response = await axios.put(endpoint, editedRecipe);
        if (newImage) {
            const formData = new FormData();
            formData.append("file", newImage);
            await axios.post(endpointImageUpload, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        }
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
        const response = await axios.post(endpoint, recipe);
        if (image) {
            const formData = new FormData();
            formData.append("file", image);
            await axios.post(endpointImageUpload, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        }
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
    deleteRecipe
}