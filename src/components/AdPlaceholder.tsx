import { useEffect } from 'react';

interface AdPlaceholderProps {
    pubId?: string;
    slotId?: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    label?: string;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function AdPlaceholder({ pubId, slotId, format = 'auto', label }: AdPlaceholderProps) {
    // Em desenvolvimento, mostrar um placeholder visual para debug
    const isDev = import.meta.env.DEV;

    if (!pubId || !slotId) {
        if (isDev) {
            return (
                <div className="my-8 p-8 bg-dark-700/30 border-2 border-dashed border-dark-600 rounded-lg text-center">
                    <p className="text-gray-500 font-mono text-sm">AdSpace: {label || 'Sem ID configurado'}</p>
                </div>
            );
        }
        return null; // Em produção, se não tiver ID, esconde
    }

    useEffect(() => {
        try {
            // Tenta inicializar o anúncio
            // Safe check para evitar "adsbygoogle.push() error: No slot size for availableWidth=0"
            // que acontece se o container estiver oculto
            const ads = window.adsbygoogle || [];
            ads.push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, [pubId, slotId]);

    return (
        <div className="my-8 w-full flex justify-center bg-dark-800/20 rounded-lg overflow-hidden min-h-[100px]">
            {label && isDev && <div className="absolute text-xs text-gray-600">{label}</div>}
            <ins className="adsbygoogle"
                style={{ display: 'block', minWidth: '300px', width: '100%' }}
                data-ad-client={pubId}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"></ins>
        </div>
    );
}
