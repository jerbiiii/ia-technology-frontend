import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilePdf, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
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
            const blob = await publicationService.downloadFile(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `publication_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Erreur lors du téléchargement');
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="error-page container">{error}</div>;

    return (
        <motion.div
            className="publication-detail container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1>{publication.titre}</h1>

            <div className="detail-meta">
                <span><FaCalendarAlt /> {new Date(publication.datePublication).toLocaleDateString('fr-FR')}</span>
                {publication.doi && <span>DOI: {publication.doi}</span>}
            </div>

            <div className="detail-section">
                <h3>Résumé</h3>
                <p>{publication.resume}</p>
            </div>

            <div className="detail-section">
                <h3>Auteurs</h3>
                <div className="authors-list">
                    {publication.chercheursIds?.map(id => (
                        <Link to={`/researchers/${id}`} key={id} className="author-badge">
                            <FaUser /> Chercheur {id}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="detail-section">
                <h3>Domaines</h3>
                <div className="domains-list">
                    {publication.domainesIds?.map(id => (
                        <span key={id} className="domain-badge">
              <FaTag /> Domaine {id}
            </span>
                    ))}
                </div>
            </div>

            {publication.cheminFichier && (
                <div className="download-section">
                    <button onClick={handleDownload} className="btn-primary">
                        <FaFilePdf /> Télécharger le PDF
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default PublicationDetail;