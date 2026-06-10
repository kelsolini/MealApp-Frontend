export type RecipeId = number;

const STORAGE_KEY = "favorites";

export const favoritesStorage = {

    /* GET ALL */
    getAll(): RecipeId[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? (JSON.parse(stored) as RecipeId[]) : [];
        } catch {
            return [];
        }
    },

    /* SAVE */
    save(favorites: RecipeId[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
}