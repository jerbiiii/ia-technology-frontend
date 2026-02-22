import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// ── Pages publiques ──
import HomePage          from './pages/HomePage';
import Publications      from './pages/Publications';
import PublicationDetail from './pages/PublicationDetail';
import Researchers       from './pages/Researchers';
import ResearcherDetail  from './pages/ResearcherDetail';
import SearchPage        from './pages/SearchPage';
import Login             from './pages/Login';
import Register          from './pages/Register';

// ── Pages authentifiées ──
import Profile           from './pages/Profile';

// ✅ FIX : Dashboard utilisateur ajouté
import Dashboard         from './pages/Dashboard';
import MyPublications    from './pages/dashboard/MyPublications';
import ResearcherProfile from './pages/dashboard/ResearcherProfile';

// ── Dashboard Admin ──
import AdminDashboard    from './pages/admin/AdminPanel.jsx';

// ── Dashboard Modérateur ──
// ✅ FIX : ModeratorPanel gère ses sous-routes en interne
//          (highlights, home-content, actualités)
import ModerateurPanel   from './pages/moderator/ModeratorPanel';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main>
                    <Routes>
                        {/* ══ Routes publiques ══ */}
                        <Route path="/"                 element={<HomePage />} />
                        <Route path="/publications"     element={<Publications />} />
                        <Route path="/publications/:id" element={<PublicationDetail />} />
                        <Route path="/researchers"      element={<Researchers />} />
                        <Route path="/researchers/:id"  element={<ResearcherDetail />} />
                        <Route path="/search"           element={<SearchPage />} />
                        <Route path="/login"            element={<Login />} />
                        <Route path="/register"         element={<Register />} />

                        {/* ══ Pages authentifiées ══ */}
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />

                        {/* ✅ FIX : routes dashboard utilisateur ajoutées */}
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/dashboard/publications" element={
                            <PrivateRoute>
                                <MyPublications />
                            </PrivateRoute>
                        } />
                        <Route path="/dashboard/researcher-profile" element={
                            <PrivateRoute>
                                <ResearcherProfile />
                            </PrivateRoute>
                        } />

                        {/* ══ Dashboard Admin (ADMIN uniquement) ══ */}
                        <Route path="/admin/*" element={
                            <PrivateRoute roles={['ADMIN']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />

                        {/* ══ Dashboard Modérateur (MODERATEUR ou ADMIN) ══ */}
                        <Route path="/moderateur/*" element={
                            <PrivateRoute roles={['MODERATEUR', 'ADMIN']}>
                                <ModerateurPanel />
                            </PrivateRoute>
                        } />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
}

export default App;