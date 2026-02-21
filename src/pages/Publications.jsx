import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import publicationService from '../services/publication.service';
import domainService from '../services/domain.service';
import PublicationCard from '../components/PublicationCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import './Publications.css';

const fadeUp = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Publications = () => {
    const [publications, setPublications] = useState([]);
    const [domains,      setDomains]      = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [searchKeyword,   setSearchKeyword]   = useState('');
    const [selectedDomain,  setSelectedDomain]  = useState('');

    useEffect(() => { fetchData(); }, []);

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
        const pubs = (!keyword && !selectedDomain)
            ? await publicationService.getAllPublic()
            : await publicationService.searchPublic(params);
        setPublications(pubs);
    };

    const handleDomainChange = async (domainId) => {
        setSelectedDomain(domainId);
        const params = {};
        if (searchKeyword) params.keyword = searchKeyword;
        if (domainId) params.domaineId = domainId;
        const pubs = (!searchKeyword && !domainId)
            ? await publicationService.getAllPublic()
            : await publicationService.searchPublic(params);
        setPublications(pubs);
    };

    if (loading) return <Loader />;

    return (
        <div className="publications-page container">
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
            >
                Publications scientifiques
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <SearchBar
                    onSearch={handleSearch}
                    onDomainChange={handleDomainChange}
                    domains={domains}
                />
            </motion.div>

            <AnimatePresence mode="wait">
                {publications.length === 0 ? (
                    <motion.p
                        key="empty"
                        className="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        Aucune publication trouvée.
                    </motion.p>
                ) : (
                    /* ✅ Animation au scroll : chaque carte entre quand elle devient visible */
                    <motion.div
                        key="grid"
                        className="publications-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.05 }}
                        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                    >
                        {publications.map(pub => (
                            <motion.div
                                key={pub.id}
                                variants={fadeUp}
                                viewport={{ once: true }}
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