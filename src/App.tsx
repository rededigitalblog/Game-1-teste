import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Páginas Públicas (Core Web Vitals - Keep Main Bundle Small)
import Home from './pages/Home';
import Guide from './pages/Guide';

// Lazy Load Admin Pages (Code Splitting)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const PostEditor = lazy(() => import('./pages/admin/PostEditor'));
const PostsList = lazy(() => import('./pages/admin/PostsList'));
const Settings = lazy(() => import('./pages/admin/Settings'));

// Fallback de carregamento rápido
const PageLoader = () => (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-dark-900 text-gray-100">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/:slug" element={<Guide />} />

                        {/* Admin Routes - Chunk separado */}
                        <Route path="/admin/:adminPath" element={<AdminLogin />} />
                        <Route path="/admin/:adminPath/dashboard" element={<Dashboard />} />
                        <Route path="/admin/:adminPath/posts" element={<PostsList />} />
                        <Route path="/admin/:adminPath/new-post" element={<PostEditor />} />
                        <Route path="/admin/:adminPath/settings" element={<Settings />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;
