
interface AffiliateConfig {
    amazonTag?: string;
    shopeeId?: string;
    magaluId?: string;
    aliexpressId?: string;
    mercadolivreId?: string;
}

interface AffiliateSectionProps {
    game: string;
    config: AffiliateConfig;
}

export default function AffiliateSection({ game, config }: AffiliateSectionProps) {
    // Se não tiver nenhuma config de afiliado, não renderiza nada
    const hasAnyAffiliate = Object.values(config).some(val => val && val.length > 0);
    if (!hasAnyAffiliate) return null;

    const searchTerm = encodeURIComponent(`${game} gamer`);

    const stores = [
        {
            name: 'Amazon',
            id: config.amazonTag,
            url: `https://www.amazon.com.br/s?k=${searchTerm}&tag=${config.amazonTag}`,
            color: 'bg-[#FF9900] hover:bg-[#ffad33]',
            textColor: 'text-black',
            icon: '📦'
        },
        {
            name: 'Shopee',
            id: config.shopeeId,
            // Shopee é chato com links diretos de busca para afiliado,
            // mas vamos tentar usar o link universal ou direto se o usuário colocou link
            url: config.shopeeId?.startsWith('http')
                ? config.shopeeId
                : `https://shopee.com.br/search?keyword=${searchTerm}`,
            color: 'bg-[#ee4d2d] hover:bg-[#ff5d3d]',
            textColor: 'text-white',
            icon: '🛍️'
        },
        {
            name: 'Magalu',
            id: config.magaluId,
            url: `https://www.magazineluiza.com.br/busca/${searchTerm}/?partner_id=${config.magaluId}`,
            color: 'bg-[#0086FF] hover:bg-[#3399ff]',
            textColor: 'text-white',
            icon: '🔷'
        },
        {
            name: 'Mercado Livre',
            id: config.mercadolivreId,
            url: `https://lista.mercadolivre.com.br/${searchTerm}`, // ML geralmente precisa de link builder complexo
            color: 'bg-[#FFE600] hover:bg-[#fff000]',
            textColor: 'text-black',
            icon: '🤝'
        },
        {
            name: 'AliExpress',
            id: config.aliexpressId,
            url: `https://pt.aliexpress.com/wholesale?SearchText=${searchTerm}`,
            color: 'bg-[#FF4747] hover:bg-[#ff6666]',
            textColor: 'text-white',
            icon: '🏮'
        }
    ].filter(store => store.id && store.id.length > 0);

    if (stores.length === 0) return null;

    return (
        <div className="my-12 p-6 bg-gradient-to-r from-dark-800 to-dark-700 rounded-xl border border-dark-600 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🔥</span>
                <div>
                    <h3 className="text-xl font-bold text-gray-100">
                        Ofertas Relacionadas a {game}
                    </h3>
                    <p className="text-sm text-gray-400">
                        Confira produtos, colecionáveis e acessórios recomendados
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store, idx) => (
                    <a
                        key={idx}
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${store.color} ${store.textColor} p-4 rounded-lg font-bold flex items-center justify-between transition-transform hover:scale-105 shadow-lg group`}
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-xl">{store.icon}</span>
                            {store.name}
                        </span>
                        <span className="opacity-75 group-hover:opacity-100 transition-opacity">
                            Ver Ofertas ➔
                        </span>
                    </a>
                ))}
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
                * Comprando através destes links, apoiamos o site sem custo extra para você.
            </p>
        </div>
    );
}
