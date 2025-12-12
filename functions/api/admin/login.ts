interface Env {
    ADMIN_KV: KVNamespace;
}

interface LoginRequest {
    username: string;
    password: string;
    adminPath: string;
}

// Função auxiliar para hash de senha (mesma do frontend)
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'SALT_SECRET_KEY');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body = await request.json() as LoginRequest;
        const { username, password, adminPath } = body;

        // Validações básicas
        if (!username || !password || !adminPath) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Credenciais incompletas',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Busca configuração do admin
        const configData = await env.ADMIN_KV.get('admin:config');

        if (!configData) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Admin não configurado. Configure no KV primeiro.',
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const config = JSON.parse(configData);

        // Verifica se o caminho do admin está correto
        if (adminPath !== config.adminPath) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Caminho de admin inválido',
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Verifica username
        if (username !== config.username) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Credenciais inválidas',
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Verifica senha
        const passwordHash = await hashPassword(password);
        if (passwordHash !== config.passwordHash) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Credenciais inválidas',
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Gera token de sessão
        const token = crypto.randomUUID();
        const sessionData = {
            username,
            adminPath,
            createdAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
        };

        // Salva sessão no KV
        await env.ADMIN_KV.put(
            `session:${token}`,
            JSON.stringify(sessionData),
            { expirationTtl: 86400 } // 24 horas
        );

        return new Response(JSON.stringify({
            success: true,
            token,
            username,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return new Response(JSON.stringify({
            success: false,
            error: `Erro interno: ${error instanceof Error ? error.message : String(error)}`,
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
