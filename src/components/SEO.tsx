import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    type?: string;
    image?: string;
    jsonLd?: object;
}

export default function SEO({ title, description, type = 'website', image, jsonLd }: SEOProps) {
    useEffect(() => {
        // Atualiza Título
        document.title = title;

        // Helper para atualizar/criar meta tags
        const setMeta = (selector: string, content: string) => {
            let element = document.querySelector(selector);
            if (!element) {
                // Se não existe, cria (simplificado para name e property)
                element = document.createElement('meta');
                if (selector.startsWith('meta[name')) {
                    element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
                } else if (selector.startsWith('meta[property')) {
                    element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
                }
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        if (description) {
            setMeta('meta[name="description"]', description);
            setMeta('meta[property="og:description"]', description);
        }

        setMeta('meta[property="og:title"]', title);
        setMeta('meta[property="og:type"]', type);

        if (image) {
            setMeta('meta[property="og:image"]', image);
        }

        // JSON-LD Injection para Rich Snippets
        if (jsonLd) {
            let script = document.querySelector('script[type="application/ld+json"]');
            if (!script) {
                script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(jsonLd);
        }
    }, [title, description, type, image, jsonLd]);

    return null;
}
