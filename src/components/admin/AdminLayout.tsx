import { ReactNode } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const navigate = useNavigate();
    const { adminPath } = useParams();

    const handleLogout = () => {
        localStorage.removeItem('admin_session');
        navigate(`/${adminPath}`);
    };

    return (
        <div className="min-h-screen bg-dark-900">
            {/* Header */}
            <header className="bg-dark-800 border-b border-dark-700">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-xl font-gaming font-bold gradient-text">
                            Guia Games BR
                        </h1>
                        <nav className="hidden md:flex space-x-6">
                            <Link to={`/${adminPath}/dashboard`} className="text-gray-300 hover:text-primary-400 transition-colors">
                                📊 Dashboard
                            </Link>
                            <Link to={`/${adminPath}/posts`} className="text-gray-300 hover:text-primary-400 transition-colors">
                                📝 Posts
                            </Link>
                            <Link to={`/${adminPath}/new-post`} className="text-gray-300 hover:text-primary-400 transition-colors">
                                ➕ Novo Post
                            </Link>
                            <Link to={`/${adminPath}/settings`} className="text-gray-300 hover:text-primary-400 transition-colors">
                                ⚙️ Configurações
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="/" target="_blank" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                            🌐 Ver Site
                        </a>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                            🚪 Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
