import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import ResearcherManagement from './admin/ResearcherManagement';
import UserManagement from './admin/UserManagement';
import PublicationManagement from './admin/PublicationManagement';
import DomainManagement from './admin/DomainManagement';
import AuditLogPage from './admin/AuditLogPage';
import AdminStats from './AdminStats';     // ✅ nouveau tableau de bord
import './AdminPanel.css';

const AdminPanel = () => {
    return (
        <div className="admin-panel container">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                Administration
            </motion.h1>

            <div className="admin-dashboard">
                <Routes>
                    {/* ✅ Page d'accueil admin = tableau de bord statistiques */}
                    <Route index element={<AdminStats />} />

                    <Route path="researchers"  element={<ResearcherManagement />} />
                    <Route path="users"        element={<UserManagement />} />
                    <Route path="domains"      element={<DomainManagement />} />
                    <Route path="publications" element={<PublicationManagement />} />
                    <Route path="audit"        element={<AuditLogPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPanel;