import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Settings() {
    const { adminPath } = useParams<{ adminPath: string }>();
    const navigate = useNavigate();

    // Estados do formulário
    // AI
    const [geminiKey, setGeminiKey] = useState('');
    const [anthropicKey, setAnthropicKey] = useState('');
    const [siteName, setSiteName] = useState('');
    const [enableAiGeneration, setEnableAiGeneration] = useState(true);

    // Afiliados
    const [amazonTag, setAmazonTag] = useState('');
    const [shopeeId, setShopeeId] = useState('');
    const [magaluId, setMagaluId] = useState('');
    const [aliexpressId, setAliexpressId] = useState('');
    const [mercadolivreId, setMercadolivreId] = useState('');

    // Ads
    const [adSensePubId, setAdSensePubId] = useState('');
    const [adSenseSlotId, setAdSenseSlotId] = useState('');

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
                const cfg = data.config;
                setGeminiKey(cfg.geminiApiKey || '');
                setAnthropicKey(cfg.anthropicApiKey || '');
                setSiteName(cfg.siteName || '');
                setEnableAiGeneration(cfg.enableAiGeneration !== false);

                // Afiliados
                setAmazonTag(cfg.amazonTag || '');
                setShopeeId(cfg.shopeeId || '');
                setMagaluId(cfg.magaluId || '');
                setAliexpressId(cfg.aliexpressId || '');
                setMercadolivreId(cfg.mercadolivreId || '');

                // Ads
                setAdSensePubId(cfg.adSensePubId || '');
                setAdSenseSlotId(cfg.adSenseSlotId || '');
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
                    enableAiGeneration: enableAiGeneration,
                    amazonTag,
                    shopeeId,
                    magaluId,
                    aliexpressId,
                    mercadolivreId,
                    adSensePubId,
                    adSenseSlotId
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
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
                <p className="text-gray-400">Gerencie as chaves de API, Afiliados e Preferências</p>
            </div>

            <div className="max-w-3xl mx-auto pb-12">
                <form onSubmit={handleSave} className="space-y-8">

                    {/* Mensagens de Feedback */}
                    {message && (
                        <div className={`p-4 rounded-lg border sticky top-4 z-10 shadow-lg ${message.type === 'success'
                                ? 'bg-green-500/90 border-green-500 text-white'
                                : 'bg-red-500/90 border-red-500 text-white'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* SEÇÃO 1: INTELIGÊNCIA ARTIFICIAL */}
                    <div className="bg-dark-800 p-8 rounded-xl border border-dark-700 space-y-6">
                        <h2 className="text-xl font-bold text-primary-400 flex items-center gap-2">
                            🤖 Inteligência Artificial
                        </h2>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Anthropic API Key (Claude)</label>
                            <input
                                type="password"
                                value={anthropicKey}
                                onChange={(e) => setAnthropicKey(e.target.value)}
                                placeholder="sk-ant-****************"
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Gemini API Key (Google)</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={geminiKey}
                                    onChange={(e) => setGeminiKey(e.target.value)}
                                    placeholder="****************"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500 font-mono"
                                />
                                {geminiKey && geminiKey !== '********' && (
                                    <p className="text-xs text-yellow-500 mt-1">Alteração pendente</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg border border-dark-600">
                            <div>
                                <h3 className="font-semibold text-gray-200">Geração Automática de Conteúdo</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Criar guias automaticamente quando um usuário buscar conteúdo inexistente.
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
                    </div>

                    {/* SEÇÃO 2: AFILIADOS */}
                    <div className="bg-dark-800 p-8 rounded-xl border border-dark-700 space-y-6">
                        <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
                            💰 Monetização & Afiliados
                        </h2>
                        <p className="text-sm text-gray-400">
                            Preencha seus IDs/Tags. O sistema gerará links de produtos relevantes no final dos posts.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Amazon Associate Tag</label>
                                <input
                                    type="text"
                                    value={amazonTag}
                                    onChange={(e) => setAmazonTag(e.target.value)}
                                    placeholder="ex: guiagames-20"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Shopee Affiliate ID/Link</label>
                                <input
                                    type="text"
                                    value={shopeeId}
                                    onChange={(e) => setShopeeId(e.target.value)}
                                    placeholder="Seu ID ou Link Universal"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Magalu ID</label>
                                <input
                                    type="text"
                                    value={magaluId}
                                    onChange={(e) => setMagaluId(e.target.value)}
                                    placeholder="ID da loja parceira"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">AliExpress ID</label>
                                <input
                                    type="text"
                                    value={aliexpressId}
                                    onChange={(e) => setAliexpressId(e.target.value)}
                                    placeholder="ID de afiliado"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-red-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Mercado Livre (ID/Campanha)</label>
                            <input
                                type="text"
                                value={mercadolivreId}
                                onChange={(e) => setMercadolivreId(e.target.value)}
                                placeholder="ID para links do ML"
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
                            />
                        </div>
                    </div>

                    {/* SEÇÃO 3: ADSENSE */}
                    <div className="bg-dark-800 p-8 rounded-xl border border-dark-700 space-y-6">
                        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                            📢 Google AdSense
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Publisher ID (pub-xxxx)</label>
                                <input
                                    type="text"
                                    value={adSensePubId}
                                    onChange={(e) => setAdSensePubId(e.target.value)}
                                    placeholder="ca-pub-0000000000000000"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Slot ID (Padrão)</label>
                                <input
                                    type="text"
                                    value={adSenseSlotId}
                                    onChange={(e) => setAdSenseSlotId(e.target.value)}
                                    placeholder="1234567890"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-dark-700 sticky bottom-0 bg-dark-900 p-4 -mx-4 md:static md:bg-transparent md:p-0">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-900/50"
                        >
                            {isSaving ? (
                                <>
                                    <span className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Salvando Alterações...
                                </>
                            ) : (
                                '💾 Salvar Todas as Configurações'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
