export const API_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (image: string | undefined): string | undefined => {
    if (!image) return undefined;
    if (image.startsWith("http")) return image;
    return `${API_URL}/images-recipe/${image}`;
};
