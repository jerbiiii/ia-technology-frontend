import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer__top">
                <div className="footer__brand">
                    <div className="footer__logo">
                        <div className="footer__logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <polygon points="12 2 22 8 22 16 12 22 2 16 2 8"/>
                                <line x1="12" y1="2" x2="12" y2="22"/>
                                <line x1="2" y1="8" x2="22" y2="8"/>
                                <line x1="2" y1="16" x2="22" y2="16"/>
                            </svg>
                        </div>
                        <span>IA<em>-Technology</em></span>
                    </div>
                    <p className="footer__desc">
                        Plateforme de gestion et diffusion des publications scientifiques
                        en Intelligence Artificielle.
                    </p>
                    <div className="footer__status">
                        <span className="footer__status-dot"/>
                        Système opérationnel
                    </div>
                </div>

                <div className="footer__links-grid">
                    <div className="footer__group">
                        <div className="footer__group-title">Plateforme</div>
                        <Link to="/publications" className="footer__link">Publications</Link>
                        <Link to="/researchers"  className="footer__link">Chercheurs</Link>
                        <Link to="/"             className="footer__link">Actualités</Link>
                    </div>
                    <div className="footer__group">
                        <div className="footer__group-title">Compte</div>
                        <Link to="/login"    className="footer__link">Connexion</Link>
                        <Link to="/register" className="footer__link">Inscription</Link>
                        <Link to="/profile"  className="footer__link">Mon profil</Link>
                    </div>

                </div>
            </div>

            <div className="footer__bottom">
                <span className="footer__copy">
                    © 2026 IA-Technology · Mini Projet Développement Web Avancé
                </span>
                <div className="footer__tech">
                    <span className="footer__tech-dot"/>
                    Spring Boot · React · MySQL
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;