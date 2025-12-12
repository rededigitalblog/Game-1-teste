import type { GuideData, GetGuideResponse } from '../../src/types';

interface Env {
    GUIDES_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { params, env } = context;
    const slug = params.slug as string;

    try {
        // Busca guia no KV pelo slug
        const guideData = await env.GUIDES_KV.get(`slug:${slug}`);

        if (!guideData) {
            return new Response(
                JSON.stringify({
                    success: false,
                    data: null,
                    error: 'Guia não encontrado',
                } as GetGuideResponse),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const guide: GuideData = JSON.parse(guideData);

        // Incrementa views (fire-and-forget)
        guide.views = (guide.views || 0) + 1;
        env.GUIDES_KV.put(`slug:${slug}`, JSON.stringify(guide)).catch(console.error);

        return new Response(
            JSON.stringify({
                success: true,
                data: guide,
            } as GetGuideResponse),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
                },
            }
        );
    } catch (error) {
        console.error('Erro ao buscar guia:', error);

        return new Response(
            JSON.stringify({
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            } as GetGuideResponse),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};
