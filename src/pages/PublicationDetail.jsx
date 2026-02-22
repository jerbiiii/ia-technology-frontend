import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const PublicationDetail = () => {
    const { id } = useParams();
    const [pub, setPub]       = useState(null);
    const [loading, setLoad]  = useState(true);
    const [error, setError]   = useState(null);

    useEffect(() => {
        setLoad(true);
        setError(null);


        api.get(`/public/publications/${id}`)
            .then(r => setPub(r.data))
            .catch(err => {
                console.error(err);
                setError("Publication introuvable ou accès refusé.");
            })
            .finally(() => setLoad(false));
    }, [id]);

    if (loading) return <div className="container loading">Chargement...</div>;
    if (error)   return <div className="container error-msg">{error}</div>;
    if (!pub)    return null;


    const annee = pub.datePublication
        ? new Date(pub.datePublication).getFullYear()
        : '—';

    const dateFormatee = pub.datePublication
        ? new Date(pub.datePublication).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        })
        : '—';

    // chercheursNoms et domainesNoms sont des Set (Array après JSON)
    const chercheurs = Array.isArray(pub.chercheursNoms)
        ? pub.chercheursNoms
        : [];

    const domaines = Array.isArray(pub.domainesNoms)
        ? pub.domainesNoms
        : [];

    const handleDownload = () => {
        if (!pub.fichierUrl) return;
        window.open(pub.fichierUrl, '_blank');
    };

    return (
        <div className="container publication-detail">
            <div className="publication-detail__breadcrumb">
                <Link to="/publications">← Retour aux publications</Link>
            </div>

            <article className="publication-card">
                {/* ── En-tête ── */}
                <header className="publication-card__header">
                    <h1 className="publication-card__title">{pub.titre}</h1>

                    {pub.statut && (
                        <span className={`badge badge--${pub.statut.toLowerCase()}`}>
                            {pub.statut}
                        </span>
                    )}
                </header>

                {/* ── Métadonnées ── */}
                <section className="publication-card__meta">

                    {chercheurs.length > 0 && (
                        <div className="meta-row">
                            <span className="meta-label">👤 Auteur(s)</span>
                            <span className="meta-value">{chercheurs.join(', ')}</span>
                        </div>
                    )}


                    {domaines.length > 0 && (
                        <div className="meta-row">
                            <span className="meta-label">🏷️ Domaine(s)</span>
                            <span className="meta-value">{domaines.join(', ')}</span>
                        </div>
                    )}


                    <div className="meta-row">
                        <span className="meta-label">📅 Année</span>
                        <span className="meta-value">{annee}</span>
                    </div>

                    <div className="meta-row">
                        <span className="meta-label">📆 Date de publication</span>
                        <span className="meta-value">{dateFormatee}</span>
                    </div>


                    {pub.revue && (
                        <div className="meta-row">
                            <span className="meta-label">📰 Revue</span>
                            <span className="meta-value">{pub.revue}</span>
                        </div>
                    )}

                    {pub.lienDoi && (
                        <div className="meta-row">
                            <span className="meta-label">🔗 DOI</span>
                            <a
                                className="meta-value"
                                href={pub.lienDoi}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {pub.lienDoi}
                            </a>
                        </div>
                    )}
                </section>

                {/* ── Résumé ── */}
                {pub.resume && (
                    <section className="publication-card__abstract">
                        <h2>Résumé</h2>
                        <p>{pub.resume}</p>
                    </section>
                )}

                {/* ── Actions ── */}
                <footer className="publication-card__actions">
                    {pub.fichierUrl ? (
                        <button className="btn-primary" onClick={handleDownload}>
                            ⬇️ Télécharger le PDF
                        </button>
                    ) : (
                        <span className="no-file">Aucun fichier disponible</span>
                    )}
                    {pub.lienDoi && (
                        <a
                            className="btn-secondary"
                            href={pub.lienDoi}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Voir sur DOI →
                        </a>
                    )}
                </footer>
            </article>
        </div>
    );
};

export default PublicationDetail;