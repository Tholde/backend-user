// /src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/ErrorResponse';
import UserModel from '../models/UserModels';
import { IUser } from '../types/IUser';

// Extension de l'interface Request pour y ajouter 'user'
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'votre_super_secret_jwt_par_defaut';

/**
 * Middleware pour protéger les routes avec JWT.
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Vérifie le header 'Authorization'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse("Accès non autorisé (Pas de token).", 401));
    }

    try {
        // 1. Vérifier le token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

        // 2. Récupérer l'utilisateur (pour s'assurer qu'il existe toujours)
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return next(new ErrorResponse("Accès non autorisé (Utilisateur non trouvé).", 401));
        }

        // 3. Attacher l'utilisateur à la requête
        req.user = user;
        next();

    } catch (err) {
        // Le middleware d'erreur gérera les erreurs JWT (JsonWebTokenError, TokenExpiredError)
        next(err);
    }
};

/**
 * Middleware pour restreindre l'accès par rôle.
 * @param roles Les rôles autorisés (ex: 'admin', 'editor').
 */
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.roleUser)) {
            return next(new ErrorResponse(`Accès non autorisé. Seuls les rôles ${roles.join(', ')} peuvent accéder.`, 403));
        }
        next();
    };
};