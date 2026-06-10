import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { IRecipe } from "../interfaces/Recipe/IRecipe";

export const DAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"] as const;
export type WeekDay = typeof DAYS[number];

type WeekPlan = Partial<Record<WeekDay, IRecipe>>;

interface WeekPlanContextType {
    weekPlan: WeekPlan;
    setDayRecipe: (day: WeekDay, recipe: IRecipe) => void;
    removeDayRecipe: (day: WeekDay) => void;
}

const WeekPlanContext = createContext<WeekPlanContextType | null>(null);
const STORAGE_KEY = "weekPlan";

export const WeekPlanProvider = ({ children }: { children: ReactNode }) => {
    const [weekPlan, setWeekPlan] = useState<WeekPlan>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(weekPlan));
    }, [weekPlan]);

    const setDayRecipe = (day: WeekDay, recipe: IRecipe) =>
        setWeekPlan(prev => ({ ...prev, [day]: recipe }));

    const removeDayRecipe = (day: WeekDay) =>
        setWeekPlan(prev => {
            const next = { ...prev };
            delete next[day];
            return next;
        });

    return (
        <WeekPlanContext.Provider value={{ weekPlan, setDayRecipe, removeDayRecipe }}>
            {children}
        </WeekPlanContext.Provider>
    );
};

export const useWeekPlan = () => {
    const ctx = useContext(WeekPlanContext);
    if (!ctx) throw new Error("useWeekPlan must be used within WeekPlanProvider");
    return ctx;
};
