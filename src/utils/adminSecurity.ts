/**
 * Valida se o caminho do admin é seguro
 * Aceita: letras, números, hífen, underscore
 * Não aceita: espaços, caracteres especiais, barras
 */
export function validateAdminPath(path: string): { valid: boolean; error?: string } {
    if (!path || path.trim().length === 0) {
        return { valid: false, error: 'Caminho não pode ser vazio' };
    }

    if (path.length < 5) {
        return { valid: false, error: 'Caminho deve ter no mínimo 5 caracteres' };
    }

    if (path.length > 50) {
        return { valid: false, error: 'Caminho deve ter no máximo 50 caracteres' };
    }

    // Apenas letras, números, hífen e underscore
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(path)) {
        return { valid: false, error: 'Use apenas letras, números, - e _' };
    }

    // Não pode começar com número
    if (/^\d/.test(path)) {
        return { valid: false, error: 'Não pode começar com número' };
    }

    // Palavras reservadas
    const reserved = ['admin', 'login', 'api', 'public', 'static', 'assets'];
    if (reserved.includes(path.toLowerCase())) {
        return { valid: false, error: 'Caminho reservado pelo sistema' };
    }

    return { valid: true };
}

/**
 * Gera hash simples para senha (usar bcrypt em produção)
 */
export async function hashPassword(password: string): Promise<string> {
    // Em produção, usar bcrypt ou similar
    // Por ora, usando uma hash simples (NÃO USAR EM PRODUÇÃO REAL)
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'SALT_SECRET_KEY');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica se a senha está correta
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const inputHash = await hashPassword(password);
    return inputHash === hash;
}

/**
 * Gera token de sessão
 */
export function generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Valida formato de URL de imagem
 */
export function validateImageUrl(url: string): { valid: boolean; error?: string } {
    if (!url || url.trim().length === 0) {
        return { valid: false, error: 'URL não pode ser vazia' };
    }

    try {
        const urlObj = new URL(url);

        // Deve ser http ou https
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return { valid: false, error: 'URL deve começar com http:// ou https://' };
        }

        // Verifica extensão de imagem
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasValidExtension = validExtensions.some(ext =>
            url.toLowerCase().endsWith(ext)
        );

        if (!hasValidExtension) {
            return { valid: false, error: 'URL deve terminar com .jpg, .png, .gif, .webp ou .svg' };
        }

        return { valid: true };
    } catch {
        return { valid: false, error: 'URL inválida' };
    }
}

/**
 * Sanitiza HTML para prevenir XSS
 */
export function sanitizeHTML(html: string): string {
    // Remove scripts e eventos inline
    let sanitized = html;

    // Remove tags script
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove eventos inline (onclick, onerror, etc)
    sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: URLs
    sanitized = sanitized.replace(/javascript:/gi, '');

    return sanitized;
}
