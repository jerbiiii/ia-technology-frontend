import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api.js';
import './ActualiteManagement.css';

const ActualiteManagement = () => {
    const [actualites, setActualites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingActualite, setEditingActualite] = useState(null);
    const [formData, setFormData] = useState({
        titre: '',
        contenu: '',
        datePublication: new Date().toISOString().slice(0,16) // format datetime-local
    });

    useEffect(() => {
        fetchActualites();
    }, []);

    const fetchActualites = async () => {
        try {
            const response = await api.get('/actualites');
            setActualites(response.data);
        } catch (error) {
            console.error('Erreur chargement actualités:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convertir la date au format ISO avec le fuseau horaire local
            const dateToSend = formData.datePublication
                ? new Date(formData.datePublication).toISOString()
                : new Date().toISOString();

            const dataToSend = {
                titre: formData.titre,
                contenu: formData.contenu,
                datePublication: dateToSend
            };

            if (editingActualite) {
                await api.put(`/actualites/${editingActualite.id}`, dataToSend);
            } else {
                await api.post('/actualites', dataToSend);
            }
            fetchActualites();
            resetForm();
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            alert('Erreur lors de l\'enregistrement : ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (item) => {
        setEditingActualite(item);
        setFormData({
            titre: item.titre,
            contenu: item.contenu,
            datePublication: item.datePublication ? item.datePublication.slice(0,16) : ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette actualité ?')) {
            try {
                await api.delete(`/actualites/${id}`);
                fetchActualites();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingActualite(null);
        setFormData({
            titre: '',
            contenu: '',
            datePublication: new Date().toISOString().slice(0,16)
        });
    };

    if (loading) return <div className="loader">Chargement...</div>;

    return (
        <motion.div
            className="actualite-management"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="header-actions">
                <h2>Gestion des actualités</h2>
                <button className="btn-add" onClick={() => setShowForm(true)}>
                    + Nouvelle actualité
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="form-modal"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <h3>{editingActualite ? 'Modifier' : 'Créer'} une actualité</h3>
                        <form onSubmit={handleSubmit} className="actualite-form">
                            <div className="form-group">
                                <label>Titre *</label>
                                <input
                                    type="text"
                                    name="titre"
                                    value={formData.titre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contenu *</label>
                                <textarea
                                    name="contenu"
                                    rows="5"
                                    value={formData.contenu}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date de publication</label>
                                <input
                                    type="datetime-local"
                                    name="datePublication"
                                    value={formData.datePublication}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingActualite ? 'Mettre à jour' : 'Créer'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="actualites-list">
                {actualites.length === 0 ? (
                    <p className="no-data">Aucune actualité pour le moment.</p>
                ) : (
                    actualites.map(item => (
                        <motion.div
                            key={item.id}
                            className="actualite-card"
                            whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
                        >
                            <h3>{item.titre}</h3>
                            <p className="date">
                                {new Date(item.datePublication).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            <p className="contenu">{item.contenu}</p>
                            <div className="card-actions">
                                <button onClick={() => handleEdit(item)} className="btn-edit">Modifier</button>
                                <button onClick={() => handleDelete(item.id)} className="btn-delete">Supprimer</button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default ActualiteManagement;