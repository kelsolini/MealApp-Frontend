import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface ShoppingListItem {
    id: string;
    name: string;
    amount: number;
    unit: string;
    checked: boolean;
}

interface ShoppingListContextType {
    items: ShoppingListItem[];
    addItems: (newItems: Omit<ShoppingListItem, "id" | "checked">[]) => void;
    toggleItem: (id: string) => void;
    removeItem: (id: string) => void;
    clearList: () => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | null>(null);

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
        const toAdd: ShoppingListItem[] = newItems.map(item => ({
            ...item,
            id: `${Date.now()}-${Math.random()}`,
            checked: false,
        }));
        setItems(prev => [...prev, ...toAdd]);
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

export const useShoppingList = () => {
    const ctx = useContext(ShoppingListContext);
    if (!ctx) throw new Error("useShoppingList must be used within ShoppingListProvider");
    return ctx;
};
