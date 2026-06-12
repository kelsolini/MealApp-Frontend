import { describe, it, expect } from "vitest";
import { mergeShoppingItems } from "./mergeShoppingItems";
import type { ShoppingListItem } from "../contexts/ShoppingListContext";

function item(name: string, amount: number, unit: string, checked = false): ShoppingListItem {
    return { id: `test-${name}-${amount}`, name, amount, unit, checked };
}

describe("mergeShoppingItems", () => {
    it("slår sammen varer med ulik skrivemåte i navn", () => {
        const result = mergeShoppingItems([], [
            { name: "Mel", amount: 100, unit: "g" },
            { name: "mel", amount: 200, unit: "g" },
        ]);
        expect(result).toHaveLength(1);
        expect(result[0].amount).toBe(300);
        expect(result[0].unit).toBe("g");
    });

    it("konverterer kg til g og slår sammen med eksisterende g-vare", () => {
        const existing = [item("mel", 500, "g")];
        const result = mergeShoppingItems(existing, [{ name: "mel", amount: 1, unit: "kg" }]);
        expect(result).toHaveLength(1);
        expect(result[0].amount).toBe(1500);
        expect(result[0].unit).toBe("g");
        expect(result[0].name).toBe("mel");
    });

    it("av-krysser en avkrysset vare ved sammenslåing", () => {
        const existing = [item("mel", 500, "g", true)];
        const result = mergeShoppingItems(existing, [{ name: "mel", amount: 200, unit: "g" }]);
        expect(result).toHaveLength(1);
        expect(result[0].checked).toBe(false);
        expect(result[0].amount).toBe(700);
    });

    it("slår sammen duplikater innad i innkommende batch", () => {
        const result = mergeShoppingItems([], [
            { name: "mel", amount: 100, unit: "g" },
            { name: "mel", amount: 200, unit: "g" },
        ]);
        expect(result).toHaveLength(1);
        expect(result[0].amount).toBe(300);
    });

    it("beholder mengdeløs og mengde-vare som separate linjer", () => {
        const result = mergeShoppingItems([], [
            { name: "mel", amount: 0, unit: "g" },
            { name: "mel", amount: 100, unit: "g" },
        ]);
        expect(result).toHaveLength(2);
    });
});
