import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    // ✅ FIX: user.role est une STRING "ADMIN" | "MODERATEUR" | "UTILISATEUR"
    //        (pas un tableau — le backend renvoie un seul rôle par utilisateur)
    const isAdmin = user?.role === 'ADMIN';
    const isMod   = user?.role === 'MODERATEUR';

    // Fermer le dropdown si clic extérieur
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setDropOpen(false);
        setMenuOpen(false);
        logout();
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="navbar__inner">

                {/* Logo */}
                <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
                    <span className="navbar__brand-icon">🔬</span>
                    IA-Technology
                </Link>

                {/* Burger mobile */}
                <button
                    className={`navbar__burger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(m => !m)}
                    aria-label="Menu"
                >
                    <span /><span /><span />
                </button>

                {/* Liens de navigation */}
                <nav className={`navbar__nav ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/"             end onClick={() => setMenuOpen(false)}>Accueil</NavLink>
                    <NavLink to="/publications"     onClick={() => setMenuOpen(false)}>Publications</NavLink>
                    <NavLink to="/researchers"      onClick={() => setMenuOpen(false)}>Chercheurs</NavLink>
                    <NavLink to="/search"           onClick={() => setMenuOpen(false)}>🔍 Recherche</NavLink>

                    {/* ✅ FIX: user.role === 'ADMIN' (string, pas tableau) */}
                    {isAdmin && (
                        <NavLink to="/admin" className="navbar__role-link admin" onClick={() => setMenuOpen(false)}>
                            ⚙️ Administration
                        </NavLink>
                    )}
                    {/* ✅ FIX: user.role === 'MODERATEUR' — le modérateur voit son lien */}
                    {isMod && (
                        <NavLink to="/moderateur" className="navbar__role-link mod" onClick={() => setMenuOpen(false)}>
                            📋 Modération
                        </NavLink>
                    )}
                </nav>

                {/* Zone auth */}
                <div className={`navbar__auth ${menuOpen ? 'open' : ''}`}>
                    {user ? (
                        <div className="navbar__user-menu" ref={dropRef}>
                            <button
                                className="navbar__avatar"
                                onClick={() => setDropOpen(d => !d)}
                                aria-expanded={dropOpen}
                                aria-haspopup="true"
                                title={user.email}
                            >
                                {user.email?.[0]?.toUpperCase() ?? '?'}
                            </button>

                            {dropOpen && (
                                <div className="navbar__dropdown">
                                    <div className="navbar__dropdown-email">{user.email}</div>
                                    <div className="navbar__dropdown-role">
                                        {/* Badge rôle visuel */}
                                        <span className={`role-badge role-badge--${user.role?.toLowerCase()}`}>
                                            {user.role === 'ADMIN' ? '⚙️ Administrateur'
                                                : user.role === 'MODERATEUR' ? '📋 Modérateur'
                                                    : '👤 Utilisateur'}
                                        </span>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => { setDropOpen(false); setMenuOpen(false); }}
                                    >
                                        👤 Mon profil
                                    </Link>
                                    {/* ✅ Bouton déconnexion — fonctionne grâce au dropdown React-controlled */}
                                    <button onClick={handleLogout} className="navbar__logout-btn">
                                        🚪 Déconnexion
                                    </button>
                                </div>
                            )}
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