
import type { IRecipe } from "../interfaces/Recipe/IRecipe";

export const mockRecipes: IRecipe[] = [
    {
        id: 1,
        title: "Kylling i karri",
        type: "middag",
        category: "hverdagsmat",
        cuisine: "asiatisk",
        portions: 4,
        ingredients: [
            { name: "kyllingfilet", amount: 500, unit: "g" },
            { name: "kokomelk", amount: 4, unit: "dl" },
            { name: "karripaste", amount: 2, unit: "ss" },
            { name: "ris", amount: 4, unit: "dl" },
            { name: "løk", amount: 1, unit: "stk" }
        ],
        method: [
            "Kutt kyllingen i biter og stek i en varm panne.",
            "Hakk løken og fres den med karripasten.",
            "Hell over kokomelken og la det småkoke i 15 minutter.",
            "Kok ris etter anvisning på pakken.",
            "Server kyllingen over risen."
        ],
        nutrition: {
            calories: 620,
            protein: 38,
            carbs: 55,
            fat: 22
        }
    },
    {
        id: 2,
        title: "Pasta Carbonara",
        type: "middag",
        category: "hverdagsmat",
        cuisine: "italiensk",
        source: "https://example.com/carbonara",
        image: "https://placehold.co/400x300",
        portions: 2,
        ingredients: [
            { name: "spaghetti", amount: 200, unit: "g" },
            { name: "bacon", amount: 150, unit: "g" },
            { name: "egg", amount: 2, unit: "stk" },
            { name: "parmesan", amount: 50, unit: "g" },
            { name: "pepper", amount: 1, unit: "ts" }
        ],
        method: [
            "Kok spaghetti etter anvisning.",
            "Stek bacon til det er sprøtt.",
            "Visp sammen egg og revet parmesan.",
            "Bland den varme pastaen med bacon og eggblandingen.",
            "Server med ekstra parmesan og pepper."
        ]
    }
];