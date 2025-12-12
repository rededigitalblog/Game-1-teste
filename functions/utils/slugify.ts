/**
 * Gera um slug amigável para URLs a partir de um texto
 * Remove acentos, caracteres especiais e converte para lowercase
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
}

/**
 * Gera um ID único baseado em timestamp e random
 */
export function generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return `${timestamp}-${random}`;
}

/**
 * Gera uma chave para o Cloudflare KV
 * Formato: guide:{tipo}:{jogo}:{id}
 */
export function generateKVKey(type: string, game: string, id: string): string {
    const gameSlug = slugify(game);
    return `guide:${type}:${gameSlug}:${id}`;
}

/**
 * Extrai informações de uma chave KV
 */
export function parseKVKey(key: string): {
    type: string;
    game: string;
    id: string;
} | null {
    const parts = key.split(':');
    if (parts.length !== 4 || parts[0] !== 'guide') {
        return null;
    }

    return {
        type: parts[1],
        game: parts[2],
        id: parts[3],
    };
}
