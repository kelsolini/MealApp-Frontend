// src/components/Shared/IconButton.tsx
interface IconButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: "ghost" | "solid";
    className?: string;
}

const IconButton = ({ 
    icon, 
    label, 
    onClick, 
    type = "button",
    variant = "ghost",
    className = ""
}: IconButtonProps) => {
    const base = "p-2 rounded-full transition-colors";
    const variants = {
        ghost: "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
        solid: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            aria-label={label}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {icon}
        </button>
    );
};

export default IconButton;