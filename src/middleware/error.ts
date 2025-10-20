// /src/middleware/error.ts

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import logger from '../utils/logger';

// Doit avoir 4 arguments pour être reconnu comme un gestionnaire d'erreurs Express
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };

    error.message = err.message;
    error.statusCode = err.statusCode || 500;

    // Log l'erreur pour le développeur
    logger.error('Erreur non gérée:', error);

    // Erreur de base de données (exemple simple pour SQLite)
    if (err.message && err.message.includes('SQLITE_CONSTRAINT')) {
        error.message = 'Erreur de base de données (Contrainte violée).';
        error.statusCode = 400;
    }

    // Erreur de JWT (Token invalide)
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Accès non autorisé (Token JWT invalide).';
        error.statusCode = 401;
    }

    // Erreur d'expiration de JWT
    if (err.name === 'TokenExpiredError') {
        error.message = 'Accès non autorisé (Token JWT expiré).';
        error.statusCode = 401;
    }

    res.status(error.statusCode).json({
        success: false,
        error: error.message || 'Erreur Serveur Interne',
    });
};

export default errorHandler;