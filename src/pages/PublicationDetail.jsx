import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilePdf, FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import publicationService from '../services/publication.service';
import Loader from '../components/Loader';
import './PublicationDetail.css';

const PublicationDetail = () => {
    const { id } = useParams();
    const [publication, setPublication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPublication();
    }, [id]);

    const fetchPublication = async () => {
        try {
            const data = await publicationService.getById(id);
            setPublication(data);
        } catch (err) {
            setError('Publication non trouvée');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            await publicationService.downloadFile(id);
        } catch (err) {
            alert('Erreur lors du téléchargement');
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="error-page container">{error}</div>;

    const chercheurs = publication.chercheursNoms
        ? Array.from(publication.chercheursNoms)
        : [];

    const domainesNoms = publication.domainesNoms
        ? Array.from(publication.domainesNoms)
        : [];

    // Associer id et nom pour les chercheurs
    const chercheursIds = publication.chercheursIds
        ? Array.from(publication.chercheursIds)
        : [];

    return (
        <motion.div
            className="publication-detail container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link to="/publications" className="back-link">
                <FaArrowLeft /> Retour aux publications
            </Link>

            <h1>{publication.titre}</h1>

            <div className="detail-meta">
                <span><FaCalendarAlt /> {publication.datePublication
                    ? new Date(publication.datePublication).toLocaleDateString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })
                    : 'Date inconnue'}
                </span>
                {publication.doi && (
                    <span className="doi-link">
                        DOI : <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer">
                            {publication.doi} <FaExternalLinkAlt size={12} />
                        </a>
                    </span>
                )}
            </div>

            {publication.resume && (
                <div className="detail-section">
                    <h3>Résumé</h3>
                    <p>{publication.resume}</p>
                </div>
            )}

            <div className="detail-section">
                <h3><FaUser /> Auteurs</h3>
                <div className="authors-list">
                    {chercheursIds.length > 0 ? (
                        chercheursIds.map((chercheurId, index) => (
                            <Link
                                to={`/researchers/${chercheurId}`}
                                key={chercheurId}
                                className="author-badge"
                            >
                                <FaUser />
                                {/* Utiliser le nom si disponible, sinon fallback */}
                                {chercheurs[index] || `Chercheur #${chercheurId}`}
                            </Link>
                        ))
                    ) : (
                        <p className="empty-info">Aucun auteur renseigné</p>
                    )}
                </div>
            </div>

            <div className="detail-section">
                <h3><FaTag /> Domaines</h3>
                <div className="domains-list">
                    {domainesNoms.length > 0 ? (
                        domainesNoms.map((nom, index) => (
                            <span key={index} className="domain-badge">
                                <FaTag /> {nom}
                            </span>
                        ))
                    ) : (
                        <p className="empty-info">Aucun domaine renseigné</p>
                    )}
                </div>
            </div>

            {publication.cheminFichier && (
                <div className="download-section">
                    <button onClick={handleDownload} className="btn-primary btn-download">
                        <FaFilePdf /> Télécharger le PDF
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default PublicationDetail;