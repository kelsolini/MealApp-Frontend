import { useRef, useState } from "react";
import type { IRecipe } from "../../interfaces/Recipe/IRecipe";
import type { IIngredients } from "../../interfaces/Recipe/IIngredients";

const TYPES = ["middag", "frokost", "lunsj", "dessert", "snack"];
const CATEGORIES = ["hverdagsmat", "festmat", "sunn", "rask", "vegetar", "annet"];

const emptyIngredient = (): IIngredients => ({ name: "", amount: 0, unit: "" });

interface Props {
    initialData?: IRecipe;
    onSubmit: (recipe: IRecipe, image: File | null) => Promise<{ success: boolean }>;
    submitLabel: string;
}

const RecipeForm = ({ initialData, onSubmit, submitLabel }: Props) => {
    const [title, setTitle] = useState(initialData?.title ?? "");
    const [type, setType] = useState(initialData?.type ?? "middag");
    const [category, setCategory] = useState(initialData?.category ?? "hverdagsmat");
    const [cuisine, setCuisine] = useState(initialData?.cuisine ?? "");
    const [source, setSource] = useState(initialData?.source ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [portions, setPortions] = useState<number | "">(initialData?.portions ?? "");
    const [ingredients, setIngredients] = useState<IIngredients[]>(
        initialData?.ingredients.length ? initialData.ingredients : [emptyIngredient()]
    );
    const [method, setMethod] = useState<string[]>(
        initialData?.method.length ? initialData.method : [""]
    );
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImage(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const updateIngredient = (index: number, field: keyof IIngredients, value: string | number) =>
        setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, [field]: value } : ing));

    const addIngredient = () => setIngredients(prev => [...prev, emptyIngredient()]);

    const removeIngredient = (index: number) =>
        setIngredients(prev => prev.filter((_, i) => i !== index));

    const updateStep = (index: number, value: string) =>
        setMethod(prev => prev.map((step, i) => i === index ? value : step));

    const addStep = () => setMethod(prev => [...prev, ""]);

    const removeStep = (index: number) =>
        setMethod(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = async () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return setStatusMessage("Fyll inn tittel");
        if (!portions || portions <= 0) return setStatusMessage("Porsjoner må være over 0");

        const recipe: IRecipe = {
            id: initialData?.id ?? 0,
            title: trimmedTitle,
            type,
            category,
            cuisine: cuisine.trim() || undefined,
            source: source.trim() || undefined,
            description: description.trim() || undefined,
            image: image?.name ?? initialData?.image,
            portions: Number(portions),
            ingredients: ingredients.filter(ing => ing.name.trim() !== ""),
            method: method.filter(step => step.trim() !== ""),
        };

        const response = await onSubmit(recipe, image);
        if (response.success) {
            setStatusMessage(initialData ? "Oppskrift oppdatert!" : "Oppskrift lagret!");
            if (!initialData) {
                setTitle("");
                setType("middag");
                setCategory("hverdagsmat");
                setCuisine("");
                setSource("");
                setPortions("");
                setDescription("");
                setIngredients([emptyIngredient()]);
                setMethod([""]);
                setImage(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        } else {
            setStatusMessage("Noe gikk galt");
        }
    };

    const currentImageUrl = imagePreview
        ?? (initialData?.image ? `http://localhost:5149/images-recipe/${initialData.image}` : null);

    return (
        <div className="space-y-6">
            {/* Tittel */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Tittel *</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Oppskriftsnavn"
                    className="px-3 py-2 border rounded-md"
                />
            </div>

            {/* Type og Kategori */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <select value={type} onChange={e => setType(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-white">
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Kategori</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-white">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Kjøkken, Kilde og Porsjoner */}
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Kjøkken</label>
                    <input type="text" value={cuisine} onChange={e => setCuisine(e.target.value)}
                        placeholder="Italiensk, norsk..." className="px-3 py-2 border rounded-md" />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Kilde</label>
                    <input type="text" value={source} onChange={e => setSource(e.target.value)}
                        placeholder="URL eller bok" className="px-3 py-2 border rounded-md" />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Porsjoner *</label>
                    <input type="number" value={portions}
                        onChange={e => setPortions(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Antall porsjoner" min={1} className="px-3 py-2 border rounded-md" />
                </div>
            </div>

            {/* Beskrivelse */}
            <div className="flex flex-col space-y-1">
                <label htmlFor="recipe-description" className="text-sm font-medium text-gray-700">Beskrivelse</label>
                <textarea
                    id="recipe-description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Kort beskrivelse av oppskriften..."
                    rows={3}
                    className="px-3 py-2 border rounded-md resize-none"
                />
            </div>

            {/* Bilde */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Bilde</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange}
                    className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {currentImageUrl && (
                    <img src={currentImageUrl} alt="Forhåndsvisning"
                        className="w-48 h-32 object-cover rounded-md border" />
                )}
            </div>

            {/* Ingredienser */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Ingredienser</label>
                {ingredients.map((ing, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <input type="text" value={ing.name}
                            onChange={e => updateIngredient(i, "name", e.target.value)}
                            placeholder="Navn" className="flex-1 px-3 py-2 border rounded-md" />
                        <input type="number" value={ing.amount || ""}
                            onChange={e => updateIngredient(i, "amount", Number(e.target.value))}
                            placeholder="Mengde" min={0} className="w-24 px-3 py-2 border rounded-md" />
                        <input type="text" value={ing.unit}
                            onChange={e => updateIngredient(i, "unit", e.target.value)}
                            placeholder="Enhet" className="w-20 px-3 py-2 border rounded-md" />
                        {ingredients.length > 1 && (
                            <button type="button" onClick={() => removeIngredient(i)}
                                className="text-red-400 hover:text-red-600 text-lg font-bold" title="Fjern">
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addIngredient}
                    className="self-start text-sm text-blue-600 hover:underline">
                    + Legg til ingrediens
                </button>
            </div>

            {/* Fremgangsmåte */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Fremgangsmåte</label>
                {method.map((step, i) => (
                    <div key={i} className="flex gap-2 items-start">
                        <span className="mt-2 text-sm text-gray-400 w-5 shrink-0">{i + 1}.</span>
                        <textarea value={step} onChange={e => updateStep(i, e.target.value)}
                            placeholder={`Steg ${i + 1}`} rows={2}
                            className="flex-1 px-3 py-2 border rounded-md resize-none" />
                        {method.length > 1 && (
                            <button type="button" onClick={() => removeStep(i)}
                                className="mt-2 text-red-400 hover:text-red-600 text-lg font-bold" title="Fjern">
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addStep}
                    className="self-start text-sm text-blue-600 hover:underline">
                    + Legg til steg
                </button>
            </div>

            {statusMessage && (
                <p className={`text-sm text-center ${statusMessage.includes("lagret") || statusMessage.includes("oppdatert") ? "text-green-500" : "text-red-500"}`}>
                    {statusMessage}
                </p>
            )}

            <button type="button" onClick={handleSubmit}
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                {submitLabel}
            </button>
        </div>
    );
};

export default RecipeForm;
