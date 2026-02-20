import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import homeContentService from '../../services/Homecontent.service.js';
import './HomeContentManagement.css';

const SECTIONS = ['HERO', 'CTA', 'FOOTER'];
const TYPES = ['TEXT', 'HTML', 'URL'];

const SECTION_LABELS = {
    HERO: '🏠 Section Héro (bannière principale)',
    CTA:  '📢 Section CTA (appel à l\'action)',
    FOOTER: '🔻 Pied de page',
};

const HomeContentManagement = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [editingInline, setEditingInline] = useState(null); // id en cours d'édition inline
    const [inlineValue, setInlineValue] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [formData, setFormData] = useState({
        cle: '', libelle: '', valeur: '', type: 'TEXT', section: 'HERO', actif: true
    });

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        setLoading(true);
        try {
            const data = await homeContentService.getAll();
            setContents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await homeContentService.update(editing.id, formData);
                showMsg('Contenu mis à jour avec succès');
            } else {
                await homeContentService.create(formData);
                showMsg('Contenu créé avec succès');
            }
            fetchContents();
            resetForm();
        } catch (err) {
            showMsg('Erreur lors de l\'enregistrement', 'error');
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({
            cle: item.cle,
            libelle: item.libelle,
            valeur: item.valeur || '',
            type: item.type || 'TEXT',
            section: item.section,
            actif: item.actif
        });
        setShowForm(true);
    };

    const handleInlineEdit = (item) => {
        setEditingInline(item.id);
        setInlineValue(item.valeur || '');
    };

    const handleInlineSave = async (id) => {
        try {
            await homeContentService.updateValeur(id, inlineValue);
            setContents(prev => prev.map(c => c.id === id ? { ...c, valeur: inlineValue } : c));
            setEditingInline(null);
            showMsg('Valeur mise à jour');
        } catch (err) {
            showMsg('Erreur lors de la sauvegarde', 'error');
        }
    };

    const handleToggleActif = async (item) => {
        try {
            await homeContentService.update(item.id, { ...item, actif: !item.actif });
            fetchContents();
        } catch (err) {
            showMsg('Erreur', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce contenu ?')) {
            try {
                await homeContentService.delete(id);
                fetchContents();
                showMsg('Contenu supprimé');
            } catch (err) {
                showMsg('Erreur lors de la suppression', 'error');
            }
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditing(null);
        setFormData({ cle: '', libelle: '', valeur: '', type: 'TEXT', section: 'HERO', actif: true });
    };

    // Grouper les contenus par section
    const grouped = SECTIONS.reduce((acc, section) => {
        acc[section] = contents.filter(c => c.section === section);
        return acc;
    }, {});

    if (loading) return <div className="hcm-loading">Chargement...</div>;

    return (
        <motion.div className="hcm-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="hcm-header">
                <div>
                    <h2>🏗️ Contenu de la page d'accueil</h2>
                    <p className="hcm-subtitle">
                        Modifiez les textes et informations affichés sur la page d'accueil
                    </p>
                </div>
                <button className="btn-add" onClick={() => setShowForm(true)}>
                    + Nouveau contenu
                </button>
            </div>

            {/* Message feedback */}
            {message.text && (
                <div className={`hcm-alert hcm-alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Formulaire d'ajout/édition */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="hcm-form-card"
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                    >
                        <h3>{editing ? '✏️ Modifier' : '➕ Créer'} un contenu</h3>
                        <form onSubmit={handleSubmit} className="hcm-form">
                            <div className="hcm-form-row">
                                <div className="hcm-field">
                                    <label>Clé technique *</label>
                                    <input
                                        type="text"
                                        value={formData.cle}
                                        onChange={e => setFormData({ ...formData, cle: e.target.value })}
                                        placeholder="ex: hero_title"
                                        required
                                        disabled={!!editing}
                                    />
                                    <small>Identifiant unique (ne peut pas être modifié)</small>
                                </div>
                                <div className="hcm-field">
                                    <label>Libellé *</label>
                                    <input
                                        type="text"
                                        value={formData.libelle}
                                        onChange={e => setFormData({ ...formData, libelle: e.target.value })}
                                        placeholder="ex: Titre principal de la bannière"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="hcm-form-row">
                                <div className="hcm-field">
                                    <label>Section</label>
                                    <select
                                        value={formData.section}
                                        onChange={e => setFormData({ ...formData, section: e.target.value })}
                                    >
                                        {SECTIONS.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="hcm-field">
                                    <label>Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        {TYPES.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="hcm-field">
                                <label>Valeur</label>
                                <textarea
                                    value={formData.valeur}
                                    onChange={e => setFormData({ ...formData, valeur: e.target.value })}
                                    rows="4"
                                    placeholder="Contenu à afficher..."
                                />
                            </div>

                            <div className="hcm-field hcm-checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.actif}
                                        onChange={e => setFormData({ ...formData, actif: e.target.checked })}
                                    />
                                    Actif (visible sur la page d'accueil)
                                </label>
                            </div>

                            <div className="hcm-form-actions">
                                <button type="submit" className="btn-save">
                                    {editing ? 'Mettre à jour' : 'Créer'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={resetForm}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contenus groupés par section */}
            {contents.length === 0 ? (
                <div className="hcm-empty">
                    <span>📝</span>
                    <p>Aucun contenu configuré pour le moment.</p>
                    <p>Cliquez sur <strong>+ Nouveau contenu</strong> pour commencer.</p>
                </div>
            ) : (
                SECTIONS.map(section => {
                    const items = grouped[section];
                    if (items.length === 0) return null;

                    return (
                        <div key={section} className="hcm-section-block">
                            <h3 className="hcm-section-title">
                                {SECTION_LABELS[section]}
                                <span className="hcm-count">{items.length} élément{items.length > 1 ? 's' : ''}</span>
                            </h3>

                            <div className="hcm-items">
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        className={`hcm-item ${!item.actif ? 'hcm-item-inactive' : ''}`}
                                    >
                                        <div className="hcm-item-header">
                                            <div className="hcm-item-meta">
                                                <span className="hcm-cle">{item.cle}</span>
                                                <span className="hcm-type-badge">{item.type}</span>
                                                {!item.actif && (
                                                    <span className="hcm-inactive-badge">Inactif</span>
                                                )}
                                            </div>
                                            <div className="hcm-item-actions">
                                                <button
                                                    className="btn-icon btn-inline-edit"
                                                    onClick={() => handleInlineEdit(item)}
                                                    title="Édition rapide"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-icon btn-full-edit"
                                                    onClick={() => handleEdit(item)}
                                                    title="Modifier complètement"
                                                >
                                                    ⚙️
                                                </button>
                                                <button
                                                    className={`btn-icon ${item.actif ? 'btn-deactivate' : 'btn-activate'}`}
                                                    onClick={() => handleToggleActif(item)}
                                                    title={item.actif ? 'Désactiver' : 'Activer'}
                                                >
                                                    {item.actif ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                                <button
                                                    className="btn-icon btn-delete"
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Supprimer"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        <div className="hcm-libelle">{item.libelle}</div>

                                        {/* Édition inline */}
                                        {editingInline === item.id ? (
                                            <div className="hcm-inline-edit">
                                                <textarea
                                                    value={inlineValue}
                                                    onChange={e => setInlineValue(e.target.value)}
                                                    rows="3"
                                                    className="hcm-inline-input"
                                                    autoFocus
                                                />
                                                <div className="hcm-inline-actions">
                                                    <button
                                                        className="btn-inline-save"
                                                        onClick={() => handleInlineSave(item.id)}
                                                    >
                                                        ✅ Sauvegarder
                                                    </button>
                                                    <button
                                                        className="btn-inline-cancel"
                                                        onClick={() => setEditingInline(null)}
                                                    >
                                                        ❌ Annuler
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="hcm-valeur">
                                                {item.valeur || <span className="hcm-empty-val">Aucune valeur</span>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}
        </motion.div>
    );
};

export default HomeContentManagement;