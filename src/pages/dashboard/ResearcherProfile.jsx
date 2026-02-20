import { useState } from 'react';
import researcherService from '../../services/researcher.service';
import './ResearcherProfile.css';

const ResearcherProfile = ({ researcher }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: researcher.nom || '',
        prenom: researcher.prenom || '',
        email: researcher.email || '',
        affiliation: researcher.affiliation || ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await researcherService.update(researcher.id, formData);
            setMessage('Profil mis à jour avec succès');
            setIsEditing(false);
            // Mettre à jour l'affichage (mais on ne recharge pas le parent)
            researcher.nom = formData.nom;
            researcher.prenom = formData.prenom;
            researcher.email = formData.email;
            researcher.affiliation = formData.affiliation;
        } catch (error) {
            setMessage('Erreur lors de la mise à jour');
        }
    };

    if (isEditing) {
        return (
            <div className="profile-edit">
                <h3>Modifier mon profil</h3>
                {message && <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom</label>
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Prénom</label>
                        <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Affiliation</label>
                        <input type="text" name="affiliation" value={formData.affiliation} onChange={handleChange} />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Enregistrer</button>
                        <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Annuler</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="profile-view">
            <h3>Mon profil chercheur</h3>
            <p><strong>Nom :</strong> {researcher.nom} {researcher.prenom}</p>
            <p><strong>Email :</strong> {researcher.email || 'Non renseigné'}</p>
            <p><strong>Affiliation :</strong> {researcher.affiliation || 'Non renseignée'}</p>
            <p><strong>Domaine principal :</strong> {researcher.domainePrincipalNom || 'Non défini'}</p>
            <button className="btn-edit" onClick={() => setIsEditing(true)}>Modifier</button>
        </div>
    );
};

export default ResearcherProfile;