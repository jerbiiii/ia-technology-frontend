import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import './SearchPage.css';

/* ══════════════════════════════════════════════
   Page de Recherche – ACCÈS LIBRE
   Recherche par : domaine, nom chercheur, mots-clés
   ══════════════════════════════════════════════ */

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [keyword, setKeyword]   = useState(searchParams.get('keyword') ?? '');
    const [domainId, setDomainId] = useState(searchParams.get('domain')  ?? '');
    const [author,   setAuthor]   = useState(searchParams.get('author')  ?? '');
    const [domains,  setDomains]  = useState([]);
    const [results,  setResults]  = useState(null);   // null = pas encore cherché
    const [loading,  setLoading]  = useState(false);
    const [tab,      setTab]      = useState('publications'); // publications | researchers

    // Charger les domaines pour le filtre
    useEffect(() => {
        api.get('/domains').then(r => setDomains(r.data)).catch(() => {});
    }, []);

    // Lancer la recherche si des params sont dans l'URL
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

        // Mise à jour de l'URL pour partager la recherche
        const params = {};
        if (k) params.keyword = k;
        if (d) params.domain  = d;
        if (a) params.author  = a;
        setSearchParams(params);

        try {
            const [pubR, resR] = await Promise.allSettled([
                api.get('/publications/search', { params: { keyword: k, domaineId: d, chercheur: a } }),
                api.get('/researchers/search',  { params: { keyword: k, domaineId: d, nom: a } }),
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

            <div className="searchpage__header">
                <h1 className="searchpage__title">Recherche</h1>
                <p className="searchpage__sub">
                    Recherchez par mots-clés, nom de chercheur ou domaine de recherche
                </p>
            </div>

            {/* ── Formulaire de recherche ── */}
            <form onSubmit={handleSubmit} className="search-form">
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
                <button type="submit" className="search-form__btn" disabled={loading}>
                    {loading ? 'Recherche...' : '🔍 Rechercher'}
                </button>
            </form>

            {/* ── Résultats ── */}
            {loading && (
                <div className="search-loading">
                    <div className="spinner" />
                    Recherche en cours...
                </div>
            )}

            {results && !loading && (
                <div className="search-results">
                    <div className="search-results__summary">
                        {totalResults} résultat(s) trouvé(s)
                    </div>

                    {/* Onglets */}
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

                    {/* Publications */}
                    {tab === 'publications' && (
                        results.publications.length === 0
                            ? <p className="search-empty">Aucune publication trouvée.</p>
                            : <div className="search-pub-list">
                                {results.publications.map(p => (
                                    <Link key={p.id} to={`/publications/${p.id}`} className="search-pub-item">
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
                                ))}
                            </div>
                    )}

                    {/* Chercheurs */}
                    {tab === 'researchers' && (
                        results.researchers.length === 0
                            ? <p className="search-empty">Aucun chercheur trouvé.</p>
                            : <div className="search-res-list">
                                {results.researchers.map(r => (
                                    <Link key={r.id} to={`/researchers/${r.id}`} className="search-res-item">
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
                                ))}
                            </div>
                    )}
                </div>
            )}

            {/* État vide initial */}
            {!results && !loading && (
                <div className="search-hint">
                    <span>🔍</span>
                    <p>Entrez des mots-clés ou sélectionnez un domaine pour commencer</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;