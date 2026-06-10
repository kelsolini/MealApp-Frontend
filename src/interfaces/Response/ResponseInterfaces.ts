import type { IRecipe } from "../Recipe/IRecipe";

export interface IDefaultResponse {
    success: boolean
}

export interface IRecipeSingleResponse {
    success: boolean,
    data: IRecipe | null
}

export interface IRecipeListResponse {
    success: boolean,
    data: IRecipe[] | null
}