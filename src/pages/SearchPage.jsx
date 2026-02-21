import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import './SearchPage.css';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [keyword,  setKeyword]  = useState(searchParams.get('keyword') ?? '');
    const [domainId, setDomainId] = useState(searchParams.get('domain')  ?? '');
    const [author,   setAuthor]   = useState(searchParams.get('author')  ?? '');
    const [domains,  setDomains]  = useState([]);
    const [results,  setResults]  = useState(null);
    const [loading,  setLoading]  = useState(false);
    const [tab,      setTab]      = useState('publications');

    useEffect(() => {
        api.get('/public/domains').then(r => setDomains(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        const k = searchParams.get('keyword') ?? '';
        const d = searchParams.get('domain')  ?? '';
        const a = searchParams.get('author')  ?? '';
        if (k || d || a) {
            setKeyword(k); setDomainId(d); setAuthor(a);
            runSearch(k, d, a);
        }
        // eslint-disable-next-line
    }, []);

    const runSearch = async (k = keyword, d = domainId, a = author) => {
        if (!k && !d && !a) return;
        setLoading(true);
        setResults(null);

        const params = {};
        if (k) params.keyword = k;
        if (d) params.domain  = d;
        if (a) params.author  = a;
        setSearchParams(params);

        try {
            const [pubR, resR] = await Promise.allSettled([
                api.get('/public/publications/search', { params: { keyword: k, domaineId: d, chercheur: a } }),
                api.get('/public/researchers/search',  { params: { keyword: k, domaineId: d, nom: a } }),
            ]);
            setResults({
                publications: pubR.status === 'fulfilled' ? pubR.value.data : [],
                researchers:  resR.status === 'fulfilled' ? resR.value.data : [],
            });
        } catch {
            setResults({ publications: [], researchers: [] });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        runSearch();
    };

    const totalResults = results
        ? results.publications.length + results.researchers.length
        : 0;

    return (
        <div className="searchpage">
            <motion.div
                className="searchpage__header"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="searchpage__title">Recherche</h1>
                <p className="searchpage__sub">
                    Recherchez par mots-clés, nom de chercheur ou domaine de recherche
                </p>
            </motion.div>

            {/* ── Formulaire ── */}
            <motion.form
                onSubmit={handleSubmit}
                className="search-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <div className="search-form__row">
                    <div className="search-form__field">
                        <label>Mots-clés</label>
                        <input
                            type="text"
                            placeholder="Ex : apprentissage automatique, NLP..."
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                        />
                    </div>
                    <div className="search-form__field">
                        <label>Nom du chercheur</label>
                        <input
                            type="text"
                            placeholder="Ex : Ahmed Ben Ali..."
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                        />
                    </div>
                    <div className="search-form__field">
                        <label>Domaine</label>
                        <select value={domainId} onChange={e => setDomainId(e.target.value)}>
                            <option value="">Tous les domaines</option>
                            {domains.map(d => (
                                <option key={d.id} value={d.id}>{d.nom}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ✅ FIX: bouton compact aligné à droite dans un wrapper */}
                <div className="search-form__actions">
                    <button type="submit" className="search-form__btn" disabled={loading}>
                        {loading ? (
                            <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Recherche...</>
                        ) : (
                            <>🔍 Rechercher</>
                        )}
                    </button>
                </div>
            </motion.form>

            {/* ── Résultats ── */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        className="search-loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="spinner" />
                        Recherche en cours...
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {results && !loading && (
                    <motion.div
                        className="search-results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <div className="search-results__summary">
                            <strong>{totalResults}</strong> résultat(s) trouvé(s)
                        </div>

                        <div className="search-tabs">
                            <button
                                className={`search-tab ${tab === 'publications' ? 'active' : ''}`}
                                onClick={() => setTab('publications')}
                            >
                                📄 Publications ({results.publications.length})
                            </button>
                            <button
                                className={`search-tab ${tab === 'researchers' ? 'active' : ''}`}
                                onClick={() => setTab('researchers')}
                            >
                                👥 Chercheurs ({results.researchers.length})
                            </button>
                        </div>

                        {tab === 'publications' && (
                            results.publications.length === 0
                                ? <p className="search-empty">Aucune publication trouvée.</p>
                                : <div className="search-pub-list">
                                    {results.publications.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link to={`/publications/${p.id}`} className="search-pub-item">
                                                <div className="search-pub-item__badge">{p.domaine?.nom ?? 'Général'}</div>
                                                <h3 className="search-pub-item__title">{p.titre}</h3>
                                                <p className="search-pub-item__authors">
                                                    {p.chercheurs?.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                                                </p>
                                                {p.resume && (
                                                    <p className="search-pub-item__abstract">{p.resume}</p>
                                                )}
                                                <span className="search-pub-item__year">{p.annee}</span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                        )}

                        {tab === 'researchers' && (
                            results.researchers.length === 0
                                ? <p className="search-empty">Aucun chercheur trouvé.</p>
                                : <div className="search-res-list">
                                    {results.researchers.map((r, i) => (
                                        <motion.div
                                            key={r.id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link to={`/researchers/${r.id}`} className="search-res-item">
                                                <div className="search-res-item__avatar">
                                                    {r.prenom?.[0]}{r.nom?.[0]}
                                                </div>
                                                <div>
                                                    <h3 className="search-res-item__name">{r.prenom} {r.nom}</h3>
                                                    <p className="search-res-item__domain">{r.domaine?.nom ?? r.specialite}</p>
                                                    <span className="search-res-item__pubs">
                                                        {r.publications?.length ?? 0} publication(s)
                                                    </span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {!results && !loading && (
                <motion.div
                    className="search-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <span>🔍</span>
                    <p>Entrez des mots-clés ou sélectionnez un domaine pour commencer</p>
                </motion.div>
            )}
        </div>
    );
};

export default SearchPage;