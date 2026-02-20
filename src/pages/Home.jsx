import React from 'react';
import { Container } from 'react-bootstrap';

const Home = () => {
    return (
        <Container className="mt-5">
            <h1>Bienvenue sur IA-Technology</h1>
            <p>Ceci est la page d'accueil de l'application de gestion des travaux scientifiques.</p>
            <p>Veuillez vous connecter pour accéder aux fonctionnalités.</p>
        </Container>
    );
};

export default Home;