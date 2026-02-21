import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import AuthService from '../services/auth.service';
import './PublicationDetail.css';

/* ══════════════════════════════════════════════
   Détail d'une Publication – ACCÈS LIBRE pour consultation
   ══════════════════════════════════════════════ */

const PublicationDetail = () => {
    const { id }      = useParams();
    const navigate    = useNavigate();
    const [pub, setPub]         = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [downloading, setDl]  = useState(false);

    useEffect(() => {
        api.get(`/publications/${id}`)
            .then(r => setPub(r.data))
            .catch(() => setError('Publication introuvable.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDownload = async () => {
        setDl(true);
        try {
            const response = await api.get(`/publications/${id}/download`, {
                responseType: 'blob',
            });
            const url  = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href  = url;
            const disposition = response.headers['content-disposition'];
            const filename = disposition
                ? disposition.split('filename=')[1]?.replace(/"/g, '')
                : `publication-${id}.pdf`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            alert('Erreur lors du téléchargement.');
        } finally {
            setDl(false);
        }
    };

    if (loading) return (
        <div className="pub-detail-loading">
            <div className="spinner" /> Chargement...
        </div>
    );

    if (error) return (
        <div className="pub-detail-error">
            <p>{error}</p>
            <button onClick={() => navigate(-1)}>← Retour</button>
        </div>
    );

    const user = AuthService.getCurrentUser();

    return (
        <motion.div
            className="pub-detail"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Breadcrumb */}
            <nav className="pub-detail__breadcrumb">
                <Link to="/">Accueil</Link>
                <span>›</span>
                <Link to="/publications">Publications</Link>
                <span>›</span>
                <span>{pub.titre}</span>
            </nav>

            <div className="pub-detail__layout">

                {/* ── Contenu principal ── */}
                <div className="pub-detail__main">
                    <div className="pub-detail__badge">{pub.domaine?.nom ?? 'Général'}</div>
                    <h1 className="pub-detail__title">{pub.titre}</h1>

                    {/* Auteurs */}
                    {pub.chercheurs?.length > 0 && (
                        <div className="pub-detail__authors">
                            <span className="pub-detail__label">Auteurs :</span>
                            {pub.chercheurs.map((c, i) => (
                                <span key={c.id}>
                                    <Link to={`/researchers/${c.id}`} className="pub-detail__author-link">
                                        {c.prenom} {c.nom}
                                    </Link>
                                    {i < pub.chercheurs.length - 1 && ', '}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Résumé */}
                    {pub.resume && (
                        <div className="pub-detail__section">
                            <h2>Résumé</h2>
                            <p>{pub.resume}</p>
                        </div>
                    )}

                    {/* Mots-clés */}
                    {pub.motsCles && (
                        <div className="pub-detail__section">
                            <h2>Mots-clés</h2>
                            <div className="pub-detail__keywords">
                                {pub.motsCles.split(',').map(k => (
                                    <Link key={k.trim()} to={`/search?keyword=${k.trim()}`} className="kw-chip">
                                        {k.trim()}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Sidebar ── */}
                <aside className="pub-detail__sidebar">
                    <div className="pub-sidebar-card">
                        <h3>Informations</h3>
                        <dl>
                            {pub.annee   && <><dt>Année</dt><dd>{pub.annee}</dd></>}
                            {pub.doi     && <><dt>DOI</dt><dd><a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">{pub.doi}</a></dd></>}
                            {pub.revue   && <><dt>Revue</dt><dd>{pub.revue}</dd></>}
                            {pub.domaine && <><dt>Domaine</dt><dd>{pub.domaine.nom}</dd></>}
                        </dl>

                        {/* ✅ FIX: pub.cheminFichier au lieu de pub.fichier */}
                        {pub.cheminFichier && (
                            <motion.button
                                className="pub-sidebar-card__dl"
                                onClick={handleDownload}
                                disabled={downloading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {downloading ? '⏳ Téléchargement...' : '⬇ Télécharger le PDF'}
                            </motion.button>
                        )}

                        {!user && (
                            <p className="pub-sidebar-card__login-hint">
                                <Link to="/login">Connectez-vous</Link> pour accéder à plus de fonctionnalités.
                            </p>
                        )}
                    </div>

                    {/* Même domaine */}
                    {pub.domaine && (
                        <div className="pub-sidebar-card">
                            <h3>Même domaine</h3>
                            <Link to={`/search?domain=${pub.domaine.id}`} className="pub-sidebar-card__link">
                                Voir toutes les publications en {pub.domaine.nom} →
                            </Link>
                        </div>
                    )}
                </aside>
            </div>
        </motion.div>
    );
};

export default PublicationDetail;