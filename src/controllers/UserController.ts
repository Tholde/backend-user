<<<<<<< HEAD
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
=======
import {NextFunction, Request, Response} from "express";
import UserModels from "../models/UserModels";
import {IUser, IUserPublic} from "../types/IUser";
import {ErrorResponse} from "../utils/ErrorResponse";
import * as bcrypt from "bcryptjs";
import {getExpiryDate} from "../token/tokenGenerator";


/**
 * @desc    Créer un utilisateur manuellement (par l'Admin/Manager).
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstname, lastname, email, password, roleUser, isActive } = req.body;

        // 1. Vérification des champs de base
        if (!firstname || !lastname || !email || !password) {
            return next(new ErrorResponse("Les champs firstname, lastname, email et password sont obligatoires.", 400));
        }

        // 2. Vérification d'autorisation (simulée ici, le middleware fera le gros du travail)
        const userRole = (req as any).user?.role;
        if (userRole !== 'admin' && userRole !== 'manager') {
             return next(new ErrorResponse("Accès refusé. Seuls les administrateurs et managers peuvent créer des utilisateurs.", 403));
        }

        // 3. Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Préparation des tokens
        const verificationToken = 'via admin';
        const verificationExpiresAt = getExpiryDate(80);
        // 4. Création de l'utilisateur
        // La fonction create est adaptée pour l'admin (pas besoin de token d'email ici)
        const newUserPublic = await UserModels.create({
            firstname,
            lastname,
            email,
            password: hashedPassword, // Mot de passe haché
            roleUser: roleUser || 'employee', // Définir un rôle par défaut si non spécifié
            isActive: isActive !== undefined ? isActive : 1, // Actif par défaut si non spécifié
        } as IUser, verificationToken, verificationExpiresAt);

        res.status(201).json({
            success: true,
            data: newUserPublic,
            message: "Utilisateur créé avec succès par l'administrateur."
        });

    } catch (error) {
        // Gère les erreurs de validation ou de conflit (email déjà utilisé) via le UserModel
        next(error);
    }
};

/**
 * Récupère l'ID de l'utilisateur à partir de l'objet Request.
 * @param req L'objet Request Express.
 * @returns L'ID de l'utilisateur (number).
 */
const getUserIdFromRequest = (req: Request): number | undefined => {
    // Supposons qu'un middleware 'protect' attache l'utilisateur à l'objet req.
    return (req as any).user?.id;
};

/**
 * @desc    Obtenir tous les utilisateurs (Admin/Manager seulement).
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // findAll utilise la requête préparée sécurisée dans UserModel
        const users = await UserModels.findAll();
        res.status(200).json({ success: true, count: users.length, data: users });
>>>>>>> b13ebdf (add crud menu)
    } catch (error) {
        next(error);
    }
};

/**
<<<<<<< HEAD
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
=======
 * @desc    Obtenir un utilisateur par son ID.
 * @route   GET /api/v1/users/:id
 * @access  Private (Self or Admin)
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return next(new ErrorResponse("ID utilisateur invalide.", 400));
        }

        // findById est sécurisé
        const user = await UserModels.findById(userId);

        if (!user) {
            return next(new ErrorResponse(`Utilisateur non trouvé avec l'ID ${userId}`, 404));
        }

        // Sécurité: retirer les champs privés avant l'envoi, même si findById renvoie IUser (avec password)
        const { password, resetPasswordToken, verificationToken, ...userPublic } = user;

        res.status(200).json({ success: true, data: userPublic });
>>>>>>> b13ebdf (add crud menu)
    } catch (error) {
        next(error);
    }
};

/**
<<<<<<< HEAD
 * @desc    Supprimer un utilisateur (Delete).
=======
 * @desc    Mettre à jour les détails de l'utilisateur connecté (Mon Compte).
 * @route   PUT /api/v1/users/me
 * @access  Private
 */
export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) {
             return next(new ErrorResponse("Non autorisé.", 401));
        }

        // Champs modifiables directement (password est géré dans updatePassword)
        const { firstname, lastname, email, roleUser, isActive } = req.body;

        const fieldsToUpdate: Partial<Omit<IUser, 'id' | 'createdAt' | 'password'>> = {
            firstname,
            lastname,
            email,
            roleUser,
            isActive // Permettre à l'admin de modifier l'état/rôle si nécessaire
        };

        // Nettoyer l'objet (la validation est faite dans UserModel)
        Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key as keyof typeof fieldsToUpdate] === undefined && delete fieldsToUpdate[key as keyof typeof fieldsToUpdate]);

        // Mise à jour via le Modèle (méthode sécurisée)
        const updatedUserPublic = await UserModels.update(userId, fieldsToUpdate);

        res.status(200).json({ success: true, data: updatedUserPublic });
    } catch (error) {
        // Le modèle gère déjà les erreurs 409 (Email existe) et 400 (Validation)
        next(error);
    }
};

/**
 * @desc    Mettre à jour le mot de passe de l'utilisateur connecté.
 * @route   PUT /api/v1/users/updatepassword
 * @access  Private
 */
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) {
             return next(new ErrorResponse("Non autorisé.", 401));
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return next(new ErrorResponse("Veuillez fournir l'ancien et le nouveau mot de passe.", 400));
        }

        // 1. Récupérer l'utilisateur AVEC le mot de passe haché
        const userWithPassword = await UserModels.findById(userId);
        if (!userWithPassword) {
            return next(new ErrorResponse("Erreur de session.", 404));
        }

        // 2. Vérifier l'ancien mot de passe
        const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
        if (!isMatch) {
            return next(new ErrorResponse("Mot de passe actuel incorrect.", 401));
        }

        // 3. Hacher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Mettre à jour (méthode sécurisée)
        await UserModels.updateTokenFields(userId, {
            password: hashedPassword,
            updatedAt: new Date().toISOString()
        });

        res.status(200).json({ success: true, message: "Mot de passe mis à jour avec succès." });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Supprimer un utilisateur (Admin seulement).
>>>>>>> b13ebdf (add crud menu)
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
<<<<<<< HEAD
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

=======
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return next(new ErrorResponse("ID utilisateur invalide.", 400));
        }

        // La méthode delete est sécurisée et gère le 404
        await UserModels.delete(userId);

        res.status(204).send();
>>>>>>> b13ebdf (add crud menu)
    } catch (error) {
        next(error);
    }
};