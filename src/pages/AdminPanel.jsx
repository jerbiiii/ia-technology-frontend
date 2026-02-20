import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ResearcherManagement from './admin/ResearcherManagement';
import UserManagement from './admin/UserManagement';
import PublicationManagement from './admin/PublicationManagement';
import DomainManagement from './admin/DomainManagement'; // si existant
import './AdminPanel.css';

const AdminPanel = () => {
    const adminSections = [
        { path: "researchers", label: "Chercheurs", icon: "👥", description: "Gérer les chercheurs" },
        { path: "users", label: "Utilisateurs", icon: "👤", description: "Gérer les comptes utilisateurs" },
        { path: "domains", label: "Domaines", icon: "🏷️", description: "Gérer les domaines de recherche" },
        { path: "publications", label: "Publications", icon: "📄", description: "Gérer les publications" }
    ];

    return (
        <div className="admin-panel container">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Administration
            </motion.h1>

            <div className="admin-dashboard">
                <Routes>
                    {/* Route par défaut : afficher les cartes */}
                    <Route index element={
                        <div className="admin-cards">
                            {adminSections.map((section, index) => (
                                <motion.div
                                    key={section.path}
                                    className="admin-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
                                >
                                    <Link to={section.path} className="card-link">
                                        <div className="card-icon">{section.icon}</div>
                                        <h3>{section.label}</h3>
                                        <p>{section.description}</p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    } />

                    {/* Routes des sous-sections */}
                    <Route path="researchers" element={<ResearcherManagement />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="domains" element={<DomainManagement />} />
                    <Route path="publications" element={<PublicationManagement />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPanel;