import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { GuideData } from '../types';
import AdPlaceholder from '../components/AdPlaceholder';
import AffiliateSection from '../components/AffiliateSection';

interface MonetizationConfig {
    amazonTag?: string;
    shopeeId?: string;
    magaluId?: string;
    aliexpressId?: string;
    mercadolivreId?: string;
    adSensePubId?: string;
    adSenseSlotId?: string;
}

export default function Guide() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [guide, setGuide] = useState<GuideData | null>(null);
    const [monetization, setMonetization] = useState<MonetizationConfig>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slug) {
            navigate('/');
            return;
        }
        fetchGuide();
    }, [slug]);

    const fetchGuide = async () => {
        try {
            const response = await fetch(`/api/get-guide/${slug}`);
            const data = await response.json();

            if (data.success && data.data) {
                setGuide(data.data);
                if (data.monetization) {
                    setMonetization(data.monetization);
                }
                document.title = `${data.data.title} | Guia Games BR`;
            } else {
                setError(data.error || 'Guia não encontrado');
            }
        } catch (err) {
            setError('Erro ao carregar guia');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Carregando guia...</p>
                </div>
            </div>
        );
    }

    if (error || !guide) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Erro</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-16 px-4 bg-gradient-to-br from-primary-900/20 via-dark-900 to-purple-900/20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-gaming font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                        {guide.title}
                    </h1>
                    {guide.subtitle && (
                        <p className="text-xl text-gray-300 mb-6">{guide.subtitle}</p>
                    )}
                    <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30">
                            {guide.difficulty === 'facil' ? 'Fácil' : guide.difficulty === 'medio' ? 'Médio' : 'Difícil'}
                        </span>
                        <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30">
                            ⏱️ {guide.readTime} min
                        </span>
                        <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30">
                            🎮 {guide.game}
                        </span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 px-4">
                <div className="container mx-auto max-w-4xl">

                    {/* AD Space: Topo */}
                    <AdPlaceholder
                        pubId={monetization.adSensePubId}
                        slotId={monetization.adSenseSlotId}
                        label="Anúncio Topo"
                    />

                    <div className="bg-dark-800 rounded-xl p-8 md:p-12 border border-dark-700">
                        {/* Códigos */}
                        {guide.codes && guide.codes.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-gaming font-bold mb-6 text-gray-100">
                                    🎁 Códigos Ativos
                                </h2>
                                <div className="space-y-4">
                                    {guide.codes.map((code, i) => (
                                        <div key={i} className="bg-dark-700 border border-dark-600 rounded-lg p-4">
                                            <div className="flex items-center justify-between flex-wrap gap-4">
                                                <div>
                                                    <code className="px-4 py-2 bg-dark-900 text-primary-400 font-mono text-lg font-bold rounded border border-primary-500/30">
                                                        {code.code}
                                                    </code>
                                                    <p className="text-gray-300 mt-2">{code.reward}</p>
                                                    {code.notes && <p className="text-gray-500 text-sm mt-1">{code.notes}</p>}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(code.code);
                                                        alert('Código copiado!');
                                                    }}
                                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm"
                                                >
                                                    📋 Copiar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content HTML */}
                        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-primary-400 prose-strong:text-primary-300 mb-12">
                            {typeof guide.content === 'string' ? (
                                <div dangerouslySetInnerHTML={{ __html: guide.content }} />
                            ) : (
                                <div className="text-gray-300 whitespace-pre-wrap">
                                    {Array.isArray(guide.content)
                                        ? (guide.content as string[]).join('\n')
                                        : JSON.stringify(guide.content)}
                                </div>
                            )}
                        </div>

                        {/* AD Space: Meio do Conteúdo */}
                        <AdPlaceholder
                            pubId={monetization.adSensePubId}
                            slotId={monetization.adSenseSlotId}
                            label="Anúncio Meio"
                        />

                        {/* Steps (Passo a Passo) */}
                        {guide.steps && guide.steps.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-gaming font-bold mb-6 text-gray-100">📝 Passo a Passo</h2>
                                <div className="space-y-6">
                                    {guide.steps.map((step, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-primary-900/50">
                                                {i + 1}
                                            </div>
                                            <div className="bg-dark-700/50 rounded-lg p-6 border border-dark-600 flex-grow">
                                                <p className="text-gray-200 text-lg leading-relaxed">{step}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tier List */}
                        {guide.tierList && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-gaming font-bold mb-6 text-gray-100">🏆 Tier List</h2>
                                <div className="space-y-4">
                                    {Object.entries(guide.tierList).map(([tier, items]) => (
                                        <div key={tier} className="flex items-stretch border border-dark-600 rounded-lg overflow-hidden">
                                            <div className={`w-24 flex-shrink-0 flex items-center justify-center text-2xl font-bold
                                                ${tier === 'S' ? 'bg-red-600 text-white' :
                                                    tier === 'A' ? 'bg-orange-500 text-white' :
                                                        tier === 'B' ? 'bg-yellow-500 text-black' :
                                                            tier === 'C' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                                {tier}
                                            </div>
                                            <div className="bg-dark-700 p-4 flex-grow flex flex-wrap gap-2">
                                                {items.map((item: any, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-dark-900 rounded border border-dark-600 text-gray-200" title={item.reason}>
                                                        {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tips */}
                        {guide.tips && guide.tips.length > 0 && (
                            <div className="mt-12 p-6 bg-primary-500/10 border border-primary-500/30 rounded-xl">
                                <h3 className="text-xl font-gaming font-bold mb-4 text-gray-100">💡 Dicas Extras</h3>
                                <ul className="space-y-2">
                                    {guide.tips.map((tip, i) => (
                                        <li key={i} className="flex gap-3 items-start text-gray-300">
                                            <span className="text-primary-400 mt-1">▸</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* SEÇÃO DE AFILIADOS E OFERTAS */}
                        <AffiliateSection game={guide.game} config={monetization} />

                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            🔍 Buscar Outro Guia
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
