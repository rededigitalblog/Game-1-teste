// Tipos para o Admin
export interface AdminConfig {
    adminPath: string; // URL customizada do admin
    username: string;
    passwordHash: string;
    siteTitle: string;
    siteDescription: string;
    postsPerPage: number;
}

export interface AdminSession {
    authenticated: boolean;
    expiresAt: number;
}

export interface PostEdit {
    id: string;
    title: string;
    subtitle: string;
    content: string; // HTML
    imageUrl: string;
    tags: string[];
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}

export interface AdminStats {
    totalPosts: number;
    totalViews: number;
    postsToday: number;
    topPosts: Array<{
        title: string;
        views: number;
        slug: string;
    }>;
}
