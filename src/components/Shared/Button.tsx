// src/components/Shared/Button.tsx
import { Link } from "react-router-dom";

interface Props {
    text: string;
    to?: string;
    onClick?: () => void;
    variant?: "primary" | "danger" | "secondary" | "outlined";
    fullWidth?: boolean;
}

const Button = ({ text, to, onClick, variant = "primary", fullWidth = false }: Props) => {

    // 1. Felles styling som gjelder alle knapper
    const base = "text-xs px-3 py-2 rounded-lg font-light transition-colors whitespace-nowrap";

    // 2. Variant-spesifikk styling
    const variants = {
        primary: "bg-[#4c0000] hover:bg-[#6a1a14] text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        secondary: "bg-gray-500 hover:bg-gray-600 text-white",
        outlined: "bg-transparent border border-[#4c0000] text-[#4c0000] hover:bg-[#4c0000] hover:text-white"
    };

    // 3. Sett sammen alle klasser
    const className = `${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`;

    // 4. Returner Link hvis "to" er satt, ellers vanlig button
    if (to) {
        return <Link to={to} className={className}>{text}</Link>;
    }

    return <button onClick={onClick} className={className}>{text}</button>;
};

export default Button;