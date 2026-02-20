import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [openDrop, setOpenDrop] = useState(null); // 'admin' | 'mod' | 'user' | null
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef(null);

    // Scroll effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close dropdowns on route change
    useEffect(() => {
        setOpenDrop(null);
        setMobileOpen(false);
    }, [location.pathname]);

    // Click outside to close
    useEffect(() => {
        const handler = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenDrop(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleDrop = (name) => setOpenDrop(prev => prev === name ? null : name);
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
    const handleLogout = () => { logout(); navigate('/'); };

    const initials = user ? `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase() : '';

    return (
        <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`} ref={navRef}>
            <div className="nav__inner container">

                {/* ── LOGO ── */}
                <Link to="/" className="nav__logo">
                    <div className="nav__logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polygon points="12 2 22 8 22 16 12 22 2 16 2 8"/>
                            <line x1="12" y1="2" x2="12" y2="22"/>
                            <line x1="2" y1="8" x2="22" y2="8"/>
                            <line x1="2" y1="16" x2="22" y2="16"/>
                        </svg>
                    </div>
                    <div className="nav__logo-text">
                        <span className="nav__logo-name">IA<em>-Tech</em></span>
                        <span className="nav__logo-sub">Plateforme scientifique</span>
                    </div>
                </Link>

                {/* ── DESKTOP LINKS ── */}
                <nav className="nav__links">
                    <Link to="/" className={`nav__link ${isActive('/') && location.pathname === '/' ? 'nav__link--active' : ''}`}>
                        Accueil
                    </Link>
                    <Link to="/publications" className={`nav__link ${isActive('/publications') ? 'nav__link--active' : ''}`}>
                        Publications
                    </Link>
                    <Link to="/researchers" className={`nav__link ${isActive('/researchers') ? 'nav__link--active' : ''}`}>
                        Chercheurs
                    </Link>

                    {/* Modérateur dropdown */}
                    {isAuthenticated && (user?.role === 'MODERATEUR' || user?.role === 'ADMIN') && (
                        <div className="nav__drop-wrap">
                            <button
                                className={`nav__link nav__link--btn ${isActive('/moderator') ? 'nav__link--active' : ''}`}
                                onClick={() => toggleDrop('mod')}
                            >
                                Modération
                                <svg className={`nav__chevron ${openDrop === 'mod' ? 'nav__chevron--open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                            {openDrop === 'mod' && (
                                <div className="nav__dropdown nav__dropdown--center">
                                    <div className="nav__drop-section">Modération</div>
                                    <DropItem to="/moderator/actualites" icon="📰" label="Actualités" sub="Publier des annonces" />
                                    <DropItem to="/moderator/highlights" icon="⭐" label="Highlights" sub="Projets mis en avant" />
                                    <DropItem to="/moderator/accueil"    icon="🏗️" label="Contenu accueil" sub="Textes de la homepage" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Admin dropdown */}
                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <div className="nav__drop-wrap">
                            <button
                                className={`nav__link nav__link--btn ${isActive('/admin') ? 'nav__link--active' : ''}`}
                                onClick={() => toggleDrop('admin')}
                            >
                                Admin
                                <svg className={`nav__chevron ${openDrop === 'admin' ? 'nav__chevron--open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                            {openDrop === 'admin' && (
                                <div className="nav__dropdown nav__dropdown--center">
                                    <div className="nav__drop-section">Gestion</div>
                                    <DropItem to="/admin/researchers"  icon="👥" label="Chercheurs"  sub="Gérer les profils" />
                                    <DropItem to="/admin/publications" icon="📄" label="Publications" sub="Gérer les articles" />
                                    <DropItem to="/admin/domains"      icon="🏷️" label="Domaines"    sub="Hiérarchie des domaines" />
                                    <DropItem to="/admin/users"        icon="👤" label="Utilisateurs" sub="Comptes et rôles" />
                                    <div className="nav__drop-divider"/>
                                    <div className="nav__drop-section">Supervision</div>
                                    <DropItem to="/admin/audit"        icon="📋" label="Journal des actions" sub="Historique complet" />
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                {/* ── AUTH ── */}
                <div className="nav__auth">
                    {isAuthenticated ? (
                        <div className="nav__drop-wrap">
                            <button className="nav__user" onClick={() => toggleDrop('user')}>
                                <div className="nav__avatar">{initials}</div>
                                <div className="nav__user-info">
                                    <span className="nav__user-name">{user?.prenom} {user?.nom}</span>
                                    <span className="nav__user-role">{user?.role}</span>
                                </div>
                                <svg className={`nav__chevron ${openDrop === 'user' ? 'nav__chevron--open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                            {openDrop === 'user' && (
                                <div className="nav__dropdown nav__dropdown--right">
                                    <DropItem to="/dashboard" icon="📊" label="Mon tableau de bord" sub="Vue d'ensemble" />
                                    <DropItem to="/profile"   icon="⚙️" label="Mon profil" sub="Modifier mes infos" />
                                    <div className="nav__drop-divider"/>
                                    <button className="nav__drop-item nav__drop-item--danger" onClick={handleLogout}>
                                        <span className="nav__drop-icon">⏻</span>
                                        <div>
                                            <div className="nav__drop-label">Déconnexion</div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="nav__auth-btns">
                            <Link to="/login" className="nav__login">Connexion</Link>
                            <Link to="/register" className="nav__register">
                                S'inscrire
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── HAMBURGER ── */}
                <button
                    className={`nav__burger ${mobileOpen ? 'nav__burger--open' : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Menu"
                >
                    <span/><span/><span/>
                </button>
            </div>

            {/* ── MOBILE MENU ── */}
            {mobileOpen && (
                <div className="nav__mobile">
                    <MobileLink to="/" label="Accueil"/>
                    <MobileLink to="/publications" label="Publications"/>
                    <MobileLink to="/researchers" label="Chercheurs"/>
                    {isAuthenticated && (user?.role === 'MODERATEUR' || user?.role === 'ADMIN') && (
                        <>
                            <div className="nav__mobile-section">Modération</div>
                            <MobileLink to="/moderator/actualites" label="Actualités" sub/>
                            <MobileLink to="/moderator/highlights" label="Highlights" sub/>
                            <MobileLink to="/moderator/accueil"    label="Contenu accueil" sub/>
                        </>
                    )}
                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <>
                            <div className="nav__mobile-section">Administration</div>
                            <MobileLink to="/admin/researchers"  label="Chercheurs" sub/>
                            <MobileLink to="/admin/publications" label="Publications" sub/>
                            <MobileLink to="/admin/domains"      label="Domaines" sub/>
                            <MobileLink to="/admin/users"        label="Utilisateurs" sub/>
                            <MobileLink to="/admin/audit"        label="Journal des actions" sub/>
                        </>
                    )}
                    <div className="nav__mobile-divider"/>
                    {isAuthenticated ? (
                        <>
                            <MobileLink to="/dashboard" label="Mon tableau de bord"/>
                            <MobileLink to="/profile"   label="Mon profil"/>
                            <button className="nav__mobile-link nav__mobile-link--danger" onClick={handleLogout}>Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <MobileLink to="/login"    label="Connexion"/>
                            <MobileLink to="/register" label="S'inscrire"/>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

/* ── Sub-components ── */
const DropItem = ({ to, icon, label, sub }) => (
    <Link to={to} className="nav__drop-item">
        <span className="nav__drop-icon">{icon}</span>
        <div>
            <div className="nav__drop-label">{label}</div>
            {sub && <div className="nav__drop-sub">{sub}</div>}
        </div>
    </Link>
);

const MobileLink = ({ to, label, sub }) => (
    <Link to={to} className={`nav__mobile-link ${sub ? 'nav__mobile-link--sub' : ''}`}>
        {label}
    </Link>
);

export default Navbar;