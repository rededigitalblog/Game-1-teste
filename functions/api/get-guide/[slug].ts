import type { GuideData, GetGuideResponse } from '../../src/types';

interface Env {
    GUIDES_KV: KVNamespace;
    ADMIN_KV: KVNamespace;
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
        // Não precisamos awaitar isso para não atrasar a resposta
        env.GUIDES_KV.put(`slug:${slug}`, JSON.stringify(guide)).catch(console.error);

        // ==========================================================
        // Ler Configurações de Monetização (Afiliados/Ads)
        // ==========================================================
        let monetization = {};
        try {
            const configStr = await env.ADMIN_KV.get('admin:config');
            if (configStr) {
                const config = JSON.parse(configStr);
                monetization = {
                    amazonTag: config.amazonTag,
                    shopeeId: config.shopeeId,
                    magaluId: config.magaluId,
                    aliexpressId: config.aliexpressId,
                    mercadolivreId: config.mercadolivreId,
                    adSensePubId: config.adSensePubId,
                    adSenseSlotId: config.adSenseSlotId
                };
            }
        } catch (e) {
            // Falha silenciosa na monetização, retorna guia normal
            console.error('Erro ao ler configs de monetização:', e);
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: guide,
                monetization // Injeta dados para o frontend usar
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300', // Cache reduzido para configs pegarem rápido
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
