import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ═══════════════════════════════════════════
// PAGES PUBLIQUES (accessibles SANS connexion)
// ═══════════════════════════════════════════
import HomePage           from './pages/HomePage';          // accueil libre
import PublicationsPage   from './pages/Publications';  // liste des publications
import PublicationDetail  from './pages/PublicationDetail'; // détail + téléchargement
import ResearchersPage    from './pages/Researchers';   // liste des chercheurs
import ResearcherDetail   from './pages/ResearcherDetail';  // profil chercheur
import SearchPage         from './pages/SearchPage';        // recherche multi-critère

// Auth
import LoginPage          from './pages/Login';
import RegisterPage       from './pages/Register';
import UnauthorizedPage   from './pages/UnauthorizedPage';

// ═══════════════════════════════════════════
// PAGES PRIVÉES
// ═══════════════════════════════════════════
import UserProfile        from './pages/Profile';       // profil utilisateur (login requis)
import AdminPanel         from './pages/AdminPanel';        // panneau admin (ROLE_ADMIN)
import ModerateurPanel    from './pages/moderator/ModeratorPanel';   // panneau modérateur (ROLE_MODERATEUR)

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <main>
                    <Routes>

                        {/* ─────────────────────────────────────────── */}
                        {/* ROUTES PUBLIQUES – pas de garde d'auth       */}
                        {/* ─────────────────────────────────────────── */}
                        <Route path="/"                       element={<HomePage />} />
                        <Route path="/publications"           element={<PublicationsPage />} />
                        <Route path="/publications/:id"       element={<PublicationDetail />} />
                        <Route path="/researchers"            element={<ResearchersPage />} />
                        <Route path="/researchers/:id"        element={<ResearcherDetail />} />
                        <Route path="/search"                 element={<SearchPage />} />
                        <Route path="/login"                  element={<LoginPage />} />
                        <Route path="/register"               element={<RegisterPage />} />
                        <Route path="/unauthorized"           element={<UnauthorizedPage />} />

                        {/* ─────────────────────────────────────────── */}
                        {/* ROUTES PRIVÉES – login requis                */}
                        {/* ─────────────────────────────────────────── */}
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <UserProfile />
                            </PrivateRoute>
                        } />

                        {/* Espace Administrateur – ROLE_ADMIN requis */}
                        <Route path="/admin/*" element={
                            <PrivateRoute role="ROLE_ADMIN">
                                <AdminPanel />
                            </PrivateRoute>
                        } />

                        {/* Espace Modérateur – ROLE_MODERATEUR requis */}
                        <Route path="/moderateur/*" element={
                            <PrivateRoute role="ROLE_MODERATEUR">
                                <ModerateurPanel />
                            </PrivateRoute>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={<HomePage />} />

                    </Routes>
                </main>
                <Footer />
            </AuthProvider>
        </Router>
    );
}

export default App;