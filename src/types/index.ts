// ============================================
// TIPOS PRINCIPAIS DO SISTEMA
// ============================================

export type ContentType = 'codigos' | 'tutorial' | 'tierlist' | 'build';
export type Difficulty = 'facil' | 'medio' | 'dificil';

// ============================================
// CÓDIGO (para guias de códigos)
// ============================================
export interface Code {
    code: string;
    reward: string;
    active: boolean;
    notes?: string;
}

// ============================================
// TIER LIST
// ============================================
export interface TierItem {
    name: string;
    reason: string;
    icon?: string;
}

export interface TierList {
    S: TierItem[];
    A: TierItem[];
    B: TierItem[];
    C: TierItem[];
    D: TierItem[];
}

// ============================================
// BUILD
// ============================================
export interface BuildItem {
    name: string;
    order: number;
    reason: string;
}

export interface Build {
    items: BuildItem[];
    skills: string[];
    combos: string[];
}

export interface Counters {
    strongAgainst: string[];
    weakAgainst: string[];
}

// ============================================
// GUIA COMPLETO
// ============================================
export interface GuideData {
    // Identificação
    id: string;
    slug: string;
    type: ContentType;
    game: string;

    // SEO
    title: string;
    subtitle: string;
    metaDescription: string;
    imageUrl: string;
    imageQuery: string;

    // Conteúdo
    content: string; // HTML
    readTime: number;
    difficulty: Difficulty;
    tags: string[];

    // Campos específicos por tipo
    codes?: Code[];
    steps?: string[];
    tips?: string[];
    commonMistakes?: string[];
    tierList?: TierList;
    build?: Build;
    counters?: Counters;

    // Metadados
    views: number;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
}

// ============================================
// API REQUESTS/RESPONSES
// ============================================
export interface GenerateContentRequest {
    query: string;
    forceRegenerate?: boolean;
}

export interface GenerateContentResponse {
    success: boolean;
    data: GuideData;
    cached: boolean;
    slug: string;
    error?: string;
}

export interface GetGuideResponse {
    success: boolean;
    data: GuideData | null;
    error?: string;
}

export interface SearchResponse {
    success: boolean;
    results: GuideData[];
    total: number;
    error?: string;
}

// ============================================
// CLOUDFLARE KV
// ============================================
export interface KVMetadata {
    game: string;
    category: ContentType;
    createdAt: string;
    views: number;
}

// ============================================
// CLAUDE API
// ============================================
export interface ClaudeMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ClaudeResponse {
    id: string;
    type: string;
    role: string;
    content: Array<{
        type: string;
        text: string;
    }>;
    model: string;
    stop_reason: string;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

// ============================================
// UNSPLASH API
// ============================================
export interface UnsplashImage {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    alt_description: string;
    user: {
        name: string;
        username: string;
    };
}
