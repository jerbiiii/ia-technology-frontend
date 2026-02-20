import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaNewspaper, FaStar, FaHome } from 'react-icons/fa';
import HighlightManagement from './HighlightManagement';
import ActualiteManagement from './ActualiteManagement';
import './ModeratorPanel.css';

const ModeratorPanel = () => {
    const { user } = useAuth();

    const modules = [
        {
            path: 'highlights',
            name: 'Projets à la une',
            icon: <FaStar />,
            description: 'Gérer les projets mis en avant sur la page d\'accueil',
            color: '#ffc107'
        },
        {
            path: 'actualites',
            name: 'Actualités',
            icon: <FaNewspaper />,
            description: 'Publier et gérer les actualités et annonces',
            color: '#17a2b8'
        },
        {
            path: 'accueil',
            name: 'Contenu de l\'accueil',
            icon: <FaHome />,
            description: 'Personnaliser les sections de la page d\'accueil',
            color: '#28a745'
        }
    ];

    return (
        <div className="moderator-panel container">
            <h1>Espace Modérateur</h1>
            <p>Bienvenue, {user?.prenom} {user?.nom}!</p>

            <Routes>
                <Route path="/" element={
                    <div className="modules-grid">
                        {modules.map(module => (
                            <Link to={module.path} key={module.path} className="module-card-link">
                                <motion.div
                                    className="module-card"
                                    whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
                                    style={{ borderTop: `4px solid ${module.color}` }}
                                >
                                    <div className="module-icon" style={{ color: module.color }}>{module.icon}</div>
                                    <h3>{module.name}</h3>
                                    <p>{module.description}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                } />
                <Route path="highlights/*" element={<HighlightManagement />} />
                <Route path="actualites/*" element={<ActualiteManagement />} />
                <Route path="accueil" element={<HomeContentManagement />} />
            </Routes>
        </div>
    );
};

// Composant pour la gestion du contenu de l'accueil (placeholder)
const HomeContentManagement = () => (
    <div className="coming-soon">
        <h2>Gestion du contenu de la page d'accueil</h2>
        <p>Cette fonctionnalité sera bientôt disponible. Vous pourrez personnaliser les bannières, les sections et les textes de la page d'accueil.</p>
        <Link to="/moderator" className="btn-primary">Retour</Link>
    </div>
);

export default ModeratorPanel;