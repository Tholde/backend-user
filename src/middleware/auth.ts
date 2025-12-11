<<<<<<< HEAD
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
=======
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/ErrorResponse';


// *Assurez-vous que cette clé correspond à celle utilisée dans tokenGenerator.ts*
const JWT_SECRET = 'TY4Xj00VF/0mkxoVlX5WhuyqhQZXUfmk45EOk5UmBM0=';

// Étendez l'interface Request pour ajouter l'objet 'user' après authentification
declare global {
    namespace Express {
        interface Request {
            user?: { id: number; role: string };
>>>>>>> b13ebdf (add crud menu)
        }
    }
}

<<<<<<< HEAD
const JWT_SECRET = process.env.JWT_SECRET || 'tholdeIhany2025';

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
=======
<<<<<<< HEAD
=======
const JWT_SECRET = process.env.JWT_SECRET || 'tholdeIhany2025';

>>>>>>> 3820c3978533045e97f52cf78a59ba39733bad62
/**
 * Middleware pour protéger les routes et vérifier le JWT.
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token: string = '';

    // 1. Vérifier la présence du token dans l'en-tête Authorization
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // // Optionnel : Si utilise des cookies
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    // 2. Vérifier si le token existe
    if (!token) {
        return next(new ErrorResponse('Non autorisé à accéder à cette route. Token manquant.', 401));
    }

    try {
        // 3. Vérifier le token
        // Le décodage nécessite de connaître la structure du payload (id et role)
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number, role: string, iat: number, exp: number };

        // 4. Attacher l'utilisateur à la requête (sans accéder à la DB pour des raisons de performance)
        // Les contrôleurs peuvent utiliser req.user.id
        req.user = { id: decoded.id, role: decoded.role };

        next();
    } catch (err) {
        return next(new ErrorResponse('Non autorisé. Token invalide.', 401));
    }
};
/**
 * Middleware de vérification des rôles (Autorisation).
 * Il doit être utilisé APRÈS le middleware 'protect'.
 * * @param roles Liste des rôles autorisés ('admin', 'manager', 'employee', etc.).
 */
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // 1. Récupérer le rôle de l'utilisateur attaché par 'protect'
        const userRole = (req as any).user?.role;

        // Sécurité : Si le rôle n'existe pas, l'utilisateur n'est pas autorisé
        if (!userRole) {
             return next(new ErrorResponse("Accès refusé. Rôle non défini après authentification.", 403));
        }

        // 2. Vérifier si le rôle de l'utilisateur est inclus dans la liste des rôles autorisés
        if (!roles.includes(userRole)) {
            // Renvoie une erreur si l'utilisateur n'a pas l'un des rôles requis.
            // Le message cache le rôle exact requis pour des raisons de sécurité.
            return next(new ErrorResponse(`Rôle utilisateur (${userRole}) non autorisé à accéder à cette ressource.`, 403));
        }

        // 3. Le rôle est valide, passer à la fonction suivante (le contrôleur)
>>>>>>> b13ebdf (add crud menu)
        next();
    };
};
