import type { PluginData } from '@cloudflare/pages-plugin-cloudflare-access';

interface Env {
    ADMIN_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ success: false, error: 'Não autorizado' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const configStr = await context.env.ADMIN_KV.get('admin:config');
        let config: any = {};

        if (configStr) {
            config = JSON.parse(configStr);
        }

        const safeConfig = {
            ...config,
            geminiApiKey: config.geminiApiKey ? '********' : '',
            anthropicApiKey: config.anthropicApiKey ? '********' : '',
            siteName: config.siteName || 'Guia Games BR',
            enableAiGeneration: config.enableAiGeneration,

            // Afiliados (valores públicos/semi-públicos)
            amazonTag: config.amazonTag || '',
            shopeeId: config.shopeeId || '',
            magaluId: config.magaluId || '',
            aliexpressId: config.aliexpressId || '',
            mercadolivreId: config.mercadolivreId || '',

            // Ads
            adSensePubId: config.adSensePubId || '',
            adSenseSlotId: config.adSenseSlotId || ''
        };

        return new Response(JSON.stringify({ success: true, config: safeConfig }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Erro interno' }), { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ success: false, error: 'Não autorizado' }), { status: 401 });
        }

        const data: any = await context.request.json();

        const currentConfigStr = await context.env.ADMIN_KV.get('admin:config');
        let currentConfig: any = {};
        if (currentConfigStr) {
            currentConfig = JSON.parse(currentConfigStr);
        }

        const newConfig = { ...currentConfig };

        // API Keys
        if (data.geminiApiKey && data.geminiApiKey !== '********') {
            newConfig.geminiApiKey = data.geminiApiKey;
        }
        if (data.anthropicApiKey && data.anthropicApiKey !== '********') {
            newConfig.anthropicApiKey = data.anthropicApiKey;
        }

        // Configs Gerais
        if (data.siteName) newConfig.siteName = data.siteName;
        if (typeof data.enableAiGeneration === 'boolean') {
            newConfig.enableAiGeneration = data.enableAiGeneration;
        }

        // Afiliados & Ads (Sem validação stricta, aceita o que vier se não for undefined)
        const fields = [
            'amazonTag', 'shopeeId', 'magaluId', 'aliexpressId', 'mercadolivreId',
            'adSensePubId', 'adSenseSlotId'
        ];

        fields.forEach(field => {
            if (data[field] !== undefined) {
                newConfig[field] = data[field];
            }
        });

        await context.env.ADMIN_KV.put('admin:config', JSON.stringify(newConfig));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Erro ao salvar configurações' }), { status: 500 });
    }
};
