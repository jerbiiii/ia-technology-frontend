import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
// ✅ FIX: useParams importé ici en haut, pas en bas du fichier (causait une erreur fatale)
import api from '../../services/api';
import './ModeratorPanel.css';

/* ─── Liste des annonces ─── */
const AnnouncementList = () => {
    const [items, setItems]  = useState([]);
    const [loading, setLoad] = useState(true);
    const navigate           = useNavigate();

    const load = () => {
        setLoad(true);
        api.get('/announcements')
            .then(r => setItems(r.data))
            .catch(() => setItems([]))
            .finally(() => setLoad(false));
    };
    useEffect(load, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette annonce ?')) return;
        await api.delete(`/announcements/${id}`);
        load();
    };

    return (
        <div className="mod-section">
            <div className="mod-section__head">
                <h2>Actualités & Annonces</h2>
                <button className="btn-add" onClick={() => navigate('new')}>
                    + Nouvelle annonce
                </button>
            </div>

            {loading ? <p>Chargement...</p> : (
                <div className="mod-list">
                    {items.length === 0 && <p className="mod-empty">Aucune annonce pour le moment.</p>}
                    {items.map(a => (
                        <div key={a.id} className="mod-item">
                            <div className="mod-item__info">
                                <span className="mod-item__date">
                                    {new Date(a.datePublication).toLocaleDateString('fr-FR')}
                                </span>
                                <h3 className="mod-item__title">{a.titre}</h3>
                                <p className="mod-item__body">{a.contenu}</p>
                            </div>
                            <div className="mod-item__actions">
                                <button className="btn-edit" onClick={() => navigate(`edit/${a.id}`)}>✏️ Modifier</button>
                                <button className="btn-del"  onClick={() => handleDelete(a.id)}>🗑 Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Formulaire annonce ─── */
const AnnouncementForm = ({ editId }) => {
    const navigate = useNavigate();
    const [form, setForm]     = useState({ titre: '', contenu: '', pinned: false });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editId) {
            api.get(`/announcements/${editId}`).then(r => setForm(r.data));
        }
    }, [editId]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editId) {
                await api.put(`/announcements/${editId}`, form);
            } else {
                await api.post('/announcements', form);
            }
            navigate('/moderateur');
        } catch {
            alert('Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mod-section">
            <div className="mod-section__head">
                <h2>{editId ? "Modifier l'annonce" : 'Nouvelle annonce'}</h2>
                <button className="btn-back" onClick={() => navigate('/moderateur')}>← Retour</button>
            </div>
            <form className="mod-form" onSubmit={handleSubmit}>
                <label>Titre <span className="required">*</span>
                    <input
                        name="titre" required
                        value={form.titre}
                        onChange={handleChange}
                        placeholder="Titre de l'annonce"
                    />
                </label>
                <label>Contenu <span className="required">*</span>
                    <textarea
                        name="contenu" required rows={6}
                        value={form.contenu}
                        onChange={handleChange}
                        placeholder="Contenu de l'annonce..."
                    />
                </label>
                <label className="mod-form__checkbox">
                    <input
                        type="checkbox"
                        name="pinned"
                        checked={form.pinned ?? false}
                        onChange={handleChange}
                    />
                    Épingler sur la page d'accueil
                </label>
                <div className="mod-form__actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/moderateur')}>
                        Annuler
                    </button>
                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? 'Sauvegarde...' : '💾 Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

/* ✅ FIX: Wrapper défini avant le composant principal, useParams importé en haut */
const AnnouncementFormWrapper = () => {
    const { id } = useParams();
    return <AnnouncementForm editId={id} />;
};

/* ══ Panel Modérateur principal ══ */
const ModerateurPanel = () => (
    <div className="mod-panel container">
        <div className="mod-panel__header">
            <h1>Espace Modérateur</h1>
            <nav className="mod-panel__nav">
                <Link to="/moderateur">📋 Annonces</Link>
                <Link to="/">🏠 Voir le site</Link>
            </nav>
        </div>
        <Routes>
            <Route index         element={<AnnouncementList />} />
            <Route path="new"    element={<AnnouncementForm />} />
            <Route path="edit/:id" element={<AnnouncementFormWrapper />} />
        </Routes>
    </div>
);

export default ModerateurPanel;