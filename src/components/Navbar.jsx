import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const NavigationBar = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); setDropdownOpen(null); }, [location.pathname]);

    const handleLogout = () => { logout(); navigate('/'); };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-inner container">

                {/* LOGO */}
                <Link to="/" className="nav-logo">
                    <span className="nav-logo-icon">⬡</span>
                    <span className="nav-logo-text">IA<span className="nav-logo-accent">-Tech</span></span>
                </Link>

                {/* DESKTOP LINKS */}
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Accueil</Link>
                    <Link to="/publications" className={`nav-link ${isActive('/publications') ? 'active' : ''}`}>Publications</Link>
                    <Link to="/researchers" className={`nav-link ${isActive('/researchers') ? 'active' : ''}`}>Chercheurs</Link>

                    {isAuthenticated && (user?.role === 'MODERATEUR' || user?.role === 'ADMIN') && (
                        <div className="nav-dropdown-wrap">
                            <button
                                className={`nav-link nav-dropdown-trigger ${isActive('/moderator') ? 'active' : ''}`}
                                onClick={() => setDropdownOpen(dropdownOpen === 'mod' ? null : 'mod')}
                            >
                                Modération <span className="dropdown-arrow">▾</span>
                            </button>
                            {dropdownOpen === 'mod' && (
                                <div className="nav-dropdown">
                                    <Link to="/moderator" className="nav-dropdown-item">🏠 Tableau de bord</Link>
                                    <Link to="/moderator/actualites" className="nav-dropdown-item">📰 Actualités</Link>
                                    <Link to="/moderator/highlights" className="nav-dropdown-item">⭐ Highlights</Link>
                                </div>
                            )}
                        </div>
                    )}

                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <div className="nav-dropdown-wrap">
                            <button
                                className={`nav-link nav-dropdown-trigger ${isActive('/admin') ? 'active' : ''}`}
                                onClick={() => setDropdownOpen(dropdownOpen === 'admin' ? null : 'admin')}
                            >
                                Admin <span className="dropdown-arrow">▾</span>
                            </button>
                            {dropdownOpen === 'admin' && (
                                <div className="nav-dropdown">
                                    <Link to="/admin" className="nav-dropdown-item">🏠 Dashboard</Link>
                                    <Link to="/admin/researchers" className="nav-dropdown-item">👥 Chercheurs</Link>
                                    <Link to="/admin/publications" className="nav-dropdown-item">📄 Publications</Link>
                                    <Link to="/admin/domains" className="nav-dropdown-item">🏷️ Domaines</Link>
                                    <Link to="/admin/users" className="nav-dropdown-item">👤 Utilisateurs</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* AUTH SECTION */}
                <div className="nav-auth">
                    {isAuthenticated ? (
                        <div className="nav-dropdown-wrap">
                            <button
                                className="nav-user-btn"
                                onClick={() => setDropdownOpen(dropdownOpen === 'user' ? null : 'user')}
                            >
                                <span className="nav-user-avatar">
                                    {user?.prenom?.[0]}{user?.nom?.[0]}
                                </span>
                                <span className="nav-user-info">
                                    <span className="nav-user-name">{user?.prenom}</span>
                                    <span className="nav-user-role">{user?.role}</span>
                                </span>
                                <span className="dropdown-arrow">▾</span>
                            </button>
                            {dropdownOpen === 'user' && (
                                <div className="nav-dropdown nav-dropdown-right">
                                    <Link to="/dashboard" className="nav-dropdown-item">📊 Mon tableau de bord</Link>
                                    <Link to="/profile" className="nav-dropdown-item">⚙️ Mon profil</Link>
                                    <div className="nav-dropdown-divider" />
                                    <button onClick={handleLogout} className="nav-dropdown-item nav-dropdown-danger">
                                        ⏻ Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="nav-auth-btns">
                            <Link to="/login" className="btn-ghost">Connexion</Link>
                            <Link to="/register" className="btn-primary btn-sm">S'inscrire</Link>
                        </div>
                    )}
                </div>

                {/* HAMBURGER */}
                <button
                    className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menu"
                >
                    <span /><span /><span />
                </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="nav-mobile">
                    <Link to="/" className="nav-mobile-link">Accueil</Link>
                    <Link to="/publications" className="nav-mobile-link">Publications</Link>
                    <Link to="/researchers" className="nav-mobile-link">Chercheurs</Link>
                    {isAuthenticated && (user?.role === 'MODERATEUR' || user?.role === 'ADMIN') && (
                        <>
                            <div className="nav-mobile-section">MODÉRATION</div>
                            <Link to="/moderator/actualites" className="nav-mobile-link nav-mobile-sub">Actualités</Link>
                            <Link to="/moderator/highlights" className="nav-mobile-link nav-mobile-sub">Highlights</Link>
                        </>
                    )}
                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <>
                            <div className="nav-mobile-section">ADMIN</div>
                            <Link to="/admin/researchers" className="nav-mobile-link nav-mobile-sub">Chercheurs</Link>
                            <Link to="/admin/publications" className="nav-mobile-link nav-mobile-sub">Publications</Link>
                            <Link to="/admin/users" className="nav-mobile-link nav-mobile-sub">Utilisateurs</Link>
                        </>
                    )}
                    <div className="nav-mobile-divider" />
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-mobile-link">Mon dashboard</Link>
                            <Link to="/profile" className="nav-mobile-link">Mon profil</Link>
                            <button onClick={handleLogout} className="nav-mobile-link nav-mobile-danger">Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-mobile-link">Connexion</Link>
                            <Link to="/register" className="nav-mobile-link">S'inscrire</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavigationBar;