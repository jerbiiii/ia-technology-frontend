import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Home.css';

/* ── Animations ── */
const fadeUp = {
    hidden:  { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.10, duration: 0.55, ease: [0, 0, 0.2, 1] }
    })
};

/* ── Helpers ── */
const getDomainTag  = (pub)   => pub.domainesNoms?.[0] ?? null;
const getTagColor   = (index) => ['blue', 'teal', 'amber'][index % 3];
const getTagClass   = (index) => ['pct-ai', 'pct-ml', 'pct-nlp'][index % 3];
const formatYear    = (date)  => date ? new Date(date).getFullYear() : '';
const truncate      = (str, n) => str?.length > n ? str.slice(0, n) + '…' : str ?? '';

const getInitials = (noms) => {
    if (!noms?.length) return '??';
    const parts = noms[0].trim().split(' ');
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : noms[0].slice(0, 2).toUpperCase();
};

/* ── Visual publication row (hero card) ── */
const VisualPub = ({ pub, index, delay }) => {
    const icons = ['🤖', '📊', '🔬', '🧠', '💡', '🔍'];
    const color  = getTagColor(index);
    const tag    = getDomainTag(pub);
    const author = pub.chercheursNoms?.[0] ?? 'Auteur inconnu';

    return (
        <motion.div className="visual-pub"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay, duration: 0.45 }} whileHover={{ x: 5 }}>
            <div className={`visual-pub__icon vpi-${color}`}>{icons[index % icons.length]}</div>
            <div className="visual-pub__body">
                <div className="visual-pub__title">{truncate(pub.titre, 58)}</div>
                <div className="visual-pub__meta">
                    <span className="visual-pub__author">
                        {truncate(author, 20)}{pub.datePublication && ` · ${formatYear(pub.datePublication)}`}
                    </span>
                    {tag && <span className={`visual-pub__tag tag-${color}`}>{truncate(tag, 14)}</span>}
                </div>
            </div>
        </motion.div>
    );
};

/* ── Feature card (statique) ── */
const FeatCard = ({ icon, color, title, desc, delay }) => (
    <motion.div className="feat-card"
                variants={fadeUp} custom={delay}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}>
        <div className={`feat-card__icon fi-${color}`}>{icon}</div>
        <h3 className="feat-card__title">{title}</h3>
        <p className="feat-card__desc">{desc}</p>
    </motion.div>
);

/* ── Dark publication card ── */
const PubCard = ({ pub, index }) => {
    const tag    = getDomainTag(pub) ?? 'Recherche';
    const author = pub.chercheursNoms?.[0] ?? 'Auteur inconnu';
    const inits  = getInitials(pub.chercheursNoms);

    return (
        <motion.div className="pub-card"
                    variants={fadeUp} custom={index}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}>
            <Link to={`/publications/${pub.id}`} className="pub-card__inner">
                <span className={`pub-card__tag ${getTagClass(index)}`}>{truncate(tag, 24)}</span>
                <h3 className="pub-card__title">{truncate(pub.titre, 70)}</h3>
                <p className="pub-card__excerpt">
                    {pub.resume
                        ? truncate(pub.resume, 140)
                        : 'Aucun résumé disponible pour cette publication.'}
                </p>
                <div className="pub-card__footer">
                    <div className="pub-card__author">
                        <div className="pub-card__av">{inits}</div>
                        <span className="pub-card__author-name">{truncate(author, 22)}</span>
                    </div>
                    <span className="pub-card__dl">
                        {pub.doi ? 'DOI' : pub.cheminFichier ? 'PDF' : '—'}
                    </span>
                </div>
            </Link>
        </motion.div>
    );
};

/* ── Skeletons ── */
const VisualSkeleton = () => (
    <>{[1, 2, 3].map(i => (
        <div key={i} className="visual-pub visual-pub--skeleton">
            <div className="skel skel--icon"/>
            <div className="visual-pub__body">
                <div className="skel skel--line skel--title"/>
                <div className="skel skel--line skel--meta"/>
            </div>
        </div>
    ))}</>
);

const PubCardSkeleton = () => (
    <>{[1, 2, 3].map(i => (
        <div key={i} className="pub-card pub-card--skeleton">
            <div className="skel skel--tag"/>
            <div className="skel skel--line" style={{ height: '18px', width: '90%', marginBottom: '8px' }}/>
            <div className="skel skel--line" style={{ height: '18px', width: '70%', marginBottom: '20px' }}/>
            <div className="skel skel--line skel--excerpt"/>
            <div className="skel skel--line skel--excerpt" style={{ width: '80%' }}/>
        </div>
    ))}</>
);

/* ══════════════════════════════════════
   HOME PAGE
══════════════════════════════════════ */
const Home = () => {
    const { isAuthenticated } = useContext(AuthContext);

    const [stats,            setStats]            = useState({ publications: 0, chercheurs: 0, domaines: 0 });
    const [heroPubs,         setHeroPubs]          = useState([]);
    const [latestPubs,       setLatestPubs]        = useState([]);
    const [homeContent,      setHomeContent]       = useState({});
    const [loading,          setLoading]           = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            const [pubsR, resR, domR, hcR] = await Promise.allSettled([
                api.get('/publications'),
                api.get('/researchers'),
                api.get('/domains'),
                api.get('/public/home-content'),
            ]);

            if (pubsR.status === 'fulfilled') {
                const pubs = pubsR.value.data ?? [];
                setStats(s => ({ ...s, publications: pubs.length }));
                setHeroPubs(pubs.slice(0, 3));
                setLatestPubs(pubs.slice(0, 3));
            }
            if (resR.status === 'fulfilled') {
                setStats(s => ({ ...s, chercheurs: resR.value.data?.length ?? 0 }));
            }
            if (domR.status === 'fulfilled') {
                setStats(s => ({ ...s, domaines: domR.value.data?.length ?? 0 }));
            }
            if (hcR.status === 'fulfilled') {
                const map = {};
                (hcR.value.data ?? []).forEach(item => { map[item.cle] = item.valeur; });
                setHomeContent(map);
            }
            setLoading(false);
        };

        fetchAll();
    }, []);

    /* Textes modifiables par le modérateur (avec fallback) */
    const tx = (key, fallback) => homeContent[key] || fallback;

    return (
        <div className="home">

            {/* ══ HERO ══ */}
            <section className="hero">
                <div className="hero__bg"/>
                <div className="hero__dots"/>
                <div className="hero__blob hero__blob--1"/>
                <div className="hero__blob hero__blob--2"/>

                <div className="container">
                    <div className="hero__grid">

                        {/* Left */}
                        <div className="hero__left">
                            <motion.div className="hero__eyebrow"
                                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                                <div className="hero__eyebrow-dot"/>
                                <span>{tx('eyebrow', 'Plateforme scientifique IA-Technology')}</span>
                            </motion.div>

                            <motion.h1 className="hero__h1"
                                       initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                                       transition={{ delay: 0.08, duration: 0.55 }}>
                                {tx('hero_title_1', 'La recherche en IA,')}<br/>
                                <span className="hero__h1-accent">
                                    {tx('hero_title_2', 'centralisée et accessible')}
                                </span>
                            </motion.h1>

                            <motion.p className="hero__desc"
                                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.16, duration: 0.55 }}>
                                {tx('hero_desc', "Explorez, téléchargez et partagez les publications scientifiques de l'équipe IA-Technology. Filtrez par domaine, chercheur ou mots-clés.")}
                            </motion.p>

                            <motion.div className="hero__actions"
                                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.24, duration: 0.5 }}>
                                <Link to="/publications" className="btn-hero-primary">
                                    Explorer les publications
                                    <span className="btn-hero-primary__arrow">
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </span>
                                </Link>
                                <Link to="/researchers" className="btn-hero-outline">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                                    Voir les chercheurs
                                </Link>
                            </motion.div>

                            {/* Stats réelles */}
                            <motion.div className="hero__stats"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
                                {[
                                    { num: stats.publications, suffix: '+', label: 'Publications' },
                                    { num: stats.chercheurs,   suffix: '+', label: 'Chercheurs' },
                                    { num: stats.domaines,     suffix: '',  label: 'Domaines IA' },
                                ].map((s, i) => (
                                    <div key={i} className="hero__stat">
                                        <motion.span className="hero__stat-num"
                                                     key={s.num}
                                                     initial={{ opacity: 0, y: 8 }}
                                                     animate={{ opacity: 1, y: 0 }}
                                                     transition={{ delay: 0.38 + i * 0.08 }}>
                                            {loading
                                                ? <span className="skel skel--stat"/>
                                                : <>{s.num}<em>{s.suffix}</em></>
                                            }
                                        </motion.span>
                                        <span className="hero__stat-label">{s.label}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right — visual avec vraies pubs */}
                        <div className="hero__right">
                            <motion.div className="hero__chip hero__chip--top"
                                        animate={{ y: [0, -9, 0] }}
                                        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}>
                                <span className="chip-dot chip-dot--teal"/>
                                {loading ? '…' : `${heroPubs.length} publications récentes`}
                            </motion.div>

                            <motion.div className="hero__visual"
                                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.12, duration: 0.6 }}>

                                <div className="hero__visual-header">
                                    <span className="hero__visual-title">Publications récentes</span>
                                    <span className="hero__visual-live"><span/> Live</span>
                                </div>

                                <div className="hero__visual-list">
                                    {loading ? (
                                        <VisualSkeleton/>
                                    ) : heroPubs.length > 0 ? (
                                        heroPubs.map((pub, i) => (
                                            <VisualPub key={pub.id} pub={pub} index={i} delay={0.30 + i * 0.10}/>
                                        ))
                                    ) : (
                                        <div className="visual-empty">
                                            <span>📄</span>
                                            <p>Aucune publication pour le moment</p>
                                        </div>
                                    )}
                                </div>

                                <Link to="/publications" className="hero__visual-cta">
                                    Voir toutes les publications
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </Link>
                            </motion.div>

                            <motion.div className="hero__chip hero__chip--bottom"
                                        animate={{ y: [0, -9, 0] }}
                                        transition={{ repeat: Infinity, duration: 3.5, delay: 1.8, ease: 'easeInOut' }}>
                                <span className="chip-dot chip-dot--sapphire"/>
                                {loading ? '…' : `${stats.chercheurs} chercheurs actifs`}
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ══ FEATURES (textes éditables) ══ */}
            <section className="features-section">
                <div className="container">
                    <motion.span className="section-label"
                                 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {tx('feat_label', 'Fonctionnalités')}
                    </motion.span>
                    <motion.h2 className="section-title"
                               variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {tx('feat_title', 'Tout ce dont vous avez besoin')}
                    </motion.h2>
                    <motion.p className="section-sub"
                              variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {tx('feat_sub', "Une plateforme complète pour gérer et explorer la production scientifique de l'équipe")}
                    </motion.p>

                    <div className="feat-grid">
                        <FeatCard delay={0} icon="🔍" color="blue"  title="Recherche intelligente"   desc="Filtrez les publications par domaine, chercheur, mots-clés ou date avec des résultats instantanés."/>
                        <FeatCard delay={1} icon="📥" color="teal"  title="Téléchargement PDF"       desc="Accédez aux articles en format PDF ou consultez le DOI officiel directement depuis la fiche."/>
                        <FeatCard delay={2} icon="👥" color="amber" title="Profils chercheurs"       desc="Consultez le profil complet de chaque chercheur, ses domaines et l'ensemble de ses travaux."/>
                        <FeatCard delay={3} icon="🔐" color="blue"  title="Accès sécurisé JWT"       desc="Authentification sécurisée avec gestion fine des rôles : Admin, Modérateur et Utilisateur."/>
                        <FeatCard delay={4} icon="📰" color="teal"  title="Actualités & Highlights" desc="Le modérateur publie les actualités et met en avant les projets phares de l'équipe."/>
                        <FeatCard delay={5} icon="📋" color="amber" title="Journal d'audit complet" desc="Chaque action est tracée. L'administrateur consulte l'historique avec filtres avancés."/>
                    </div>
                </div>
            </section>

            {/* ══ PUBLICATIONS RÉCENTES (dynamiques) ══ */}
            <section className="pubs-section">
                <div className="container">
                    <motion.span className="section-label pubs-label"
                                 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {tx('pubs_label', 'Dernières publications')}
                    </motion.span>
                    <motion.h2 className="section-title pubs-title"
                               variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {tx('pubs_title', 'Découvrez nos recherches')}
                    </motion.h2>
                    <motion.p className="section-sub pubs-sub"
                              variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {tx('pubs_sub', "Les travaux les plus récents de l'équipe IA-Technology")}
                    </motion.p>

                    <div className="pub-grid">
                        {loading ? (
                            <PubCardSkeleton/>
                        ) : latestPubs.length > 0 ? (
                            latestPubs.map((pub, i) => (
                                <PubCard key={pub.id} pub={pub} index={i}/>
                            ))
                        ) : (
                            <div className="pubs-empty">
                                <span>📚</span>
                                <p>Aucune publication disponible pour le moment.</p>
                            </div>
                        )}
                    </div>

                    {!loading && latestPubs.length > 0 && (
                        <motion.div className="pubs-cta"
                                    variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <Link to="/publications" className="btn-pubs-more">
                                Voir toutes les publications ({stats.publications})
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ══ CTA (texte modifiable) ══ */}
            {!isAuthenticated && (
                <section className="cta-section">
                    <div className="container">
                        <motion.div className="cta-card"
                                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ duration: 0.6 }}>
                            <span className="cta-label">
                                {tx('cta_label', 'Rejoignez la plateforme')}
                            </span>
                            <h2 className="cta-title"
                                dangerouslySetInnerHTML={{ __html: tx('cta_title', "Prêt à explorer la<br/>recherche en IA ?") }}
                            />
                            <p className="cta-desc">
                                {tx('cta_desc', "Créez votre compte gratuitement et accédez à toutes les publications, profils et outils de recherche.")}
                            </p>
                            <div className="cta-actions">
                                <Link to="/register" className="btn-cta-white">
                                    Créer un compte gratuit
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </Link>
                                <Link to="/publications" className="btn-cta-ghost">
                                    Explorer sans compte
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

        </div>
    );
};

export default Home;