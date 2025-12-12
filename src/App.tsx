import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Guide from './pages/Guide';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-dark-900">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:slug" element={<Guide />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
