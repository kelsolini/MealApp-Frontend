import { useState, useRef, useEffect } from "react";
import { Trash2, ShoppingCart, CheckCheck } from "lucide-react";
import { useShoppingList } from "../contexts/ShoppingListContext";

const ShoppingListPage = () => {
    const { items, toggleItem, removeItem, clearList } = useShoppingList();
    const [pendingMove, setPendingMove] = useState<Set<string>>(new Set());
    const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    useEffect(() => {
        const refs = timeoutRefs.current;
        return () => refs.forEach(t => clearTimeout(t));
    }, []);

    const handleToggle = (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        if (!item.checked) {
            toggleItem(id);
            setPendingMove(prev => new Set(prev).add(id));
            const timeout = setTimeout(() => {
                setPendingMove(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
                timeoutRefs.current.delete(id);
            }, 200);
            timeoutRefs.current.set(id, timeout);
        } else {
            const existing = timeoutRefs.current.get(id);
            if (existing !== undefined) {
                clearTimeout(existing);
                timeoutRefs.current.delete(id);
            }
            setPendingMove(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            toggleItem(id);
        }
    };

    const unchecked = items.filter(item => !item.checked || pendingMove.has(item.id));
    const checked = items.filter(item => item.checked && !pendingMove.has(item.id));

    return (
        <main className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6 text-stone-600" aria-hidden="true" />
                    <h1 className="text-3xl font-serif text-stone-900">Handleliste</h1>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={clearList}
                        className="flex items-center gap-2 px-6 py-3 border border-stone-300 rounded-full hover:bg-stone-50 transition-colors text-sm"
                    >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        Tøm handleliste
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
                    <p className="text-lg">Handlelisten er tom</p>
                    <p className="text-sm mt-1">Legg til ingredienser fra en oppskrift</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {unchecked.length > 0 && (
                        <section aria-label="Varer som gjenstår">
                            <ul className="divide-y divide-stone-100 bg-surface rounded-2xl border border-stone-100 overflow-hidden">
                                {unchecked.map(item => {
                                    const isPending = pendingMove.has(item.id);
                                    return (
                                        <li
                                            key={item.id}
                                            className={`flex items-center gap-4 px-5 py-3.5 transition-all duration-300${isPending ? " opacity-50" : ""}`}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`item-${item.id}`}
                                                checked={item.checked}
                                                onChange={() => handleToggle(item.id)}
                                                className="w-5 h-5 rounded border-stone-300 accent-red-900 cursor-pointer"
                                                aria-label={isPending ? `Angre merking av ${item.name}` : `Merk ${item.name} som handlet`}
                                            />
                                            <label
                                                htmlFor={`item-${item.id}`}
                                                className="flex-1 flex items-center justify-between cursor-pointer"
                                            >
                                                <span className={isPending ? "text-stone-400 line-through" : "text-stone-800"}>
                                                    {item.name}
                                                </span>
                                                <span className={`text-sm${isPending ? " text-stone-300" : " text-stone-400"}`}>
                                                    {item.amount > 0 ? `${item.amount} ${item.unit}` : item.unit}
                                                </span>
                                            </label>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                aria-label={`Fjern ${item.name} fra handlelisten`}
                                                className="p-1.5 rounded-full hover:bg-red-50 hover:text-red-600 text-stone-300 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    )}

                    {checked.length > 0 && (
                        <section aria-label="Handlede varer">
                            <div className="flex items-center gap-2 mb-3 text-xs text-stone-400 uppercase tracking-wider">
                                <CheckCheck className="w-4 h-4" aria-hidden="true" />
                                <span>Handlet ({checked.length})</span>
                            </div>
                            <ul className="divide-y divide-stone-100 bg-stone-50 rounded-2xl border border-stone-100 overflow-hidden">
                                {checked.map(item => (
                                    <li key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                                        <input
                                            type="checkbox"
                                            id={`item-${item.id}`}
                                            checked={true}
                                            onChange={() => handleToggle(item.id)}
                                            className="w-5 h-5 rounded border-stone-300 accent-red-900 cursor-pointer"
                                            aria-label={`Fjern merking av ${item.name}`}
                                        />
                                        <label
                                            htmlFor={`item-${item.id}`}
                                            className="flex-1 flex items-center justify-between cursor-pointer"
                                        >
                                            <span className="text-stone-400 line-through">{item.name}</span>
                                            <span className="text-stone-300 text-sm">
                                                {item.amount > 0 ? `${item.amount} ${item.unit}` : item.unit}
                                            </span>
                                        </label>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            aria-label={`Fjern ${item.name} fra handlelisten`}
                                            className="p-1.5 rounded-full hover:bg-red-50 hover:text-red-600 text-stone-300 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            )}
        </main>
    );
};

export default ShoppingListPage;
