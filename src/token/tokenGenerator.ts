// /src/token/tokenGenerator.ts

import * as jwt from 'jsonwebtoken';

// Assurez-vous que JWT_SECRET est défini dans vos variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET || 'a2f50438f3685ba561af4b2045bd60dbcd1bd2148b078b4be4bf10003a137d91e07c53d2fe196763dfe712328b4890ba553b7df658f84792c7f94a75d2bb8203';

/**
 * Génère un jeton d'authentification JWT pour un utilisateur.
 * @param id ID de l'utilisateur.
 * @returns Le jeton JWT.
 */
export const generateAuthToken = (id: number): string => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' }); // Expire en 1 jour
};

/**
 * Génère un jeton de vérification/réinitialisation de mot de passe (simple chaîne).
 * @returns Un jeton alphanumérique simple.
 */
export const generateVerificationOrResetToken = (): string => {
    // Une simple chaîne aléatoire (pour l'email)
    const length = 6;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

/**
 * Calcule la date d'expiration pour un token (ici, 1 heure).
 * @returns Date d'expiration.
 */
export const getExpiryDate = (minutes: number = 60): Date => {
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    return date;
};