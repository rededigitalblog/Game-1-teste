import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function Home() {
    // Helper simples para slugs otimizados
    const makeSlug = (text: string, prefix = '') => {
        const slug = text.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
        return prefix ? `/${prefix}-${slug}` : `/${slug}`;
    };

    return (
        <div className="min-h-screen bg-dark-900 text-gray-100 overflow-x-hidden selection:bg-primary-500/30">
            {/* Header Minimalista */}
            <nav className="absolute top-0 left-0 w-full z-20 p-6">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-2xl shadow-lg shadow-primary-600/20 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                            🚀
                        </div>
                        <span className="font-gaming font-bold text-xl tracking-wide group-hover:text-primary-400 transition-colors">
                            Guia Games BR
                        </span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-400">
                        <span className="hover:text-white cursor-pointer transition-colors">Populares</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Códigos</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Tier Lists</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-4 pt-20">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[128px] animate-pulse-slow"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse-slow delay-1000"></div>
                </div>

                <div className="container mx-auto text-center relative z-10 max-w-5xl">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-sm font-medium animate-fade-in-down">
                        ✨ A enciclopédia definitiva dos jogos mobile
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-gaming font-bold mb-8 leading-tight tracking-tight">
                        Domine seus <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                            Jogos Favoritos
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Guias, códigos e estratégias gerados instantaneamente para qualquer jogo que você buscar.
                    </p>

                    <SearchBar />
                </div>
            </section>

            {/* Features / Categorias */}
            <section className="py-20 px-4 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '🎁', title: 'Códigos', desc: 'Diamantes & Skins', slug: 'codigos-jogos-mobile-populares', color: 'from-blue-500/20 to-blue-600/5' },
                            { icon: '🏆', title: 'Tier Lists', desc: 'Meta Atual', slug: 'tier-list-melhores-personagens-rpg', color: 'from-yellow-500/20 to-yellow-600/5' },
                            { icon: '⚔️', title: 'Builds', desc: 'Combos & Itens', slug: 'melhores-builds-jogos-mobile', color: 'from-red-500/20 to-red-600/5' },
                            { icon: '📚', title: 'Tutoriais', desc: 'Passo a Passo', slug: 'guia-iniciante-jogos-mobile', color: 'from-green-500/20 to-green-600/5' },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                to={`/${item.slug}`}
                                className={`
                                    relative overflow-hidden rounded-2xl p-8 border border-dark-700 bg-dark-800/80 backdrop-blur-sm
                                    hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] 
                                    transition-all duration-300 group hover:-translate-y-1
                                `}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                <div className="relative z-10">
                                    <div className="text-4xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 inline-block">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-gray-100">{item.title}</h3>
                                    <p className="text-gray-400 font-medium">{item.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Games */}
            <section className="py-20 px-4 bg-dark-800/30 border-t border-dark-800">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl md:text-3xl font-gaming font-bold text-gray-100">
                            Em alta na comunidade 🔥
                        </h2>
                    </div>

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
                                className="group bg-dark-800 rounded-xl p-6 text-center border border-dark-700 hover:border-primary-500/50 hover:bg-dark-700 transition-all cursor-pointer"
                            >
                                <div className="text-4xl mb-3 transform group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">{game.icon}</div>
                                <p className="font-semibold text-gray-300 group-hover:text-white transition-colors">{game.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
