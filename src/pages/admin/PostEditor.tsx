import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { validateImageUrl, sanitizeHTML } from '../../utils/adminSecurity';
import type { ContentType, Difficulty } from '../../types';

export default function PostEditor() {
    const { adminPath } = useParams<{ adminPath: string }>();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState<ContentType>('tutorial');
    const [difficulty, setDifficulty] = useState<Difficulty>('medio');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleImageUrlChange = (url: string) => {
        setImageUrl(url);
        if (url) {
            const validation = validateImageUrl(url);
            if (!validation.valid) {
                setError(validation.error || 'URL de imagem inválida');
            } else {
                setError('');
            }
        }
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');

        // Validações
        if (!title.trim()) {
            setError('Título é obrigatório');
            return;
        }

        if (title.length < 10 || title.length > 100) {
            setError('Título deve ter entre 10 e 100 caracteres');
            return;
        }

        if (!content.trim()) {
            setError('Conteúdo é obrigatório');
            return;
        }

        if (content.length < 100) {
            setError('Conteúdo deve ter no mínimo 100 caracteres');
            return;
        }

        if (imageUrl && !validateImageUrl(imageUrl).valid) {
            setError('URL de imagem inválida');
            return;
        }

        setIsSaving(true);

        try {
            const session = localStorage.getItem('admin_session');
            if (!session) {
                navigate(`/admin/${adminPath}`);
                return;
            }

            const { token } = JSON.parse(session);

            const response = await fetch('/api/admin/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    subtitle: subtitle.trim(),
                    content: sanitizeHTML(content),
                    imageUrl: imageUrl.trim(),
                    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                    category,
                    difficulty,
                    status,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Post salvo com sucesso!');
                setTimeout(() => {
                    navigate(`/admin/${adminPath}/posts`);
                }, 1500);
            } else {
                setError(data.error || 'Erro ao salvar post');
            }
        } catch (err) {
            setError('Erro ao salvar post');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-gaming font-bold mb-2">Novo Post</h1>
                <p className="text-gray-400">Crie um novo guia para o blog</p>
            </div>

            <div className="bg-dark-800 p-8 rounded-xl border border-dark-700">
                <div className="space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Título <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            placeholder="Ex: Códigos Free Fire Ativos Agora"
                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">{title.length}/100 caracteres</p>
                    </div>

                    {/* Subtítulo */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Subtítulo</label>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            maxLength={200}
                            placeholder="Ex: Lista atualizada com códigos funcionais"
                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500"
                        />
                    </div>

                    {/* Categoria e Dificuldade */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Categoria</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as ContentType)}
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500"
                            >
                                <option value="codigos">🎁 Códigos</option>
                                <option value="tutorial">📚 Tutorial</option>
                                <option value="tierlist">🏆 Tier List</option>
                                <option value="build">⚡ Build</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Dificuldade</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500"
                            >
                                <option value="facil">Fácil</option>
                                <option value="medio">Médio</option>
                                <option value="dificil">Difícil</option>
                            </select>
                        </div>
                    </div>

                    {/* Imagem */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Imagem (URL Externa)</label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Formatos aceitos: .jpg, .png, .gif, .webp, .svg
                        </p>
                        {imageUrl && validateImageUrl(imageUrl).valid && (
                            <div className="mt-3">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="max-w-xs rounded-lg border border-dark-600"
                                    onError={() => setError('Erro ao carregar imagem')}
                                />
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Tags</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="free fire, códigos, grátis (separadas por vírgula)"
                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500"
                        />
                    </div>

                    {/* Conteúdo HTML */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Conteúdo HTML <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={20}
                            placeholder="<p>Digite o conteúdo em HTML...</p>"
                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 font-mono text-sm focus:outline-none focus:border-primary-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">{content.length} caracteres (mín. 100)</p>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="draft"
                                    checked={status === 'draft'}
                                    onChange={(e) => setStatus(e.target.value as 'draft')}
                                    className="text-primary-600"
                                />
                                <span>Rascunho</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="published"
                                    checked={status === 'published'}
                                    onChange={(e) => setStatus(e.target.value as 'published')}
                                    className="text-primary-600"
                                />
                                <span>Publicado</span>
                            </label>
                        </div>
                    </div>

                    {/* Mensagens */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-green-400">{success}</p>
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex space-x-4">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar Post'}
                        </button>
                        <button
                            onClick={() => navigate(`/admin/${adminPath}/posts`)}
                            className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-gray-300 font-semibold rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
