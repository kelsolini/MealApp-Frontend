import type { ShoppingListItem } from "../contexts/ShoppingListContext";

type ItemInput = Omit<ShoppingListItem, "id" | "checked">;

const CONVERSIONS: Record<string, { unit: string; factor: number }> = {
    kg: { unit: "g", factor: 1000 },
    l:  { unit: "dl", factor: 10 },
};

function toSmallestUnit(amount: number, unit: string): { amount: number; unit: string } {
    const conv = CONVERSIONS[unit.trim().toLowerCase()];
    if (conv) return { amount: amount * conv.factor, unit: conv.unit };
    return { amount, unit: unit.trim().toLowerCase() };
}

function itemKey(name: string, unit: string): string {
    return `${name.trim().toLowerCase()}::${unit.trim().toLowerCase()}`;
}

export function mergeShoppingItems(
    existing: ShoppingListItem[],
    incoming: ItemInput[]
): ShoppingListItem[] {
    // Step 1: Merge within the incoming batch
    const withAmountMap = new Map<string, ItemInput>();
    const noAmountKeys = new Set<string>();
    const noAmountItems: ItemInput[] = [];

    for (const raw of incoming) {
        if (!raw.amount) {
            const key = itemKey(raw.name, raw.unit);
            if (!noAmountKeys.has(key)) {
                noAmountKeys.add(key);
                noAmountItems.push(raw);
            }
        } else {
            const norm = toSmallestUnit(raw.amount, raw.unit);
            const key = itemKey(raw.name, norm.unit);
            const prev = withAmountMap.get(key);
            if (prev) {
                withAmountMap.set(key, { ...prev, amount: prev.amount + norm.amount, unit: norm.unit });
            } else {
                withAmountMap.set(key, { name: raw.name, amount: norm.amount, unit: norm.unit });
            }
        }
    }

    const batch: ItemInput[] = [...withAmountMap.values(), ...noAmountItems];

    // Step 2: Merge batch against existing list
    const result: ShoppingListItem[] = [...existing];

    for (const item of batch) {
        if (!item.amount) {
            const key = itemKey(item.name, item.unit);
            const idx = result.findIndex(e => !e.amount && itemKey(e.name, e.unit) === key);
            if (idx < 0) {
                result.push({ ...item, id: `${Date.now()}-${Math.random()}`, checked: false });
            }
        } else {
            const norm = toSmallestUnit(item.amount, item.unit);
            const key = itemKey(item.name, norm.unit);
            const idx = result.findIndex(e => {
                if (!e.amount) return false;
                const eNorm = toSmallestUnit(e.amount, e.unit);
                return itemKey(e.name, eNorm.unit) === key;
            });
            if (idx >= 0) {
                const eNorm = toSmallestUnit(result[idx].amount, result[idx].unit);
                result[idx] = {
                    ...result[idx],
                    amount: eNorm.amount + norm.amount,
                    unit: norm.unit,
                    checked: false,
                };
            } else {
                result.push({
                    ...item,
                    amount: norm.amount,
                    unit: norm.unit,
                    id: `${Date.now()}-${Math.random()}`,
                    checked: false,
                });
            }
        }
    }

    return result;
}
