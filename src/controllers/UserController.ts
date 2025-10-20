import {Request, Response, NextFunction} from 'express';
import UserModel from '../models/UserModels';
import {ErrorResponse} from '../utils/ErrorResponse';
import * as bcrypt from 'bcryptjs';
import logger from '../utils/logger';
import {dbGet, dbRun} from "../database/SQLiteConnection";

/**
 * @desc    Créer un nouvel utilisateur par un Administrateur (CRUD Create).
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
export const createUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstname, lastname, email, password, roleUser } = req.body;

        // 1. Validation (via the UserModel's internal validation, but ensure password exists)
        if (!password) {
             return next(new ErrorResponse("Le mot de passe est requis pour la création par l'admin.", 400));
        }

        // 2. Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insertion SQL directe (bypassing the UserModel.create which expects verification tokens)
        const sql = `
            INSERT INTO User (firstname, lastname, email, password, roleUser, isActive)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [
            firstname,
            lastname,
            email,
            hashedPassword,
            roleUser || 'employee',
            1, // isActive: true (1) car créé par l'admin
        ];

        const resDb = await dbRun(sql, params);

        // 4. Récupérer l'utilisateur créé pour la réponse
        const user = await UserModel.findById(resDb.lastID!);
        if (!user) throw new ErrorResponse("Erreur lors de la création de l'utilisateur.", 500);

        // 5. Retourner l'utilisateur public
        const { password: userPassword, resetPasswordToken, verificationToken, ...userPublic } = user;

        // Le client doit être informé du mot de passe initial (doit être fait via un système sécurisé, ici on simule)
        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès par l'Admin. Compte actif.",
            data: userPublic
        });

    } catch (error: any) {
        logger.error(`Erreur lors de la création admin: ${error.message}`, error);
         if (error.message.includes('UNIQUE constraint failed: User.email')) {
            return next(new ErrorResponse("Cet email est déjà utilisé.", 409));
        }
        next(error);
    }
};
/**
 * @desc    Lire tous les utilisateurs (Read All).
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.findAll();
        res.status(200).json({success: true, count: users.length, data: users});
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lire un seul utilisateur (Read One) ou rechercher (Search).
 * @route   GET /api/v1/users/:id ou /api/v1/users?search=...
 * @access  Private/Admin (pour le search/readOne d'un autre) ou Private/Self (pour son propre ID)
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const {search} = req.query;

        // 1. Recherche par critère (si présent)
        if (search && typeof search === 'string') {
            const users = await UserModel.search(search);
            return res.status(200).json({success: true, count: users.length, data: users});
        }

        // 2. Lecture par ID
        if (!id || isNaN(parseInt(id))) {
            return next(new ErrorResponse("ID d'utilisateur non valide.", 400));
        }

        const userId = parseInt(id);

        // Si l'utilisateur n'est pas un admin et demande l'ID de quelqu'un d'autre
        if (req.user!.roleUser !== 'admin' && req.user!.id !== userId) {
            return next(new ErrorResponse("Accès non autorisé pour voir les détails d'un autre utilisateur.", 403));
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return next(new ErrorResponse(`Utilisateur non trouvé avec l'id ${id}`, 404));
        }

        const {password, resetPasswordToken, verificationToken, ...userPublic} = user;
        res.status(200).json({success: true, data: userPublic});

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mettre à jour un utilisateur (Update).
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin ou Private/Self
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const userId = parseInt(id);
        const updateData = req.body;

        if (isNaN(userId)) {
            return next(new ErrorResponse("ID d'utilisateur non valide.", 400));
        }

        // Autoriser la mise à jour seulement à l'utilisateur lui-même OU à un admin
        if (req.user!.roleUser !== 'admin' && req.user!.id !== userId) {
            return next(new ErrorResponse("Accès non autorisé pour modifier cet utilisateur.", 403));
        }

        // Interdire la modification du rôle par un non-admin (même soi-même)
        if (updateData.roleUser && req.user!.roleUser !== 'admin') {
            return next(new ErrorResponse("Vous n'êtes pas autorisé à changer le rôle.", 403));
        }

        // Ne pas autoriser la modification du mot de passe ici (utiliser resetPassword)
        if (updateData.password) {
            delete updateData.password;
        }

        const userPublic = await UserModel.update(userId, updateData);

        res.status(200).json({success: true, data: userPublic});
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Supprimer un utilisateur (Delete).
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return next(new ErrorResponse("ID d'utilisateur non valide.", 400));
        }

        // Interdire la suppression de l'utilisateur par lui-même s'il n'est pas admin (logique de sécurité)
        if (req.user!.roleUser !== 'admin') {
            return next(new ErrorResponse("Seul un administrateur peut supprimer un compte.", 403));
        }

        await UserModel.delete(userId);

        res.status(200).json({success: true, data: {}});

    } catch (error) {
        next(error);
    }
};