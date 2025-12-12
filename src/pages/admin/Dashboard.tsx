import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Dashboard() {
    const { adminPath } = useParams<{ adminPath: string }>();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalViews: 0,
        postsToday: 0,
        topPosts: [] as Array<{ title: string; views: number; slug: string }>,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verifica autenticação
        const session = localStorage.getItem('admin_session');
        if (!session) {
            navigate(`/admin/${adminPath}`);
            return;
        }

        fetchStats();
    }, [navigate, adminPath]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Carregando...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-gaming font-bold mb-2">Dashboard</h1>
                <p className="text-gray-400">Visão geral do seu blog</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Total de Posts</p>
                        <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalPosts}</p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Total de Visualizações</p>
                        <span className="text-2xl">👁️</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Posts Hoje</p>
                        <span className="text-2xl">🆕</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.postsToday}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link
                    to={`/admin/${adminPath}/new-post`}
                    className="bg-primary-600 hover:bg-primary-700 p-6 rounded-xl transition-colors"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Criar Novo Post</h3>
                            <p className="text-primary-100">Escreva um novo guia para o blog</p>
                        </div>
                        <span className="text-4xl">➕</span>
                    </div>
                </Link>

                <Link
                    to={`/admin/${adminPath}/posts`}
                    className="bg-dark-800 hover:bg-dark-700 p-6 rounded-xl border border-dark-700 transition-colors"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Gerenciar Posts</h3>
                            <p className="text-gray-400">Ver, editar e deletar posts existentes</p>
                        </div>
                        <span className="text-4xl">📋</span>
                    </div>
                </Link>
            </div>

            {/* Top Posts */}
            {stats.topPosts.length > 0 && (
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <h2 className="text-xl font-bold mb-4">🏆 Posts Mais Vistos</h2>
                    <div className="space-y-3">
                        {stats.topPosts.map((post, index) => (
                            <div
                                key={post.slug}
                                className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl font-bold text-primary-400">#{index + 1}</span>
                                    <div>
                                        <p className="font-medium">{post.title}</p>
                                        <p className="text-sm text-gray-400">{post.views} visualizações</p>
                                    </div>
                                </div>
                                <a
                                    href={`/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-400 hover:text-primary-300 text-sm"
                                >
                                    Ver →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
