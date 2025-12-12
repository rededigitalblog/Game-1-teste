// ============================================
// TIPOS PRINCIPAIS DO SISTEMA (Cópia para Functions)
// ============================================

export type ContentType = 'codigos' | 'tutorial' | 'tierlist' | 'build';
export type Difficulty = 'facil' | 'medio' | 'dificil';

export interface Code {
    code: string;
    reward: string;
    active: boolean;
    notes?: string;
}

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

export interface BuildItem {
    name: string;
    order: number;
    reason: string;
    icon?: string;
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
