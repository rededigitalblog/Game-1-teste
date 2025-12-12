import { slugify, generateId, generateKVKey } from '../../src/utils/slugify';
import type { GuideData } from '../../src/types';

interface Env {
    ADMIN_KV: KVNamespace;
    GUIDES_KV: KVNamespace;
    METADATA_KV: KVNamespace;
}

// Função auxiliar de autenticação
async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }

    const token = authHeader.split(' ')[1];
    const session = await env.ADMIN_KV.get(`session:${token}`);

    if (!session) return false;

    const sessionData = JSON.parse(session);
    if (Date.now() > sessionData.expiresAt) {
        // Limpa sessão expirada
        await env.ADMIN_KV.delete(`session:${token}`);
        return false;
    }

    return true;
}

// GET: Listar Posts
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    if (!await isAuthenticated(request, env)) {
        return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
    }

    try {
        // Busca lista de posts recentes/todos do índice
        // Em produção, isso deveria ser paginado. Para MVP, pegamos a lista 'recent:guides'
        const listData = await env.METADATA_KV.get('recent:guides');
        const posts = listData ? JSON.parse(listData) : [];

        return new Response(JSON.stringify({ success: true, posts }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Erro ao listar posts' }), { status: 500 });
    }
};

// POST: Criar Novo Post
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    if (!await isAuthenticated(request, env)) {
        return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
    }

    try {
        const body = await request.json() as any;
        const { title, content, imageUrl, tags, category, difficulty, status, subtitle } = body;

        // 1. Validar e Preparar Dados
        const id = generateId();
        const slug = slugify(title); // Gera slug baseado no título
        const now = new Date().toISOString();

        const newPost: GuideData = {
            id,
            slug,
            type: category || 'tutorial',
            game: tags[0] || 'Geral', // Usa primeira tag como "jogo" principal ou Geral
            title,
            subtitle: subtitle || '',
            metaDescription: subtitle || title, // Simplificação para MVP
            content, // HTML Sanitizado deve vir do frontend
            readTime: Math.ceil(content.length / 1000), // Estimativa grosseira
            difficulty: difficulty || 'medio',
            tags: tags || [],
            imageUrl: imageUrl || '',
            imageQuery: title,
            views: 0,
            createdAt: now,
            updatedAt: now,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
        };

        // 2. Salvar Post Completo no GUIDES_KV
        const kvKey = generateKVKey(newPost.type, newPost.game, id);

        // Salva por chave estruturada e por slug
        await Promise.all([
            env.GUIDES_KV.put(kvKey, JSON.stringify(newPost)),
            env.GUIDES_KV.put(`slug:${slug}`, JSON.stringify(newPost))
        ]);

        // 3. Atualizar Lista de Metadados (recent:guides) no METADATA_KV
        const recentKey = 'recent:guides';
        let recentGuides: any[] = [];
        const recentData = await env.METADATA_KV.get(recentKey);
        if (recentData) {
            recentGuides = JSON.parse(recentData);
        }

        // Adiciona ao topo
        recentGuides.unshift({
            id,
            slug,
            title,
            game: newPost.game,
            category: newPost.type,
            views: 0,
            createdAt: now,
            status: status || 'published'
        });

        // Limita tamanho da lista (ex: 50 itens) para não estourar KV value limit neste modelo simples
        // Em um sistema real, usaríamos paginação com cursorKV methods
        recentGuides = recentGuides.slice(0, 100);

        await env.METADATA_KV.put(recentKey, JSON.stringify(recentGuides));

        return new Response(JSON.stringify({ success: true, post: newPost }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erro ao criar post:', error);
        return new Response(JSON.stringify({ success: false, error: 'Erro ao criar post' }), { status: 500 });
    }
};
