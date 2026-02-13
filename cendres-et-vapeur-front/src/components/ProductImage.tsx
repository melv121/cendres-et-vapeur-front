import { useEffect, useState } from 'react';
import { getAuthenticatedImageUrl } from '../api/api';

interface ProductImageProps {
    src: string;
    alt: string;
    className?: string;
}

export const ProductImage = ({ src, alt, className }: ProductImageProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadImage = async () => {
            setLoading(true);
            setImageSrc(null);

            if (!src || !src.trim()) {
                setLoading(false);
                return;
            }

            // If it's an absolute URL or data URL, use it directly
            if (src.startsWith('http') || src.startsWith('data:')) {
                setImageSrc(src);
                setLoading(false);
                return;
            }

            // Try to load with authentication for relative URLs
            const authImageUrl = await getAuthenticatedImageUrl(src);
            if (authImageUrl) {
                setImageSrc(authImageUrl);
            }
            // If auth fails, don't fall back - just don't show the image
            setLoading(false);
        };

        loadImage();
    }, [src]);

    // Only render img tag if we have a valid image URL
    if (imageSrc) {
        return <img src={imageSrc} alt={alt} className={className} />;
    }

    // Show nothing while loading or if no image available
    return null;
};
