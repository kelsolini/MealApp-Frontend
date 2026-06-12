import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from './Button';
import IconButton from './IconButton';

// Søkeikon — definert én gang, brukt to steder
const SearchIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
    </svg>
);

const PageHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = new FormData(e.currentTarget).get("search") as string;
        if (query.trim()) {
            navigate(`/recipes?q=${encodeURIComponent(query.trim())}`);
        } else {
            navigate("/recipes");
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <nav className="max-w-6xl mx-auto flex items-center justify-between">

                {/* VENSTRE: logo + nav-lenker som én gruppe */}
                <div className="flex items-center gap-8">
                    <span className="text-xl font-semibold text-gray-800">Menuly</span>

                    <ul className="hidden md:flex items-center gap-6">
                        <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Hjem</Link></li>
                        <li><Link to="/recipes" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Oppskrifter</Link></li>
                        <li><Link to="/weekplan" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Ukesplan</Link></li>
                        <li><Link to="/shoppinglist" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Handleliste</Link></li>
                    </ul>
                </div>

                {/* HAMBURGER — kun synlig på mobil */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Lukk meny" : "Åpne meny"}
                        aria-expanded={isOpen}
                        className="flex flex-col gap-1.5"
                    >
                        <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${isOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>
                </div>

                {/* HØYRE: søk + knapp — skjult på mobil */}
                <div className="hidden md:flex items-center gap-4">
                    <form role="search" onSubmit={handleSearch} className="relative">
                        <label htmlFor="header-search" className="sr-only">Søk i oppskrifter</label>
                        <input
                            id="header-search"
                            name="search"
                            type="search"
                            placeholder="søk i oppskrifter..."
                            className="pl-4 pr-10 py-1.5 w-56 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
                        />
                        <IconButton
                            type="submit"
                            label="Søk"
                            icon={SearchIcon}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        />
                    </form>
                    <Button text="Importer fra lenke" to="/importer" variant="outlined" />
                    <Button text="+ Ny oppskrift" to="/recipes/add" />
                </div>
            </nav>

            {/* MOBIL DROPDOWN — kun synlig når isOpen er true */}
            {isOpen && (
                <div className="flex flex-col space-y-4 mt-4 md:hidden">
                    <ul className="flex flex-col gap-3">
                        <li><Link onClick={() => setIsOpen(false)} to="/" className="block text-gray-600 hover:text-gray-900">Hjem</Link></li>
                        <li><Link onClick={() => setIsOpen(false)} to="/recipes" className="block text-gray-600 hover:text-gray-900">Oppskrifter</Link></li>
                        <li><Link onClick={() => setIsOpen(false)} to="/weekplan" className="block text-gray-600 hover:text-gray-900">Ukesplan</Link></li>
                        <li><Link onClick={() => setIsOpen(false)} to="/shoppinglist" className="block text-gray-600 hover:text-gray-900">Handleliste</Link></li>
                    </ul>

                    <form role="search" onSubmit={handleSearch} className="relative">
                        <label htmlFor="mobile-search" className="sr-only">Søk i oppskrifter</label>
                        <input
                            id="mobile-search"
                            name="search"
                            type="search"
                            placeholder="søk i oppskrifter..."
                            className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
                        />
                        <IconButton
                            type="submit"
                            label="Søk"
                            icon={SearchIcon}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        />
                    </form>

                    <Button text="Importer fra lenke" to="/importer" variant="outlined" fullWidth />
                    <Button text="+ Ny oppskrift" to="/recipes/add" fullWidth />
                </div>
            )}
        </header>
    );
}

export default PageHeader;