import { useState, useEffect, type ReactNode } from "react";
import { WeekPlanContext, type WeekPlan, type WeekDay } from "./WeekPlanContext";
import type { IRecipe } from "../interfaces/Recipe/IRecipe";

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
