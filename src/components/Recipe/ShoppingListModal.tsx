import { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useShoppingList } from "../../contexts/ShoppingListContext";

interface EditableItem {
    id: string;
    name: string;
    amount: string;
    unit: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ingredients: Array<{ name: string; amount: number; unit: string }>;
    recipeName: string;
}

const ShoppingListModal = ({ isOpen, onClose, ingredients, recipeName }: Props) => {
    const { addItems } = useShoppingList();
    const [editableItems, setEditableItems] = useState<EditableItem[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = "shopping-modal-title";

    useEffect(() => {
        if (isOpen) {
            setEditableItems(
                ingredients.map(ing => ({
                    id: crypto.randomUUID(),
                    name: ing.name,
                    amount: String(ing.amount),
                    unit: ing.unit,
                }))
            );
        }
    }, [isOpen, ingredients]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen || !modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable[0]?.focus();

        const trap = (e: KeyboardEvent) => {
            if (e.key !== "Tab" || !modalRef.current) return;
            const all = modalRef.current.querySelectorAll<HTMLElement>(
                'button, input, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const first = all[0];
            const last = all[all.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
            }
        };
        document.addEventListener("keydown", trap);
        return () => document.removeEventListener("keydown", trap);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- trap handler re-queries DOM on each Tab press; re-running on editableItems would steal focus after every keystroke
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    const updateItem = (id: string, field: keyof EditableItem, value: string) =>
        setEditableItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));

    const removeItem = (id: string) =>
        setEditableItems(prev => prev.filter(item => item.id !== id));

    const addExtra = () =>
        setEditableItems(prev => [...prev, { id: crypto.randomUUID(), name: "", amount: "", unit: "" }]);

    const handleConfirm = () => {
        const valid = editableItems
            .filter(item => item.name.trim() !== "")
            .map(item => ({
                name: item.name.trim(),
                amount: Number(item.amount) || 0,
                unit: item.unit.trim(),
            }));
        addItems(valid);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
                    <div>
                        <h2 id={titleId} className="text-xl font-serif text-stone-900">
                            Legg til i handleliste
                        </h2>
                        <p className="text-sm text-stone-500 mt-0.5">{recipeName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Lukk dialog"
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-stone-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div
                        className="grid gap-2 mb-2 text-xs text-stone-500 uppercase tracking-wider"
                        style={{ gridTemplateColumns: "1fr 5rem 4rem 2rem" }}
                        aria-hidden="true"
                    >
                        <span>Ingrediens</span>
                        <span>Mengde</span>
                        <span>Enhet</span>
                        <span></span>
                    </div>

                    <ul className="space-y-2" aria-label="Ingredienser i handlelisten">
                        {editableItems.map((item, i) => (
                            <li
                                key={item.id}
                                className="grid gap-2 items-center"
                                style={{ gridTemplateColumns: "1fr 5rem 4rem 2rem" }}
                            >
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={e => updateItem(item.id, "name", e.target.value)}
                                    aria-label={`Ingrediens ${i + 1}`}
                                    className="px-3 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                                />
                                <input
                                    type="number"
                                    value={item.amount}
                                    onChange={e => updateItem(item.id, "amount", e.target.value)}
                                    min={0}
                                    aria-label={`Mengde for ${item.name || `ingrediens ${i + 1}`}`}
                                    className="px-3 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                                />
                                <input
                                    type="text"
                                    value={item.unit}
                                    onChange={e => updateItem(item.id, "unit", e.target.value)}
                                    aria-label={`Enhet for ${item.name || `ingrediens ${i + 1}`}`}
                                    className="px-3 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                                />
                                <button
                                    onClick={() => removeItem(item.id)}
                                    aria-label={`Fjern ${item.name || `ingrediens ${i + 1}`}`}
                                    className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-red-50 hover:text-red-600 text-stone-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={addExtra}
                        className="mt-4 flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        Legg til ekstra vare
                    </button>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm rounded-full border border-stone-300 hover:bg-stone-50 transition-colors"
                    >
                        Avbryt
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-5 py-2 text-sm rounded-full text-white bg-[#4c0000] hover:bg-[#6a1a14] transition-colors"
                    >
                        Legg til
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingListModal;
