interface Env {
    ADMIN_KV: KVNamespace;
    METADATA_KV: KVNamespace;
}

async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    const session = await env.ADMIN_KV.get(`session:${token}`);
    return !!session; // Simplificado, ideal verificar expiração
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    // Verifica Auth (opcional para stats, mas recomendado)
    // if (!await isAuthenticated(request, env)) return new Response("Unauthorized", { status: 401 });

    try {
        const listData = await env.METADATA_KV.get('recent:guides');
        const posts: any[] = listData ? JSON.parse(listData) : [];

        const totalPosts = posts.length;

        // Calcula views totais e posts de hoje
        let totalViews = 0;
        let postsToday = 0;
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        posts.forEach(post => {
            totalViews += (post.views || 0);
            if (post.createdAt && post.createdAt.startsWith(todayStr)) {
                postsToday++;
            }
        });

        // Top posts (ordenação simples no array em memória)
        // Nota: KV não é banco relacional, sorting ideal seria no insert ou via worker cron
        const topPosts = [...posts]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
            .map(p => ({
                title: p.title,
                views: p.views || 0,
                slug: p.slug
            }));

        const stats = {
            totalPosts,
            totalViews,
            postsToday,
            topPosts
        };

        return new Response(JSON.stringify({ success: true, stats }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Erro ao carregar estatísticas' }), { status: 500 });
    }
};
