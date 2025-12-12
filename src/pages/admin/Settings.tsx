import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Settings() {
    const { adminPath } = useParams<{ adminPath: string }>();
    const navigate = useNavigate();

    // Estados do formulário
    const [geminiKey, setGeminiKey] = useState('');
    const [anthropicKey, setAnthropicKey] = useState('');
    const [siteName, setSiteName] = useState('');
    const [enableAiGeneration, setEnableAiGeneration] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Verificar sessão
        const session = localStorage.getItem('admin_session');
        if (!session) {
            navigate(`/admin/${adminPath}`);
            return;
        }

        loadSettings();
    }, [navigate, adminPath]);

    const loadSettings = async () => {
        try {
            const session = localStorage.getItem('admin_session');
            const { token } = JSON.parse(session || '{}');

            const response = await fetch('/api/admin/config', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setGeminiKey(data.config.geminiApiKey || '');
                setAnthropicKey(data.config.anthropicApiKey || '');
                setSiteName(data.config.siteName || '');
                setEnableAiGeneration(data.config.enableAiGeneration !== false); // Padrão true se undefined
            }
        } catch (error) {
            console.error('Erro ao carregar configs:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar configurações.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const session = localStorage.getItem('admin_session');
            const { token } = JSON.parse(session || '{}');

            const response = await fetch('/api/admin/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    geminiApiKey: geminiKey,
                    anthropicApiKey: anthropicKey,
                    siteName: siteName,
                    enableAiGeneration: enableAiGeneration
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
                // Recarregar configurações após 1 segundo
                setTimeout(loadSettings, 1000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Erro ao salvar.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro de conexão ao salvar.' });
        } finally {
            setIsSaving(false);
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
            <div className="mb-8">
                <h1 className="text-3xl font-gaming font-bold mb-2">Configurações</h1>
                <p className="text-gray-400">Gerencie as chaves de API e preferências do sistema</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSave} className="bg-dark-800 p-8 rounded-xl border border-dark-700 space-y-6">

                    {/* Mensagens de Feedback */}
                    {message && (
                        <div className={`p-4 rounded-lg border ${message.type === 'success'
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Gemini API Key */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Gemini API Key (Google AI)
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                placeholder="****************"
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500 font-mono"
                            />
                            {geminiKey && geminiKey !== '********' && (
                                <p className="text-xs text-yellow-500 mt-1">Alteração pendente (clique em Salvar)</p>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Usada para gerar rascunhos e sugestões rápidas.
                        </p>
                    </div>

                    {/* Anthropic API Key */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Anthropic API Key (Claude)
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={anthropicKey}
                                onChange={(e) => setAnthropicKey(e.target.value)}
                                placeholder="sk-ant-****************"
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500 font-mono"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Principal IA recomendada para gerar guias de alta qualidade.
                        </p>
                    </div>

                    {/* AI Generation Toggle */}
                    <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg border border-dark-600">
                        <div>
                            <h3 className="font-semibold text-gray-200">Geração Automática de Conteúdo</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                Se ativado, a IA criará guias automaticamente quando um usuário buscar por algo que não existe.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={enableAiGeneration}
                                onChange={(e) => setEnableAiGeneration(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="pt-6 border-t border-dark-700">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Alterações'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
