import type { IIngredients } from "./IIngredients"

export interface IRecipe {
    id: number,
    title: string,
    type: string,
    category: string,
    cuisine?: string,
    source?: string,
    description?: string,
    image?: string,
    portions: number,
    ingredients: IIngredients[],
    method: string[],
    nutrition?: {
        calories: number,
        protein: number,
        carbs: number,
        fat: number
    }
}