import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './HomePage.css';

/* ══════════════════════════════════════════════
   Page d'accueil – ACCÈS LIBRE (sans connexion)
   Utilise UNIQUEMENT les endpoints /public/
   ══════════════════════════════════════════════ */

const HomePage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [publications,  setPublications]  = useState([]);
    const [researchers,   setResearchers]   = useState([]);
    const [domains,       setDomains]       = useState([]);
    const [loading,       setLoading]       = useState(true);

    useEffect(() => {
        const fetchPublic = async () => {
            const [annR, pubR, resR, domR] = await Promise.allSettled([
                api.get('/public/actualites'),
                api.get('/public/publications'),
                api.get('/public/researchers'),
                api.get('/public/domains'),
            ]);

            if (annR.status === 'fulfilled') setAnnouncements(annR.value.data?.slice(0, 3) ?? []);
            if (pubR.status === 'fulfilled') setPublications(pubR.value.data?.slice(0, 6)  ?? []);
            if (resR.status === 'fulfilled') setResearchers(resR.value.data?.slice(0, 6)   ?? []);
            if (domR.status === 'fulfilled') setDomains(domR.value.data?.slice(0, 8)       ?? []);

            setLoading(false);
        };
        fetchPublic();
    }, []);

    return (
        <div className="homepage">

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero__content">
                    <h1 className="hero__title">
                        Plateforme de Recherche<br />
                        <span className="hero__accent">IA-Technology</span>
                    </h1>
                    <p className="hero__sub">
                        Découvrez nos chercheurs, publications et projets en
                        Intelligence Artificielle, NLP, Vision par Ordinateur et Cybersécurité.
                    </p>
                    <div className="hero__actions">
                        <Link to="/publications" className="btn btn--primary">
                            Explorer les publications
                        </Link>
                        <Link to="/researchers" className="btn btn--outline">
                            Voir les chercheurs
                        </Link>
                        <Link to="/search" className="btn btn--outline">
                            🔍 Rechercher
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Domaines de recherche ── */}
            {domains.length > 0 && (
                <section className="section">
                    <h2 className="section__title">Domaines de Recherche</h2>
                    <div className="domains-grid">
                        {domains.map(d => (
                            <Link key={d.id} to={`/search?domain=${d.id}`} className="domain-chip">
                                🏷️ {d.nom}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Actualités & Annonces ── */}
            {announcements.length > 0 && (
                <section className="section section--alt">
                    <h2 className="section__title">Actualités & Annonces</h2>
                    <div className="announcements-grid">
                        {announcements.map(a => (
                            <article key={a.id} className="announce-card">
                                <span className="announce-card__date">
                                    {new Date(a.datePublication).toLocaleDateString('fr-FR')}
                                </span>
                                <h3 className="announce-card__title">{a.titre}</h3>
                                <p className="announce-card__body">{a.contenu}</p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Publications récentes ── */}
            <section className="section">
                <div className="section__head">
                    <h2 className="section__title">Publications Récentes</h2>
                    <Link to="/publications" className="section__more">Tout voir →</Link>
                </div>
                {loading ? (
                    <div className="skeleton-grid">
                        {[...Array(3)].map((_, i) => <div key={i} className="skeleton-card" />)}
                    </div>
                ) : publications.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center' }}>Aucune publication disponible.</p>
                ) : (
                    <div className="pub-grid">
                        {publications.map(p => (
                            <Link key={p.id} to={`/publications/${p.id}`} className="pub-card">
                                <div className="pub-card__badge">
                                    {p.domainesNoms ? [...p.domainesNoms][0] : 'Général'}
                                </div>
                                <h3 className="pub-card__title">{p.titre}</h3>
                                <p className="pub-card__authors">
                                    {p.chercheursNoms ? [...p.chercheursNoms].join(', ') : ''}
                                </p>
                                <span className="pub-card__year">
                                    {p.datePublication ? new Date(p.datePublication).getFullYear() : ''}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Chercheurs récents ── */}
            <section className="section section--alt">
                <div className="section__head">
                    <h2 className="section__title">Nos Chercheurs</h2>
                    <Link to="/researchers" className="section__more">Tout voir →</Link>
                </div>
                {loading ? (
                    <div className="skeleton-grid">
                        {[...Array(3)].map((_, i) => <div key={i} className="skeleton-card" />)}
                    </div>
                ) : researchers.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center' }}>Aucun chercheur disponible.</p>
                ) : (
                    <div className="researcher-grid">
                        {researchers.map(r => (
                            <Link key={r.id} to={`/researchers/${r.id}`} className="researcher-card">
                                <div className="researcher-card__avatar">
                                    {r.prenom?.[0]}{r.nom?.[0]}
                                </div>
                                <div className="researcher-card__info">
                                    <h3 className="researcher-card__name">{r.prenom} {r.nom}</h3>
                                    <p className="researcher-card__domain">{r.domainePrincipalNom ?? ''}</p>
                                    <span className="researcher-card__pubs">
                                        {r.affiliation ?? ''}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
};

export default HomePage;