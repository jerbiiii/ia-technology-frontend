import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Profile.css';

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                nom: user.nom || '',
                prenom: user.prenom || '',
                email: user.email || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage('Les mots de passe ne correspondent pas');
            return;
        }
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await fetch('http://localhost:8080/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nom: formData.nom,
                    prenom: formData.prenom,
                    email: formData.email,
                    password: formData.password || undefined
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Profil mis à jour avec succès');
                // Mettre à jour le user dans localStorage et contexte
                const updatedUser = { ...user, nom: formData.nom, prenom: formData.prenom, email: formData.email };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // On peut aussi rafraîchir le token si nécessaire
            } else {
                setMessage(data.message || 'Erreur lors de la mise à jour');
            }
        } catch (err) {
            setMessage('Erreur réseau');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="profile-page container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2>Mon profil</h2>
            {message && <div className={`alert ${message.includes('succès') ? 'success' : 'error'}`}>{message}</div>}
            <form onSubmit={handleSubmit} className="profile-form">
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
                    <label>Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Confirmer le mot de passe</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
            </form>
        </motion.div>
    );
};

export default Profile;