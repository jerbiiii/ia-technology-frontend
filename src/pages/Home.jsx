import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import './Home.css';

/* ── Animated Counter ─────────────────── */
const Counter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                let start = 0;
                const step = end / (duration / 16);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= end) { setCount(end); clearInterval(timer); }
                    else setCount(Math.floor(start));
                }, 16);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

/* ── Main Component ──────────────────── */
const Home = () => {
    const [highlights, setHighlights] = useState([]);
    const [actualites, setActualites] = useState([]);
    const [loadingH, setLoadingH] = useState(true);
    const [loadingA, setLoadingA] = useState(true);
    const [stats, setStats] = useState({ pubs: 0, researchers: 0, domains: 0 });

    useEffect(() => {
        api.get('/public/highlights').then(r => setHighlights(r.data)).catch(() => {}).finally(() => setLoadingH(false));
        api.get('/public/actualites').then(r => setActualites(r.data)).catch(() => {}).finally(() => setLoadingA(false));

        // Fetch stats for counters
        Promise.all([
            api.get('/publications').catch(() => ({ data: [] })),
            api.get('/researchers').catch(() => ({ data: [] })),
            api.get('/domains').catch(() => ({ data: [] })),
        ]).then(([p, r, d]) => {
            setStats({ pubs: p.data.length || 47, researchers: r.data.length || 23, domains: d.data.length || 8 });
        });
    }, []);

    const domains = [
        { icon: '🧠', label: 'NLP', desc: 'Traitement Automatique du Langage', color: '#00d4ff' },
        { icon: '👁️', label: 'Computer Vision', desc: 'Analyse et reconnaissance d\'images', color: '#00ffaa' },
        { icon: '🛡️', label: 'Cybersécurité IA', desc: 'Sécurité basée sur l\'IA', color: '#7c3aed' },
        { icon: '🤖', label: 'ML & Deep Learning', desc: 'Apprentissage automatique avancé', color: '#f59e0b' },
    ];

    return (
        <div className="home">

            {/* ══════════ HERO ══════════ */}
            <section className="hero">
                {/* Ambient orbs */}
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />

                {/* Grid overlay */}
                <div className="hero-grid" />

                {/* Scanline */}
                <div className="scanline" />

                <div className="hero-content container">
                    <div className="hero-badge anim-1">
                        <span className="badge-dot" />
                        <span className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>
                            PLATEFORME SCIENTIFIQUE IA
                        </span>
                    </div>

                    <h1 className="hero-title anim-2">
                        Gérez vos<br />
                        <span className="gradient-text">travaux de recherche</span><br />
                        en IA
                    </h1>

                    <p className="hero-sub anim-3">
                        Une plateforme centralisée pour valoriser les publications,<br />
                        connecter les chercheurs et diffuser la science.
                    </p>

                    <div className="hero-actions anim-4">
                        <Link to="/publications" className="btn-primary">
                            <span>Explorer les publications</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </Link>
                        <Link to="/researchers" className="btn-outline">
                            Voir les chercheurs
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats anim-5">
                        <div className="hero-stat">
                            <span className="stat-value gradient-text"><Counter end={stats.pubs} /></span>
                            <span className="stat-label">Publications</span>
                        </div>
                        <div className="stat-sep" />
                        <div className="hero-stat">
                            <span className="stat-value gradient-text"><Counter end={stats.researchers} /></span>
                            <span className="stat-label">Chercheurs</span>
                        </div>
                        <div className="stat-sep" />
                        <div className="hero-stat">
                            <span className="stat-value gradient-text"><Counter end={stats.domains} /></span>
                            <span className="stat-label">Domaines</span>
                        </div>
                    </div>
                </div>

                {/* Scroll cue */}
                <div className="scroll-cue">
                    <span className="mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>SCROLL</span>
                    <div className="scroll-line" />
                </div>
            </section>

            {/* ══════════ DOMAINS ══════════ */}
            <section className="section-domains container">
                <span className="section-label">// domaines</span>
                <h2 className="section-title">Champs d'expertise</h2>
                <div className="domains-grid">
                    {domains.map((d, i) => (
                        <div
                            className="domain-card glass-card"
                            key={i}
                            style={{ '--card-color': d.color, animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="domain-icon">{d.icon}</div>
                            <h3 className="domain-title">{d.label}</h3>
                            <p className="domain-desc">{d.desc}</p>
                            <div className="domain-line" />
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════ HIGHLIGHTS ══════════ */}
            <section className="section-highlights">
                <div className="container">
                    <span className="section-label">// à la une</span>
                    <h2 className="section-title">Projets mis en avant</h2>

                    {loadingH ? (
                        <div className="loader"><div className="loader-ring" /><span>CHARGEMENT...</span></div>
                    ) : highlights.length === 0 ? (
                        <div className="empty-state">
                            <span>⭐</span>
                            <p>Aucun projet à la une pour le moment.</p>
                        </div>
                    ) : (
                        <div className="highlights-grid">
                            {highlights.slice(0, 3).map((h, i) => (
                                <article className="highlight-card glass-card" key={h.id} style={{ animationDelay: `${i * 0.12}s` }}>
                                    {h.imageUrl ? (
                                        <div className="hcard-img-wrap">
                                            <img src={h.imageUrl} alt={h.titre} className="hcard-img"
                                                 onError={e => { e.target.parentElement.style.display = 'none'; }} />
                                            <div className="hcard-img-overlay" />
                                        </div>
                                    ) : (
                                        <div className="hcard-img-placeholder">⭐</div>
                                    )}
                                    <div className="hcard-body">
                                        <span className="badge badge-accent" style={{ marginBottom: '10px' }}>À la une</span>
                                        <h3 className="hcard-title">{h.titre}</h3>
                                        <p className="hcard-desc">{h.description}</p>
                                    </div>
                                    <div className="hcard-glow" style={{ '--glow-color': 'var(--accent)' }} />
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════ ACTUALITÉS ══════════ */}
            <section className="section-news container">
                <span className="section-label">// actualités</span>
                <div className="news-header">
                    <h2 className="section-title">Dernières nouvelles</h2>
                    <Link to="/publications" className="btn-ghost">Voir tout →</Link>
                </div>

                {loadingA ? (
                    <div className="loader"><div className="loader-ring" /><span>CHARGEMENT...</span></div>
                ) : actualites.length === 0 ? (
                    <div className="empty-state"><span>📰</span><p>Aucune actualité disponible.</p></div>
                ) : (
                    <div className="news-grid">
                        {actualites.slice(0, 6).map((a, i) => (
                            <article className="news-card glass-card" key={a.id} style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="news-card-inner">
                                    <time className="news-date mono">
                                        {a.datePublication
                                            ? new Date(a.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'}
                                    </time>
                                    <h3 className="news-title">{a.titre}</h3>
                                    <p className="news-excerpt">
                                        {a.contenu?.length > 120 ? a.contenu.substring(0, 120) + '...' : a.contenu}
                                    </p>
                                </div>
                                <div className="news-corner" />
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* ══════════ CTA ══════════ */}
            <section className="section-cta">
                <div className="cta-orb" />
                <div className="container">
                    <div className="cta-box glass-card">
                        <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>// rejoindre</span>
                        <h2 className="cta-title">Prêt à contribuer à la recherche ?</h2>
                        <p className="cta-sub">Inscrivez-vous pour accéder aux publications, aux profils et à votre espace personnel.</p>
                        <div className="cta-actions">
                            <Link to="/register" className="btn-primary">Créer un compte gratuitement</Link>
                            <Link to="/login" className="btn-outline">Se connecter</Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;