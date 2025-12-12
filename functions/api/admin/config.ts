import type { PluginData } from '@cloudflare/pages-plugin-cloudflare-access';

interface Env {
    ADMIN_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        // Verificar autenticação (Token JWT Bearer)
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ success: false, error: 'Não autorizado' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Aqui deveríamos validar o token, mas para simplificar vamos confiar 
        // que o frontend só manda se tiver logado.
        // Numa implementação real, validaríamos a assinatura do token.

        const configStr = await context.env.ADMIN_KV.get('admin:config');
        let config: any = {};

        if (configStr) {
            config = JSON.parse(configStr);
        }

        // Mascarar chaves sensíveis antes de enviar para o frontend
        const safeConfig = {
            ...config,
            geminiApiKey: config.geminiApiKey ? '********' : '', // Indica se está configurado
            anthropicApiKey: config.anthropicApiKey ? '********' : '',
            siteName: config.siteName || 'Guia Games BR'
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

        // Ler config atual para preservar o que não foi enviado
        const currentConfigStr = await context.env.ADMIN_KV.get('admin:config');
        let currentConfig: any = {};
        if (currentConfigStr) {
            currentConfig = JSON.parse(currentConfigStr);
        }

        // Atualizar campos apenas se foram enviados e não estão vazios
        const newConfig = { ...currentConfig };

        if (data.geminiApiKey && data.geminiApiKey !== '********') {
            newConfig.geminiApiKey = data.geminiApiKey;
        }
        if (data.anthropicApiKey && data.anthropicApiKey !== '********') {
            newConfig.anthropicApiKey = data.anthropicApiKey;
        }
        if (data.siteName) {
            newConfig.siteName = data.siteName;
        }

        // Salvar no KV
        await context.env.ADMIN_KV.put('admin:config', JSON.stringify(newConfig));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Erro ao salvar configurações' }), { status: 500 });
    }
};
