// ============================================================
// CORRECTIONS APPORTÉES :
// - Ajout du chargement des highlights depuis /public/highlights
// - Section "Projets mis en avant" affichée sur la page d'accueil
//   (fonctionnalité exigée par le CDC mais absente)
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const HomePage = () => {
    const [recentPublications, setRecentPublications] = useState([]);
    const [researchers, setResearchers] = useState([]);
    const [domaines, setDomaines] = useState([]);

    // ✅ FIX : ajout de l'état pour les highlights (absent dans la version originale)
    const [highlights, setHighlights] = useState([]);

    const [loadingPubs, setLoadingPubs] = useState(true);
    const [loadingHighlights, setLoadingHighlights] = useState(true);

    useEffect(() => {
        // Publications récentes
        api.get('/public/publications', { params: { page: 0, size: 6, sort: 'datePublication,desc' } })
            .then(r => setRecentPublications(r.data?.content ?? r.data ?? []))
            .catch(console.error)
            .finally(() => setLoadingPubs(false));

        // Chercheurs
        api.get('/public/researchers', { params: { page: 0, size: 4 } })
            .then(r => setResearchers(r.data?.content ?? r.data ?? []))
            .catch(console.error);

        // Domaines
        api.get('/public/domaines')
            .then(r => setDomaines(r.data ?? []))
            .catch(console.error);

        // ✅ FIX : chargement des highlights (projets mis en avant par le modérateur)
        // L'endpoint existait côté backend mais n'était jamais appelé depuis le frontend
        api.get('/public/highlights')
            .then(r => setHighlights(r.data ?? []))
            .catch(console.error)
            .finally(() => setLoadingHighlights(false));
    }, []);

    return (
        <div className="home-page">
            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero__content">
                    <h1>Plateforme de Recherche IA-Technology</h1>
                    <p>Découvrez nos publications scientifiques, nos chercheurs et nos domaines d'expertise en Intelligence Artificielle.</p>
                    <div className="hero__actions">
                        <Link to="/publications" className="btn btn-primary">Voir les publications</Link>
                        <Link to="/researchers" className="btn btn-secondary">Nos chercheurs</Link>
                    </div>
                </div>
            </section>

            {/* ── Domaines de recherche ── */}
            {domaines.length > 0 && (
                <section className="home-section">
                    <h2 className="section-title">Domaines de Recherche</h2>
                    <div className="domaines-grid">
                        {domaines.map(d => (
                            <Link key={d.id} to={`/search?domaine=${d.id}`} className="domaine-card">
                                <span className="domaine-card__name">{d.nom}</span>
                                {d.description && (
                                    <span className="domaine-card__desc">
                                        {d.description.length > 80
                                            ? d.description.substring(0, 80) + '…'
                                            : d.description}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/*
             * ✅ FIX : Section "Projets mis en avant"
             * Exigée par le CDC ("Mise en avant des projets récents")
             * Le modérateur peut créer des highlights via HighlightManagement
             * mais ils n'étaient JAMAIS affichés sur la page d'accueil
             */}
            {!loadingHighlights && highlights.length > 0 && (
                <section className="home-section home-section--highlights">
                    <h2 className="section-title">✨ Projets mis en avant</h2>
                    <div className="highlights-grid">
                        {highlights.map(h => (
                            <div key={h.id} className="highlight-card">
                                {h.imageUrl && (
                                    <img
                                        src={h.imageUrl}
                                        alt={h.titre}
                                        className="highlight-card__img"
                                    />
                                )}
                                <div className="highlight-card__body">
                                    <span className="highlight-card__badge">À la une</span>
                                    <h3 className="highlight-card__title">{h.titre}</h3>
                                    {h.description && (
                                        <p className="highlight-card__desc">
                                            {h.description.length > 150
                                                ? h.description.substring(0, 150) + '…'
                                                : h.description}
                                        </p>
                                    )}
                                    {h.publicationId && (
                                        <Link
                                            to={`/publications/${h.publicationId}`}
                                            className="highlight-card__link"
                                        >
                                            Lire la publication →
                                        </Link>
                                    )}
                                    {h.lienExterne && !h.publicationId && (
                                        <a
                                            href={h.lienExterne}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="highlight-card__link"
                                        >
                                            En savoir plus →
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Publications récentes ── */}
            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Publications Récentes</h2>
                    <Link to="/publications" className="section-link">Voir tout →</Link>
                </div>

                {loadingPubs ? (
                    <div className="loading">Chargement…</div>
                ) : (
                    <div className="publications-grid">
                        {recentPublications.map(p => {
                            // ✅ Champs corrigés (cohérents avec PublicationDetail fix)
                            const domaines = p.domainesNoms ? Array.from(p.domainesNoms) : [];
                            const auteurs  = p.chercheursNoms ? Array.from(p.chercheursNoms) : [];
                            const annee    = p.datePublication
                                ? new Date(p.datePublication).getFullYear()
                                : null;

                            return (
                                <div key={p.id} className="pub-card">
                                    {domaines.length > 0 && (
                                        <span className="pub-card__badge">{domaines[0]}</span>
                                    )}
                                    <h3 className="pub-card__title">
                                        <Link to={`/publications/${p.id}`}>{p.titre}</Link>
                                    </h3>
                                    <div className="pub-card__meta">
                                        {auteurs.length > 0 && <span>👤 {auteurs.slice(0, 2).join(', ')}{auteurs.length > 2 ? ' +' + (auteurs.length - 2) : ''}</span>}
                                        {annee && <span>📅 {annee}</span>}
                                    </div>
                                    {p.resume && (
                                        <p className="pub-card__excerpt">
                                            {p.resume.substring(0, 120)}…
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ── Chercheurs ── */}
            {researchers.length > 0 && (
                <section className="home-section">
                    <div className="section-header">
                        <h2 className="section-title">Nos Chercheurs</h2>
                        <Link to="/researchers" className="section-link">Voir tout →</Link>
                    </div>
                    <div className="researchers-grid">
                        {researchers.map(r => (
                            <Link key={r.id} to={`/researchers/${r.id}`} className="researcher-card">
                                <div className="researcher-card__avatar">
                                    {r.prenom?.[0]}{r.nom?.[0]}
                                </div>
                                <div className="researcher-card__info">
                                    <strong>{r.prenom} {r.nom}</strong>
                                    {/* ✅ Champs corrigés (domaineNom + specialisation) */}
                                    {r.domaineNom && <span>{r.domaineNom}</span>}
                                    {r.specialisation && <span>{r.specialisation}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;