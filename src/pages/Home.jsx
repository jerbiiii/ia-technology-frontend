import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

/* Animation presets */
const fadeUp = {
    hidden:  { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.10, duration: 0.55, ease: [0, 0, 0.2, 1] }
    })
};

/* ─────────────────────────────────────────────
   PUBLICATION CARD (hero visual)
───────────────────────────────────────────── */
const VisualPub = ({ icon, title, author, year, tag, tagColor, delay }) => (
    <motion.div
        className="visual-pub"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.45, ease: [0, 0, 0.2, 1] }}
        whileHover={{ x: 5 }}
    >
        <div className={`visual-pub__icon vpi-${tagColor}`}>{icon}</div>
        <div className="visual-pub__body">
            <div className="visual-pub__title">{title}</div>
            <div className="visual-pub__meta">
                <span className="visual-pub__author">{author} · {year}</span>
                <span className={`visual-pub__tag tag-${tagColor}`}>{tag}</span>
            </div>
        </div>
    </motion.div>
);

/* ─────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────── */
const FeatCard = ({ icon, color, title, desc, delay }) => (
    <motion.div
        className="feat-card"
        variants={fadeUp}
        custom={delay}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ y: -8, transition: { duration: 0.25 } }}
    >
        <div className={`feat-card__icon fi-${color}`}>{icon}</div>
        <h3 className="feat-card__title">{title}</h3>
        <p className="feat-card__desc">{desc}</p>
    </motion.div>
);

/* ─────────────────────────────────────────────
   PUB CARD (dark section)
───────────────────────────────────────────── */
const PubCard = ({ tag, tagClass, title, excerpt, initials, author, doi, delay }) => (
    <motion.div
        className="pub-card"
        variants={fadeUp}
        custom={delay}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
        <span className={`pub-card__tag ${tagClass}`}>{tag}</span>
        <h3 className="pub-card__title">{title}</h3>
        <p className="pub-card__excerpt">{excerpt}</p>
        <div className="pub-card__footer">
            <div className="pub-card__author">
                <div className="pub-card__av">{initials}</div>
                <span className="pub-card__author-name">{author}</span>
            </div>
            <span className="pub-card__dl">{doi ? 'DOI' : 'PDF'}</span>
        </div>
    </motion.div>
);

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
const Home = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [stats] = useState({ chercheurs: 12, publications: 48, domaines: 8 });

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
                            <motion.div
                                className="hero__eyebrow"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45 }}
                            >
                                <div className="hero__eyebrow-dot"/>
                                <span>Plateforme scientifique IA-Technology</span>
                            </motion.div>

                            <motion.h1
                                className="hero__h1"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08, duration: 0.55, ease: [0, 0, 0.2, 1] }}
                            >
                                La recherche en IA,<br/>
                                <span className="hero__h1-accent">centralisée et accessible</span>
                            </motion.h1>

                            <motion.p
                                className="hero__desc"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.16, duration: 0.55, ease: [0, 0, 0.2, 1] }}
                            >
                                Explorez, téléchargez et partagez les publications scientifiques
                                de l'équipe IA-Technology. Filtrez par domaine, chercheur ou mots-clés.
                            </motion.p>

                            <motion.div
                                className="hero__actions"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.24, duration: 0.5, ease: [0, 0, 0.2, 1] }}
                            >
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

                            {/* Stats */}
                            <motion.div
                                className="hero__stats"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.38, duration: 0.5 }}
                            >
                                {[
                                    { num: stats.publications, suffix: '+', label: 'Publications' },
                                    { num: stats.chercheurs,   suffix: '+', label: 'Chercheurs' },
                                    { num: stats.domaines,     suffix: '',  label: 'Domaines IA' },
                                ].map((s, i) => (
                                    <div key={i} className="hero__stat">
                                        <span className="hero__stat-num">{s.num}<em>{s.suffix}</em></span>
                                        <span className="hero__stat-label">{s.label}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right — visual */}
                        <div className="hero__right">
                            <motion.div
                                className="hero__chip hero__chip--top"
                                animate={{ y: [0, -9, 0] }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                            >
                                <span className="chip-dot chip-dot--teal"/>
                                Nouvelle publication ajoutée
                            </motion.div>

                            <motion.div
                                className="hero__visual"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.12, duration: 0.6, ease: [0, 0, 0.2, 1] }}
                            >
                                <div className="hero__visual-header">
                                    <span className="hero__visual-title">Publications récentes</span>
                                    <span className="hero__visual-live">
                                        <span/> Live
                                    </span>
                                </div>

                                <div className="hero__visual-list">
                                    <VisualPub delay={0.30} icon="🤖" tagColor="blue"
                                               title="Deep Learning for Anomaly Detection in IoT Networks"
                                               author="M. Ben Ali" year="2024" tag="AI"/>
                                    <VisualPub delay={0.40} icon="📊" tagColor="teal"
                                               title="Federated Learning with Differential Privacy"
                                               author="S. Trabelsi" year="2024" tag="ML"/>
                                    <VisualPub delay={0.50} icon="🔬" tagColor="amber"
                                               title="Arabic NLP: Transformer-Based Sentiment Analysis"
                                               author="R. Chabbi" year="2023" tag="NLP"/>
                                </div>

                                <Link to="/publications" className="hero__visual-cta">
                                    Voir toutes les publications
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </Link>
                            </motion.div>

                            <motion.div
                                className="hero__chip hero__chip--bottom"
                                animate={{ y: [0, -9, 0] }}
                                transition={{ repeat: Infinity, duration: 3.5, delay: 1.8, ease: 'easeInOut' }}
                            >
                                <span className="chip-dot chip-dot--sapphire"/>
                                3 nouveaux chercheurs
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ══ FEATURES ══ */}
            <section className="features-section">
                <div className="container">
                    <motion.span className="section-label" variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        Fonctionnalités
                    </motion.span>
                    <motion.h2 className="section-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        Tout ce dont vous avez besoin
                    </motion.h2>
                    <motion.p className="section-sub" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        Une plateforme complète pour gérer et explorer la production scientifique de l'équipe
                    </motion.p>

                    <div className="feat-grid">
                        <FeatCard delay={0} icon="🔍" color="blue"  title="Recherche intelligente"     desc="Filtrez les publications par domaine, chercheur, mots-clés ou date avec des résultats instantanés."/>
                        <FeatCard delay={1} icon="📥" color="teal"  title="Téléchargement PDF"         desc="Accédez aux articles en format PDF ou consultez le DOI officiel directement depuis la fiche publication."/>
                        <FeatCard delay={2} icon="👥" color="amber" title="Profils chercheurs"         desc="Consultez le profil complet de chaque chercheur, ses domaines et l'ensemble de ses travaux."/>
                        <FeatCard delay={3} icon="🔐" color="blue"  title="Accès sécurisé JWT"         desc="Authentification sécurisée avec gestion fine des rôles : Admin, Modérateur et Utilisateur."/>
                        <FeatCard delay={4} icon="📰" color="teal"  title="Actualités & Highlights"   desc="Le modérateur publie les actualités et met en avant les projets phares de l'équipe."/>
                        <FeatCard delay={5} icon="📋" color="amber" title="Journal d'audit complet"   desc="Chaque action est tracée. L'administrateur consulte l'historique avec filtres avancés."/>
                    </div>
                </div>
            </section>

            {/* ══ RECENT PUBLICATIONS (dark) ══ */}
            <section className="pubs-section">
                <div className="container">
                    <motion.span className="section-label pubs-label" variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        Dernières publications
                    </motion.span>
                    <motion.h2 className="section-title pubs-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        Découvrez nos recherches
                    </motion.h2>
                    <motion.p className="section-sub pubs-sub" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        Les travaux les plus récents de l'équipe IA-Technology
                    </motion.p>

                    <div className="pub-grid">
                        <PubCard delay={0} tagClass="pct-ai"  tag="Intelligence Artificielle"
                                 title="Explainable AI for Medical Diagnosis: A Survey"
                                 excerpt="Comprehensive review of explainability methods applied to deep learning in clinical settings..."
                                 initials="MB" author="M. Ben Ali" doi={false}/>
                        <PubCard delay={1} tagClass="pct-ml"  tag="Machine Learning"
                                 title="Graph Neural Networks for Fraud Detection in Finance"
                                 excerpt="Novel GNN architecture modeling transaction graphs to detect fraudulent activities with high precision..."
                                 initials="ST" author="S. Trabelsi" doi={false}/>
                        <PubCard delay={2} tagClass="pct-nlp" tag="NLP"
                                 title="Zero-Shot Cross-Lingual Transfer for Arabic Dialect Identification"
                                 excerpt="Leveraging multilingual transformers for state-of-the-art Arabic dialect classification..."
                                 initials="RC" author="R. Chabbi" doi={true}/>
                    </div>

                    <motion.div className="pubs-cta" variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <Link to="/publications" className="btn-pubs-more">
                            Voir toutes les publications
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ══ CTA ══ */}
            {!isAuthenticated && (
                <section className="cta-section">
                    <div className="container">
                        <motion.div
                            className="cta-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="cta-label">Rejoignez la plateforme</span>
                            <h2 className="cta-title">Prêt à explorer la<br/>recherche en IA ?</h2>
                            <p className="cta-desc">
                                Créez votre compte gratuitement et accédez à toutes les publications,
                                profils et outils de recherche.
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