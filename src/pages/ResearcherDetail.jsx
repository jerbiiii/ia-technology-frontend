import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import researcherService from '../services/researcher.service';
import publicationService from '../services/publication.service';
import './ResearcherDetail.css';

const ResearcherDetail = () => {
    const { id } = useParams();
    const [researcher, setResearcher] = useState(null);
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const researcherData = await researcherService.getById(id);
                setResearcher(researcherData);
                // Récupérer les publications de ce chercheur
                const pubsData = await publicationService.search({ chercheurId: id });
                setPublications(pubsData);
            } catch (error) {
                console.error('Erreur chargement chercheur:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="loader">Chargement...</div>;
    if (!researcher) return <div className="error">Chercheur non trouvé</div>;

    return (
        <motion.div
            className="researcher-detail container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Link to="/researchers" className="back-link">← Retour à la liste</Link>

            <div className="profile-header">
                <h1>{researcher.prenom} {researcher.nom}</h1>
                <p className="affiliation">{researcher.affiliation || 'Affiliation non renseignée'}</p>
                <p className="email">{researcher.email && `Email: ${researcher.email}`}</p>
            </div>

            <div className="domains-section">
                <h2>Domaines de recherche</h2>
                <div className="domain-tags">
                    {researcher.domainePrincipal && (
                        <span className="domain-tag principal">
              Principal: {researcher.domainePrincipalNom}
            </span>
                    )}
                    {researcher.autresDomainesIds?.map(domainId => (
                        <span key={domainId} className="domain-tag secondary">
              Domaine {domainId}
            </span>
                    ))}
                </div>
            </div>

            <div className="publications-section">
                <h2>Publications ({publications.length})</h2>
                {publications.length === 0 ? (
                    <p>Aucune publication trouvée.</p>
                ) : (
                    <div className="publications-grid">
                        {publications.map(pub => (
                            <div key={pub.id} className="publication-card">
                                <h3>
                                    <Link to={`/publications/${pub.id}`}>{pub.titre}</Link>
                                </h3>
                                <p className="publication-date">
                                    {pub.datePublication ? new Date(pub.datePublication).toLocaleDateString('fr-FR') : 'Date inconnue'}
                                </p>
                                <p className="publication-abstract">
                                    {pub.resume ? (pub.resume.length > 150 ? pub.resume.substring(0,150)+'...' : pub.resume) : 'Aucun résumé'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ResearcherDetail;