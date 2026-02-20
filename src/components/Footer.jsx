import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} IA-Technology. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;