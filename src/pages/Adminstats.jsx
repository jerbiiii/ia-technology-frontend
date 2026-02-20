import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import './AdminStats.css';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.45, ease: [0, 0, 0.2, 1] }
    })
};

/* ── Mini Sparkline SVG ── */
const Sparkline = ({ data = [], color = '#1C4ED8' }) => {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const w = 80, h = 32;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - (v / max) * h;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <polyline
                points={pts}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
            />
        </svg>
    );
};

/* ── Stat Card ── */
const StatCard = ({ icon, label, value, sub, color, sparkData, delay, to }) => {
    const inner = (
        <motion.div
            className="astat-card"
            style={{ '--card-color': color }}
            variants={fadeUp}
            custom={delay}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -6, transition: { duration: 0.22 } }}
        >
            <div className="astat-card__top">
                <div className="astat-card__icon" style={{ background: color + '18' }}>
                    <span style={{ color }}>{icon}</span>
                </div>
                <Sparkline data={sparkData} color={color} />
            </div>
            <div className="astat-card__value">{value ?? <span className="astat-skel" />}</div>
            <div className="astat-card__label">{label}</div>
            {sub && <div className="astat-card__sub">{sub}</div>}
        </motion.div>
    );
    return to ? <Link to={to} className="astat-link">{inner}</Link> : inner;
};

/* ── Action Card ── */
const ActionCard = ({ to, icon, label, desc, color, delay }) => (
    <motion.div
        variants={fadeUp} custom={delay} initial="hidden" animate="visible"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
        <Link to={to} className="aaction-card">
            <div className="aaction-card__icon" style={{ background: color + '15', color }}>
                {icon}
            </div>
            <div>
                <div className="aaction-card__label">{label}</div>
                <div className="aaction-card__desc">{desc}</div>
            </div>
            <svg className="aaction-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </Link>
    </motion.div>
);

/* ── Recent log row ── */
const ACTION_STYLE = {
    CREATE:   { bg: '#d4edda', color: '#155724', label: '+ Créer' },
    UPDATE:   { bg: '#fff3cd', color: '#856404', label: '✎ Modifier' },
    DELETE:   { bg: '#f8d7da', color: '#721c24', label: '✕ Supprimer' },
    DOWNLOAD: { bg: '#d1ecf1', color: '#0c5460', label: '↓ Télécharger' },
    LOGIN:    { bg: '#e2e3e5', color: '#383d41', label: '→ Connexion' },
    LOGOUT:   { bg: '#e2e3e5', color: '#383d41', label: '← Déconnexion' },
};

const formatAgo = (dateStr) => {
    if (!dateStr) return '—';
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "À l'instant";
    if (m < 60) return `Il y a ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `Il y a ${h}h`;
    return new Date(dateStr).toLocaleDateString('fr-FR');
};

/* ════════════════════════════════════════ */
const AdminStats = () => {
    const [stats, setStats] = useState({ pubs: null, researchers: null, users: null, domains: null });
    const [logs, setLogs] = useState([]);
    const [actionBreakdown, setActionBreakdown] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            const [pubsR, resR, usersR, domR, logsR] = await Promise.allSettled([
                api.get('/publications'),
                api.get('/researchers'),
                api.get('/users'),
                api.get('/domains'),
                api.get('/admin/audit'),
            ]);

            const pubs     = pubsR.status    === 'fulfilled' ? pubsR.value.data    : [];
            const res      = resR.status     === 'fulfilled' ? resR.value.data     : [];
            const users    = usersR.status   === 'fulfilled' ? usersR.value.data   : [];
            const domains  = domR.status     === 'fulfilled' ? domR.value.data     : [];
            const allLogs  = logsR.status    === 'fulfilled' ? logsR.value.data    : [];

            setStats({ pubs: pubs.length, researchers: res.length, users: users.length, domains: domains.length });
            setLogs(allLogs.slice(0, 8));

            // Comptage par action
            const breakdown = {};
            allLogs.forEach(l => { breakdown[l.action] = (breakdown[l.action] || 0) + 1; });
            setActionBreakdown(breakdown);

            setLoading(false);
        };
        fetchAll();
    }, []);

    // Sparkline factice basée sur le total (données simulées pour la tendance)
    const spark = (total) => {
        if (!total) return [];
        const arr = [];
        for (let i = 0; i < 7; i++) {
            arr.push(Math.max(1, Math.round((total / 7) * (0.6 + Math.random() * 0.8))));
        }
        arr[arr.length - 1] = total > 7 ? Math.round(total / 5) : total;
        return arr;
    };

    const totalActions = Object.values(actionBreakdown).reduce((a, b) => a + b, 0);

    return (
        <div className="adminstats">
            {/* ── Header ── */}
            <motion.div className="adminstats__header"
                        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div>
                    <h2 className="adminstats__title">Vue d'ensemble</h2>
                    <p className="adminstats__sub">Statistiques en temps réel de la plateforme</p>
                </div>
                <div className="adminstats__live">
                    <span className="adminstats__live-dot" />
                    Données en direct
                </div>
            </motion.div>

            {/* ── Stat cards ── */}
            <div className="astat-grid">
                <StatCard
                    icon="📄" label="Publications" color="#1C4ED8"
                    value={loading ? null : stats.pubs}
                    sub="Articles scientifiques"
                    sparkData={spark(stats.pubs)}
                    delay={0} to="publications"
                />
                <StatCard
                    icon="👥" label="Chercheurs" color="#0D9488"
                    value={loading ? null : stats.researchers}
                    sub="Profils actifs"
                    sparkData={spark(stats.researchers)}
                    delay={1} to="researchers"
                />
                <StatCard
                    icon="👤" label="Utilisateurs" color="#7C3AED"
                    value={loading ? null : stats.users}
                    sub="Comptes inscrits"
                    sparkData={spark(stats.users)}
                    delay={2} to="users"
                />
                <StatCard
                    icon="🏷️" label="Domaines" color="#D97706"
                    value={loading ? null : stats.domains}
                    sub="Domaines de recherche"
                    sparkData={spark(stats.domains)}
                    delay={3} to="domains"
                />
            </div>

            {/* ── Middle row ── */}
            <div className="adminstats__mid">

                {/* Actions breakdown */}
                <motion.div className="abreakdown"
                            variants={fadeUp} custom={4} initial="hidden" animate="visible">
                    <div className="abreakdown__head">
                        <h3 className="abreakdown__title">Activité par type d'action</h3>
                        <span className="abreakdown__total">{totalActions} actions</span>
                    </div>
                    <div className="abreakdown__list">
                        {Object.entries(ACTION_STYLE).map(([key, style]) => {
                            const count = actionBreakdown[key] || 0;
                            const pct = totalActions ? Math.round((count / totalActions) * 100) : 0;
                            return (
                                <div key={key} className="abreakdown__row">
                                    <span className="abreakdown__badge"
                                          style={{ background: style.bg, color: style.color }}>
                                        {style.label}
                                    </span>
                                    <div className="abreakdown__bar-wrap">
                                        <div className="abreakdown__bar"
                                             style={{ width: `${pct}%`, background: style.color + '55', borderRight: `3px solid ${style.color}` }} />
                                    </div>
                                    <span className="abreakdown__count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Quick actions */}
                <motion.div className="aquick"
                            variants={fadeUp} custom={5} initial="hidden" animate="visible">
                    <h3 className="aquick__title">Accès rapide</h3>
                    <div className="aquick__list">
                        <ActionCard to="researchers" icon="👥" color="#0D9488" delay={6}
                                    label="Gérer les chercheurs" desc="Ajouter, modifier, supprimer" />
                        <ActionCard to="publications" icon="📄" color="#1C4ED8" delay={7}
                                    label="Gérer les publications" desc="Articles et fichiers PDF" />
                        <ActionCard to="domains" icon="🏷️" color="#D97706" delay={8}
                                    label="Gérer les domaines" desc="Hiérarchie et catégories" />
                        <ActionCard to="users" icon="👤" color="#7C3AED" delay={9}
                                    label="Gérer les utilisateurs" desc="Comptes et rôles" />
                        <ActionCard to="audit" icon="📋" color="#DC2626" delay={10}
                                    label="Journal d'audit" desc="Historique des actions" />
                    </div>
                </motion.div>
            </div>

            {/* ── Recent activity ── */}
            <motion.div className="arecent"
                        variants={fadeUp} custom={11} initial="hidden" animate="visible">
                <div className="arecent__head">
                    <h3 className="arecent__title">Activité récente</h3>
                    <Link to="audit" className="arecent__viewall">Tout voir →</Link>
                </div>

                {loading ? (
                    <div className="arecent__loading">Chargement...</div>
                ) : logs.length === 0 ? (
                    <div className="arecent__empty">
                        <span>📋</span>
                        <p>Aucune activité récente</p>
                    </div>
                ) : (
                    <div className="arecent__list">
                        {logs.map((log, i) => {
                            const style = ACTION_STYLE[log.action] || { bg: '#e9ecef', color: '#495057', label: log.action };
                            const initials = (log.utilisateurEmail || 'AN').slice(0, 2).toUpperCase();
                            return (
                                <motion.div key={log.id} className="arecent__row"
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i }}>
                                    <div className="arecent__avatar">{initials}</div>
                                    <div className="arecent__info">
                                        <span className="arecent__email">{log.utilisateurEmail}</span>
                                        <span className="arecent__desc">{log.description}</span>
                                    </div>
                                    <span className="arecent__badge"
                                          style={{ background: style.bg, color: style.color }}>
                                        {style.label}
                                    </span>
                                    <span className="arecent__time">{formatAgo(log.dateAction)}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminStats;