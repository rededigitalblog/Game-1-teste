import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

interface PostSummary {
    id: string;
    title: string;
    slug: string;
    views: number;
    createdAt: string;
    status: 'published' | 'draft';
}

export default function PostsList() {
    const { adminPath } = useParams<{ adminPath: string }>();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const session = localStorage.getItem('admin_session');
        if (!session) {
            navigate(`/admin/${adminPath}`);
            return;
        }

        fetchPosts();
    }, [navigate, adminPath]);

    const fetchPosts = async () => {
        try {
            const session = localStorage.getItem('admin_session');
            const { token } = JSON.parse(session || '{}');

            const response = await fetch('/api/admin/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success && Array.isArray(data.posts)) {
                setPosts(data.posts);
            } else {
                setPosts([]);
                if (!data.success) setError('Erro ao carregar posts');
            }
        } catch (err) {
            setError('Erro de conexão');
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-gaming font-bold mb-2">Gerenciar Posts</h1>
                    <p className="text-gray-400">Total de {posts.length} guias publicados</p>
                </div>
                <Link
                    to={`/admin/${adminPath}/new-post`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                    <span>➕</span> Novo Post
                </Link>
            </div>

            {error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                    {error}
                </div>
            ) : (
                <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-700 text-gray-300">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Título</th>
                                    <th className="px-6 py-4 font-semibold text-center">Views</th>
                                    <th className="px-6 py-4 font-semibold text-center">Data</th>
                                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {posts.map((post) => (
                                    <tr key={post.id || Math.random().toString()} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-100 mb-1 line-clamp-1">
                                                {post.title || 'Sem título'}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${(post.status || 'published') === 'published'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {(post.status || 'published') === 'published' ? 'Publicado' : 'Rascunho'}
                                                </span>
                                                <span className="text-xs text-gray-500">/{post.slug || 'no-slug'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-400">
                                            {(post.views || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-400 text-sm">
                                            {formatDate(post.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <a
                                                href={`/${post.slug}`}
                                                target="_blank"
                                                className="text-primary-400 hover:text-primary-300 text-sm"
                                                title="Ver no site"
                                            >
                                                👁️ Ver
                                            </a>
                                            <button
                                                disabled
                                                className="text-gray-500 cursor-not-allowed text-sm"
                                                title="Edição em breve"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                disabled
                                                className="text-gray-500 cursor-not-allowed text-sm"
                                                title="Exclusão em breve"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {posts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            Nenhum post encontrado. Hora de criar o primeiro!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
