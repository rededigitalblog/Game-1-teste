import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateQuery } from '../utils/contentDetection';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const validation = validateQuery(query);
        if (!validation.valid) {
            setError(validation.error || 'Query inválida');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (data.success) {
                navigate(`/${data.slug}`);
            } else {
                setError(data.error || 'Erro ao consultar banco de dados');
            }
        } catch (err) {
            setError('Erro de conexão ao buscar dados');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-2 relative z-10">
            {/* Glow Effect Container */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative flex items-center">
                    <div className="absolute left-4 text-gray-400 pointer-events-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="O que você quer jogar hoje? Ex: Códigos Free Fire"
                        maxLength={50}
                        className="w-full pl-12 pr-32 py-5 bg-dark-900/90 border border-dark-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium text-lg shadow-xl"
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="absolute right-2 top-2 bottom-2 px-6 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] transform hover:scale-105 active:scale-95"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Buscando...</span>
                            </div>
                        ) : (
                            'Buscar'
                        )}
                    </button>
                </div>
            </div>

            {/* Exemplos de busca - Design Chips Melhorado */}
            <div className="mt-6 text-center animate-fade-in-up">
                <p className="text-gray-500 text-sm mb-3 font-medium tracking-wide uppercase text-xs">
                    Buscas em Alta 🔥
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    {[
                        'Códigos Roblox',
                        'Tier List RPG',
                        'Builds Mobile Legends',
                        'Genshin Impact'
                    ].map((example) => (
                        <button
                            key={example}
                            type="button"
                            onClick={() => setQuery(example)}
                            className="px-4 py-2 bg-dark-800/50 hover:bg-dark-700 text-gray-300 hover:text-white text-sm rounded-full transition-all border border-dark-600 hover:border-primary-500 hover:shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-shake">
                    {error}
                </div>
            )}
        </form>
    );
}
