import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [results, setResults]           = useState([]);
    const [loading, setLoad]              = useState(false);
    const [searched, setSearched]         = useState(false);

    const [query, setQuery]   = useState(searchParams.get('q')        || '');
    const [domain, setDomain] = useState(searchParams.get('domaine')  || '');
    const [author, setAuthor] = useState(searchParams.get('chercheur')|| '');

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!query && !domain && !author) return;

        setLoad(true);
        setSearched(true);

        // Mise à jour de l'URL avec les paramètres de recherche
        const params = {};
        if (query)  params.q        = query;
        if (domain) params.domaine  = domain;
        if (author) params.chercheur = author;
        setSearchParams(params);

        try {
            // ✅ endpoint public de recherche
            const response = await api.get('/public/publications/search', { params });
            setResults(response.data);
        } catch (err) {
            console.error('Erreur recherche :', err);
            setResults([]);
        } finally {
            setLoad(false);
        }
    };

    // Lance la recherche au montage si des paramètres sont déjà dans l'URL
    useState(() => {
        if (query || domain || author) handleSearch();
    }, []);

    return (
        <div className="container search-page">
            <h1 className="search-page__title">Recherche de publications</h1>

            {/* ── Formulaire ── */}
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-form__row">
                    <input
                        type="text"
                        placeholder="Mots-clés (titre, résumé...)"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="search-input"
                    />
                    <input
                        type="text"
                        placeholder="Domaine"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        className="search-input"
                    />
                    <input
                        type="text"
                        placeholder="Nom du chercheur"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn-primary search-btn">
                        🔍 Rechercher
                    </button>
                </div>
            </form>

            {/* ── Résultats ── */}
            {loading && <p className="search-loading">Recherche en cours...</p>}

            {!loading && searched && (
                <div className="search-results">
                    <p className="search-results__count">
                        {results.length === 0
                            ? 'Aucune publication trouvée.'
                            : `${results.length} publication(s) trouvée(s)`}
                    </p>

                    {results.map(p => {

                        const annee = p.datePublication
                            ? new Date(p.datePublication).getFullYear()
                            : null;

                        const chercheurs = Array.isArray(p.chercheursNoms)
                            ? p.chercheursNoms.join(', ')
                            : '—';

                        const domaines = Array.isArray(p.domainesNoms)
                            ? p.domainesNoms.join(', ')
                            : '—';

                        return (
                            <article key={p.id} className="search-result-card">
                                <h2 className="search-result-card__title">
                                    <Link to={`/publications/${p.id}`}>{p.titre}</Link>
                                </h2>

                                <div className="search-result-card__meta">

                                    <span>👤 {chercheurs}</span>


                                    <span>🏷️ {domaines}</span>


                                    {annee && <span>📅 {annee}</span>}

                                    {p.revue && <span>📰 {p.revue}</span>}
                                </div>

                                {p.resume && (
                                    <p className="search-result-card__abstract">
                                        {p.resume.length > 200
                                            ? p.resume.slice(0, 200) + '...'
                                            : p.resume}
                                    </p>
                                )}

                                <Link
                                    to={`/publications/${p.id}`}
                                    className="search-result-card__link"
                                >
                                    Voir la publication →
                                </Link>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchPage;