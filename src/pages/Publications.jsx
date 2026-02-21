import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import publicationService from '../services/publication.service';
import domainService from '../services/domain.service';
import PublicationCard from '../components/PublicationCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import './Publications.css';

/* ══════════════════════════════════════════════
   Page Publications – ACCÈS LIBRE (sans connexion)
   Utilise les endpoints /public/
   ══════════════════════════════════════════════ */

const Publications = () => {
    const [publications, setPublications] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pubs, doms] = await Promise.all([
                publicationService.getAllPublic(),
                domainService.getAllPublic()
            ]);
            setPublications(pubs);
            setDomains(doms);
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (keyword) => {
        setSearchKeyword(keyword);
        const params = {};
        if (keyword) params.keyword = keyword;
        if (selectedDomain) params.domaineId = selectedDomain;

        if (!keyword && !selectedDomain) {
            const pubs = await publicationService.getAllPublic();
            setPublications(pubs);
        } else {
            const results = await publicationService.searchPublic(params);
            setPublications(results);
        }
    };

    const handleDomainChange = async (domainId) => {
        setSelectedDomain(domainId);
        const params = {};
        if (searchKeyword) params.keyword = searchKeyword;
        if (domainId) params.domaineId = domainId;

        if (!searchKeyword && !domainId) {
            const pubs = await publicationService.getAllPublic();
            setPublications(pubs);
        } else {
            const results = await publicationService.searchPublic(params);
            setPublications(results);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="publications-page container">
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                Publications scientifiques
            </motion.h1>

            <SearchBar
                onSearch={handleSearch}
                onDomainChange={handleDomainChange}
                domains={domains}
            />

            <AnimatePresence>
                {publications.length === 0 ? (
                    <p className="no-results">Aucune publication trouvée.</p>
                ) : (
                    <motion.div
                        className="publications-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                    >
                        {publications.map(pub => (
                            <motion.div
                                key={pub.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                layout
                            >
                                <PublicationCard publication={pub} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Publications;