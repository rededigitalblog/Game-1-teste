import type { ContentType } from '../types';

/**
 * Detecta automaticamente o tipo de conteúdo baseado na query do usuário
 * Ordem de prioridade: códigos > tierlist > build > tutorial
 */
export function detectContentType(query: string): ContentType {
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. CÓDIGOS (maior prioridade)
    if (/codigos?|code|recompensa|gratis|free|redeem|gift|premio/.test(q)) {
        return 'codigos';
    }

    // 2. TIER LIST
    if (/tier\s*list|ranking|melhor|melhores|top\s*\d+|classificacao/.test(q)) {
        return 'tierlist';
    }

    // 3. BUILD/ESTRATÉGIA
    if (/build|estrategia|combo|counter|setup|loadout|equipamento/.test(q)) {
        return 'build';
    }

    // 4. TUTORIAL (fallback)
    if (/como|guia|tutorial|passo|dica|dicas|aprender|fazer/.test(q)) {
        return 'tutorial';
    }

    // Fallback padrão
    return 'tutorial';
}

/**
 * Extrai o nome do jogo da query removendo palavras-chave de tipo
 */
export function extractGameName(query: string): string {
    const removeWords = [
        'codigo', 'codigos', 'code', 'codes',
        'como', 'guia', 'tutorial', 'dica', 'dicas',
        'melhor', 'melhores', 'ranking', 'tier', 'list', 'tierlist', 'top',
        'build', 'estrategia', 'combo', 'counter', 'setup',
        'de', 'do', 'da', 'no', 'na', 'para', 'em', 'o', 'a',
        'gratis', 'free', 'ativos', 'ativo'
    ];

    let cleaned = query.toLowerCase();

    // Remove palavras-chave
    for (const word of removeWords) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        cleaned = cleaned.replace(regex, '');
    }

    // Limpa espaços extras e retorna
    return cleaned.trim().replace(/\s+/g, ' ');
}

/**
 * Valida se a query é válida para geração de conteúdo
 */
export function validateQuery(query: string): { valid: boolean; error?: string } {
    if (!query || query.trim().length === 0) {
        return { valid: false, error: 'Query vazia' };
    }

    if (query.trim().length < 3) {
        return { valid: false, error: 'Query muito curta (mínimo 3 caracteres)' };
    }

    if (query.length > 200) {
        return { valid: false, error: 'Query muito longa (máximo 200 caracteres)' };
    }

    return { valid: true };
}
