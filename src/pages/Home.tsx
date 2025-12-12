import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function Home() {
    // Helper simples para slugs otimizados
    const makeSlug = (text: string, prefix = '') => {
        const slug = text.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, '-'); // Espaço vira traço
        return prefix ? `/${prefix}-${slug}` : `/${slug}`;
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-primary-900/20 via-dark-900 to-purple-900/20">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-gaming font-bold mb-6">
                        <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                            Guia Games BR
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-4">
                        Códigos, Guias, Tier Lists e Builds
                    </p>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-12">
                        Geração automática de conteúdo com IA para os melhores jogos mobile do Brasil
                    </p>

                    <SearchBar />
                </div>
            </section>

            {/* Features / Categorias */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl md:text-4xl font-gaming font-bold text-center mb-12 text-gray-100">
                        O que você procura?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '🎁', title: 'Códigos', desc: 'Resgatar recompensas', slug: 'codigos-jogos-mobile-populares' },
                            { icon: '📚', title: 'Guias', desc: 'Tutoriais e dicas', slug: 'guia-iniciante-jogos-mobile' },
                            { icon: '🏆', title: 'Tier Lists', desc: 'Rankings do meta', slug: 'tier-list-melhores-personagens-rpg' },
                            { icon: '⚡', title: 'Builds', desc: 'Estratégias meta', slug: 'melhores-builds-jogos-mobile' },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                to={`/${item.slug}`}
                                className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500 hover:bg-dark-700/50 transition-all group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-2 text-gray-100">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Games */}
            <section className="py-16 px-4 bg-dark-800/50">
                <div className="container mx-auto">
                    <h2 className="text-3xl md:text-4xl font-gaming font-bold text-center mb-12 text-gray-100">
                        Jogos Populares
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { name: 'Free Fire', icon: '🔥' },
                            { name: 'Mobile Legends', icon: '⚔️' },
                            { name: 'Genshin Impact', icon: '✨' },
                            { name: 'Roblox', icon: '🎮' },
                            { name: 'Brawl Stars', icon: '⭐' },
                            { name: 'Clash Royale', icon: '👑' },
                        ].map((game, i) => (
                            <Link
                                key={i}
                                to={makeSlug(game.name, 'codigos')}
                                className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700 hover:border-primary-500 hover:bg-dark-700/50 transition-all cursor-pointer group"
                            >
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">{game.icon}</div>
                                <p className="font-semibold text-gray-100">{game.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
