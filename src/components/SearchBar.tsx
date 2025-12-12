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
                setError(data.error || 'Erro ao gerar guia');
            }
        } catch (err) {
            setError('Erro de conexão');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ex: tier free fire, códigos roblox..."
                    maxLength={50}
                    className="w-full px-6 py-4 bg-dark-800 border-2 border-dark-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>

            {/* Exemplos de busca */}
            <div className="mt-3 text-center">
                <p className="text-gray-500 text-sm mb-2">
                    💡 Use palavras-chave curtas (máx. 50 caracteres):
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {[
                        'tier free fire',
                        'códigos roblox',
                        'build yasuo',
                        'guia genshin'
                    ].map((example) => (
                        <button
                            key={example}
                            type="button"
                            onClick={() => setQuery(example)}
                            className="px-3 py-1 bg-dark-700 hover:bg-dark-600 text-gray-300 text-xs rounded-full transition-colors border border-dark-600 hover:border-primary-500"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <p className="mt-2 text-red-400 text-sm text-center">{error}</p>
            )}
        </form>
    );
}
