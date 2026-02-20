import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Publications from './pages/Publications';
import PublicationDetail from './pages/PublicationDetail';
import Researchers from './pages/Researchers';
import ResearcherDetail from './pages/ResearcherDetail';

// Pages utilisateur connecté
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Pages admin
import AdminPanel from './pages/AdminPanel';

// Pages modérateur
import ModeratorPanel from './pages/moderator/ModeratorPanel';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

const AppRoutes = () => {
    const { isAuthenticated, user } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <Navbar />
            <main>
                <Routes>
                    {/* ✅ Routes publiques (accessibles sans authentification) */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                    <Route path="/publications" element={<Publications />} />
                    <Route path="/publications/:id" element={<PublicationDetail />} />
                    <Route path="/researchers" element={<Researchers />} />
                    <Route path="/researchers/:id" element={<ResearcherDetail />} />

                    {/* ✅ Routes utilisateur connecté */}
                    <Route path="/dashboard" element={
                        <PrivateRoute roles={['UTILISATEUR', 'MODERATEUR', 'ADMIN']}>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute roles={['UTILISATEUR', 'MODERATEUR', 'ADMIN']}>
                            <Profile />
                        </PrivateRoute>
                    } />

                    {/* ✅ Routes modérateur */}
                    <Route path="/moderator/*" element={
                        <PrivateRoute roles={['MODERATEUR', 'ADMIN']}>
                            <ModeratorPanel />
                        </PrivateRoute>
                    } />

                    {/* ✅ Routes admin */}
                    <Route path="/admin/*" element={
                        <PrivateRoute roles={['ADMIN']}>
                            <AdminPanel />
                        </PrivateRoute>
                    } />

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;