import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Guide from './pages/Guide';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import PostEditor from './pages/admin/PostEditor';
import PostsList from './pages/admin/PostsList';
import Settings from './pages/admin/Settings';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-dark-900">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:slug" element={<Guide />} />

                    {/* Admin Routes */}
                    <Route path="/admin/:adminPath" element={<AdminLogin />} />
                    <Route path="/admin/:adminPath/dashboard" element={<Dashboard />} />
                    <Route path="/admin/:adminPath/posts" element={<PostsList />} />
                    <Route path="/admin/:adminPath/new-post" element={<PostEditor />} />
                    <Route path="/admin/:adminPath/settings" element={<Settings />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
