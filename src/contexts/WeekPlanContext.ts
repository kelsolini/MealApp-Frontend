import { createContext, useContext } from "react";
import type { IRecipe } from "../interfaces/Recipe/IRecipe";

export const DAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"] as const;
export type WeekDay = typeof DAYS[number];

export type WeekPlan = Partial<Record<WeekDay, IRecipe>>;

export interface WeekPlanContextType {
    weekPlan: WeekPlan;
    setDayRecipe: (day: WeekDay, recipe: IRecipe) => void;
    removeDayRecipe: (day: WeekDay) => void;
}

export const WeekPlanContext = createContext<WeekPlanContextType | null>(null);

export const useWeekPlan = () => {
    const ctx = useContext(WeekPlanContext);
    if (!ctx) throw new Error("useWeekPlan must be used within WeekPlanProvider");
    return ctx;
};
