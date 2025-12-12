import type { GuideData } from '../types';

/**
 * Gera metadados SEO para uma página de guia
 */
export function generateSEOMetadata(guide: GuideData) {
    return {
        title: guide.title,
        description: guide.metaDescription,
        canonical: `https://guiagamesbr.com/${guide.slug}`,
        openGraph: {
            type: 'article',
            title: guide.title,
            description: guide.subtitle,
            image: guide.imageUrl,
            url: `https://guiagamesbr.com/${guide.slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: guide.title,
            description: guide.subtitle,
            image: guide.imageUrl,
        },
        schema: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.metaDescription,
            image: guide.imageUrl,
            datePublished: guide.createdAt,
            dateModified: guide.updatedAt,
            author: {
                '@type': 'Organization',
                name: 'Guia Games BR',
            },
            publisher: {
                '@type': 'Organization',
                name: 'Guia Games BR',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://guiagamesbr.com/logo.png',
                },
            },
        },
    };
}

/**
 * Calcula tempo de leitura estimado
 */
export function calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

/**
 * Trunca texto para meta description
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');

    return truncated.substring(0, lastSpace) + '...';
}
