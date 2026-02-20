import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import researcherService from '../services/researcher.service';
import domainService from '../services/domain.service';
import './Researchers.css';

const Researchers = () => {
    const [researchers, setResearchers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resData, domData] = await Promise.all([
                researcherService.getAll(),
                domainService.getAll()
            ]);
            setResearchers(resData);
            setDomains(domData);
        } catch (error) {
            console.error('Erreur chargement chercheurs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm, selectedDomain]);

    const handleSearch = async () => {
        try {
            const params = {};
            if (searchTerm) params.nom = searchTerm; // on cherche par nom (ou prénom)
            if (selectedDomain) params.domaine = selectedDomain;
            const results = await researcherService.search(params);
            setResearchers(results);
        } catch (error) {
            console.error('Erreur recherche:', error);
        }
    };

    if (loading) return <div className="loader">Chargement...</div>;

    return (
        <motion.div
            className="researchers-page container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1>Chercheurs</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="search-select"
                >
                    <option value="">Tous les domaines</option>
                    {domains.map(d => (
                        <option key={d.id} value={d.nom}>{d.nom}</option>
                    ))}
                </select>
            </div>

            {researchers.length === 0 ? (
                <p className="no-results">Aucun chercheur trouvé.</p>
            ) : (
                <div className="researchers-grid">
                    {researchers.map(researcher => (
                        <motion.div
                            key={researcher.id}
                            className="researcher-card"
                            whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
                        >
                            <h3><Link to={`/researchers/${researcher.id}`}>{researcher.prenom} {researcher.nom}</Link></h3>
                            <p><strong>Email:</strong> {researcher.email || 'Non renseigné'}</p>
                            <p><strong>Affiliation:</strong> {researcher.affiliation || 'Non renseignée'}</p>
                            <p><strong>Domaine principal:</strong> {researcher.domainePrincipalNom || 'Aucun'}</p>
                            <Link to={`/researchers/${researcher.id}`} className="btn-view">Voir le profil</Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Researchers;