import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
    <div style={{
        textAlign: 'center',
        padding: '80px 24px',
        maxWidth: '500px',
        margin: '0 auto'
    }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
        <h1 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '12px' }}>
            Accès non autorisé
        </h1>
        <p style={{ color: '#64748b', marginBottom: '28px' }}>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link to="/" style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#1d4ed8',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600
        }}>
            Retour à l'accueil
        </Link>
    </div>
);

export default UnauthorizedPage;