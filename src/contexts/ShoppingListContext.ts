import { createContext, useContext } from "react";

export interface ShoppingListItem {
    id: string;
    name: string;
    amount: number;
    unit: string;
    checked: boolean;
}

export interface ShoppingListContextType {
    items: ShoppingListItem[];
    addItems: (newItems: Omit<ShoppingListItem, "id" | "checked">[]) => void;
    toggleItem: (id: string) => void;
    removeItem: (id: string) => void;
    clearList: () => void;
}

export const ShoppingListContext = createContext<ShoppingListContextType | null>(null);

export const useShoppingList = () => {
    const ctx = useContext(ShoppingListContext);
    if (!ctx) throw new Error("useShoppingList must be used within ShoppingListProvider");
    return ctx;
};
