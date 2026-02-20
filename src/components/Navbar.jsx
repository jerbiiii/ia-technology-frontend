import { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/* ══════════════════════════════════════════════
   Navbar – affiche les liens selon le rôle :
   • Non connecté : Accueil, Publications, Chercheurs, Recherche, Connexion, Inscription
   • Utilisateur  : + Mon Profil, Déconnexion
   • Modérateur   : + Espace Modérateur
   • Admin        : + Administration
   ══════════════════════════════════════════════ */

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isMod   = user?.roles?.includes('ROLE_MODERATEUR');

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <header className="navbar">
            <div className="navbar__inner">

                {/* Logo */}
                <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
                    <span className="navbar__brand-icon">🔬</span>
                    IA-Technology
                </Link>

                {/* Burger (mobile) */}
                <button
                    className={`navbar__burger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(m => !m)}
                    aria-label="Menu"
                >
                    <span /><span /><span />
                </button>

                {/* Nav links */}
                <nav className={`navbar__nav ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/"            end onClick={() => setMenuOpen(false)}>Accueil</NavLink>
                    <NavLink to="/publications"    onClick={() => setMenuOpen(false)}>Publications</NavLink>
                    <NavLink to="/researchers"     onClick={() => setMenuOpen(false)}>Chercheurs</NavLink>
                    <NavLink to="/search"          onClick={() => setMenuOpen(false)}>🔍 Recherche</NavLink>

                    {/* Liens selon rôle */}
                    {isAdmin && (
                        <NavLink to="/admin" className="navbar__role-link admin" onClick={() => setMenuOpen(false)}>
                            ⚙️ Administration
                        </NavLink>
                    )}
                    {isMod && !isAdmin && (
                        <NavLink to="/moderateur" className="navbar__role-link mod" onClick={() => setMenuOpen(false)}>
                            📋 Modération
                        </NavLink>
                    )}
                </nav>

                {/* Auth zone */}
                <div className={`navbar__auth ${menuOpen ? 'open' : ''}`}>
                    {user ? (
                        <div className="navbar__user-menu">
                            <Link to="/profile" className="navbar__avatar" onClick={() => setMenuOpen(false)}>
                                {user.email?.[0]?.toUpperCase() ?? '?'}
                            </Link>
                            <div className="navbar__dropdown">
                                <Link to="/profile" onClick={() => setMenuOpen(false)}>Mon profil</Link>
                                <button onClick={handleLogout}>Déconnexion</button>
                            </div>
                        </div>
                    ) : (
                        <div className="navbar__auth-btns">
                            <Link to="/login"    className="navbar__btn-login"    onClick={() => setMenuOpen(false)}>Connexion</Link>
                            <Link to="/register" className="navbar__btn-register" onClick={() => setMenuOpen(false)}>S'inscrire</Link>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;