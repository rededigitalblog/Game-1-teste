import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Guide from './pages/Guide';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import PostEditor from './pages/admin/PostEditor';

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
                    <Route path="/admin/:adminPath/new-post" element={<PostEditor />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
