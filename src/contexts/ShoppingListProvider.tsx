import { useState, useEffect, type ReactNode } from "react";
import { mergeShoppingItems } from "../utils/mergeShoppingItems";
import { ShoppingListContext, type ShoppingListItem } from "./ShoppingListContext";

const STORAGE_KEY = "shoppingList";

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<ShoppingListItem[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItems = (newItems: Omit<ShoppingListItem, "id" | "checked">[]) => {
        setItems(prev => mergeShoppingItems(prev, newItems));
    };

    const toggleItem = (id: string) =>
        setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));

    const removeItem = (id: string) =>
        setItems(prev => prev.filter(item => item.id !== id));

    const clearList = () => setItems([]);

    return (
        <ShoppingListContext.Provider value={{ items, addItems, toggleItem, removeItem, clearList }}>
            {children}
        </ShoppingListContext.Provider>
    );
};
