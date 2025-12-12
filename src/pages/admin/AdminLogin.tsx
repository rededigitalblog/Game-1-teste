import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminLogin() {
    const { adminPath } = useParams<{ adminPath: string }>();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Verifica se já está autenticado
        const session = localStorage.getItem('admin_session');
        if (session) {
            const sessionData = JSON.parse(session);
            if (sessionData.expiresAt > Date.now()) {
                navigate(`/${adminPath}/dashboard`);
            }
        }
    }, [adminPath, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, adminPath }),
            });

            const data = await response.json();

            if (data.success) {
                // Salva sessão
                localStorage.setItem('admin_session', JSON.stringify({
                    token: data.token,
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
                }));

                navigate(`/${adminPath}/dashboard`);
            } else {
                setError(data.error || 'Credenciais inválidas');
            }
        } catch (err) {
            setError('Erro ao fazer login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-gaming font-bold gradient-text mb-2">
                        Guia Games BR
                    </h1>
                    <p className="text-gray-400">Painel Administrativo</p>
                </div>

                {/* Login Form */}
                <div className="bg-dark-800 rounded-xl p-8 border border-dark-700">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Usuário
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="Digite seu usuário"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="Digite sua senha"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-dark-700">
                        <p className="text-gray-500 text-xs text-center">
                            🔒 Acesso restrito a administradores
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                    >
                        ← Voltar ao site
                    </button>
                </div>
            </div>
        </div>
    );
}
