import { useState } from "react";
import RecipeService from "../../service/RecipeService";
import type { IImportDraft } from "../../service/RecipeService";

type Status = 'idle' | 'loading' | 'not_found' | 'fetch_failed';

const Spinner = () => (
    <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
);

interface Props {
    onImported: (recipe: IImportDraft) => void;
}

const ImportFromLinkBar = ({ onImported }: Props) => {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState<Status>('idle');

    const isLoading = status === 'loading';

    const handleImport = async () => {
        if (!url.trim() || isLoading) return;
        setStatus('loading');

        const result = await RecipeService.importFromUrl(url.trim());

        if (result.success && result.data) {
            onImported(result.data);
            setStatus('idle');
        } else {
            setStatus(result.errorType === 'not_found' ? 'not_found' : 'fetch_failed');
        }
    };

    return (
        <section className="bg-surface rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-ink mb-1">Importer fra lenke</h2>
            <p className="text-sm text-ink/60 mb-4">
                Lim inn lenken til en oppskrift, så henter vi ut innholdet automatisk.
            </p>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="import-url" className="text-sm font-medium text-ink">
                        Oppskriftslenke
                    </label>
                    <input
                        id="import-url"
                        type="url"
                        value={url}
                        onChange={e => { setUrl(e.target.value); setStatus('idle'); }}
                        onKeyDown={e => e.key === 'Enter' && handleImport()}
                        placeholder="https://..."
                        className="px-3 py-2 border rounded-md"
                        disabled={isLoading}
                    />
                </div>

                {status === 'not_found' && (
                    <p className="text-sm text-red-500">
                        Fant ingen oppskrift på siden — sjekk at lenken går direkte til oppskriften.
                    </p>
                )}
                {status === 'fetch_failed' && (
                    <p className="text-sm text-red-500">
                        Kunne ikke hente siden, prøv igjen.
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleImport}
                    disabled={isLoading || !url.trim()}
                    className="w-full py-2 bg-mahogany text-white text-xs font-light rounded-lg hover:bg-[#6a1a14] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Spinner />
                            Henter oppskrift...
                        </>
                    ) : "Hent oppskrift"}
                </button>
            </div>
        </section>
    );
};

export default ImportFromLinkBar;
