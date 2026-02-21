import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import './HomePage.css';

/* ── Variantes réutilisables ── */
const fadeUp = {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const fadeLeft = {
    hidden:  { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0,  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

/* ── Helper : wrapper whileInView ── */
const InView = ({ children, variants = fadeUp, className, style }) => (
    <motion.div
        className={className}
        style={style}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
    >
        {children}
    </motion.div>
);

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

            {/* ── Hero (pas whileInView, visible dès le chargement) ── */}
            <section className="hero">
                <motion.div
                    className="hero__content"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="hero__title">
                        Plateforme de Recherche<br />
                        <span className="hero__accent">IA-Technology</span>
                    </h1>
                    <motion.p
                        className="hero__sub"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                    >
                        Découvrez nos chercheurs, publications et projets en
                        Intelligence Artificielle, NLP, Vision par Ordinateur et Cybersécurité.
                    </motion.p>
                    <motion.div
                        className="hero__actions"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Link to="/publications" className="btn btn--primary">
                            Explorer les publications
                        </Link>
                        <Link to="/researchers" className="btn btn--outline">
                            Voir les chercheurs
                        </Link>
                        <Link to="/search" className="btn btn--outline">
                            🔍 Rechercher
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── Domaines ── */}
            {domains.length > 0 && (
                <section className="section">
                    <InView>
                        <h2 className="section__title">Domaines de Recherche</h2>
                    </InView>
                    <motion.div
                        className="domains-grid"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {domains.map(d => (
                            <motion.div key={d.id} variants={fadeUp}>
                                <Link to={`/search?domain=${d.id}`} className="domain-chip">
                                    🏷️ {d.nom}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            )}

            {/* ── Actualités ── */}
            {announcements.length > 0 && (
                <section className="section section--alt">
                    <InView>
                        <h2 className="section__title">Actualités & Annonces</h2>
                    </InView>
                    <motion.div
                        className="announcements-grid"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                    >
                        {announcements.map(a => (
                            <motion.article key={a.id} className="announce-card" variants={fadeUp}>
                                <span className="announce-card__date">
                                    {new Date(a.datePublication).toLocaleDateString('fr-FR')}
                                </span>
                                <h3 className="announce-card__title">{a.titre}</h3>
                                <p className="announce-card__body">{a.contenu}</p>
                            </motion.article>
                        ))}
                    </motion.div>
                </section>
            )}

            {/* ── Publications récentes ── */}
            <section className="section">
                <InView>
                    <div className="section__head">
                        <h2 className="section__title">Publications Récentes</h2>
                        <Link to="/publications" className="section__more">Tout voir →</Link>
                    </div>
                </InView>

                {loading ? (
                    <div className="skeleton-grid">
                        {[...Array(3)].map((_, i) => <div key={i} className="skeleton-card" />)}
                    </div>
                ) : publications.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center' }}>Aucune publication disponible.</p>
                ) : (
                    <motion.div
                        className="pub-grid"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {publications.map(p => (
                            <motion.div key={p.id} variants={fadeUp} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                                <Link to={`/publications/${p.id}`} className="pub-card">
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
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>

            {/* ── Chercheurs ── */}
            <section className="section section--alt">
                <InView>
                    <div className="section__head">
                        <h2 className="section__title">Nos Chercheurs</h2>
                        <Link to="/researchers" className="section__more">Tout voir →</Link>
                    </div>
                </InView>

                {loading ? (
                    <div className="skeleton-grid">
                        {[...Array(3)].map((_, i) => <div key={i} className="skeleton-card" />)}
                    </div>
                ) : researchers.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center' }}>Aucun chercheur disponible.</p>
                ) : (
                    <motion.div
                        className="researcher-grid"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {researchers.map(r => (
                            <motion.div key={r.id} variants={fadeUp} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                                <Link to={`/researchers/${r.id}`} className="researcher-card">
                                    <div className="researcher-card__avatar">
                                        {r.prenom?.[0]}{r.nom?.[0]}
                                    </div>
                                    <div className="researcher-card__info">
                                        <h3 className="researcher-card__name">{r.prenom} {r.nom}</h3>
                                        <p className="researcher-card__domain">{r.domainePrincipalNom ?? ''}</p>
                                        <span className="researcher-card__pubs">{r.affiliation ?? ''}</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>
        </div>
    );
};

export default HomePage;