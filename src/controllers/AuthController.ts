import {NextFunction, Request, Response} from "express";
<<<<<<< HEAD
import {generateAuthToken, generateVerificationOrResetToken, getExpiryDate} from "../token/tokenGenerator";
import UserModel from "../models/UserModels";
import {IUser} from "../types/IUser";
import {dbGet, dbRun} from "../database/SQLiteConnection";
import {ErrorResponse} from "../utils/ErrorResponse";
import * as bcrypt from "bcryptjs";
import logger from "../utils/logger";


// --- STUB : Simulation d'un service d'envoi d'email ---
const sendEmail = (email: string, subject: string, text: string) => {
    logger.info(`Email envoyé à ${email} - Subject: ${subject} - Corps: ${text}`);
    // Ici irait la vraie logique d'envoi d'email (ex: nodemailer)
};

// --- Fonctions d'aide pour le JWT ---
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
    const token = generateAuthToken(user.id!);

    // Ne pas exposer le mot de passe et les tokens privés
=======
import * as bcrypt from "bcryptjs";
import {IUser} from "../types/IUser";
import UserModels from "../models/UserModels";
import {dbGet, dbRun} from "../database/SQLiteConnection"; // Utilitaires pour les requêtes complexes de token (ex: resetPassword, verifyEmail)
import {generateAuthToken, generateVerificationOrResetToken, getExpiryDate} from "../token/tokenGenerator";
import {ErrorResponse} from "../utils/ErrorResponse";
import logger from "../utils/logger";


// --- Fonctions d'aide pour le JWT ---
const sendEmail = (email: string, subject: string, text: string) => {
    logger.info(`Email envoyé à ${email} - Subject: ${subject} - Corps: ${text}`);
};

const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
    const token = generateAuthToken(user.id!);
>>>>>>> b13ebdf (add crud menu)
    const {password, resetPasswordToken, verificationToken, ...userPublic} = user;

    res.status(statusCode).json({
        success: true,
        token,
        user: userPublic,
    });
};

<<<<<<< HEAD
=======

>>>>>>> b13ebdf (add crud menu)
/**
 * @desc    Créer un utilisateur (Register) et envoie un email de vérification.
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {firstname, lastname, email, password, roleUser} = req.body;

<<<<<<< HEAD
        // 1. Générer le token de vérification et l'expiration (1 heure)
        const verificationToken = generateVerificationOrResetToken();
        const verificationExpiresAt = getExpiryDate(60);

        // 2. Créer l'utilisateur (isActive: false par défaut)
        const userPublic = await UserModel.create({
=======
        // Préparation des tokens
        const verificationToken = generateVerificationOrResetToken();
        const verificationExpiresAt = getExpiryDate(60);

        // Appel au Modèle: Le Modèle se charge du hachage, de la validation et de l'insertion sécurisée.
        const userPublic = await UserModels.create({
>>>>>>> b13ebdf (add crud menu)
            firstname,
            lastname,
            email,
            password,
            roleUser,
<<<<<<< HEAD
            isActive: false, // Important : false par défaut
            verificationToken,
            verificationExpiresAt,
            resetPasswordToken: null,
            resetPasswordExpiresAt: null
        } as IUser, verificationToken, verificationExpiresAt);

        // 3. Envoyer l'email
        const verificationLink = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyemail/${verificationToken}`;
        const emailText = `Votre code de vérification est: ${verificationToken}. Cliquez ici pour vérifier: ${verificationLink}`;
        console.log(emailText.toString());
=======
        } as IUser, verificationToken, verificationExpiresAt);

        // Envoyer l'email
        const verificationLink = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyemail/${verificationToken}`;
        const emailText = `Votre code de vérification est: ${verificationToken}. Cliquez ici pour vérifier: ${verificationLink}`;
>>>>>>> b13ebdf (add crud menu)
        sendEmail(email, 'Vérification de compte', emailText);

        res.status(201).json({
            success: true,
            message: "Inscription réussie. Veuillez vérifier votre email pour activer votre compte. 📧",
            user: userPublic
        });

    } catch (error) {
<<<<<<< HEAD
=======
        // Le modèle gère déjà les erreurs 409 (Email existe) et 400 (Validation)
>>>>>>> b13ebdf (add crud menu)
        next(error);
    }
};

/**
 * @desc    Vérifie le compte utilisateur via le token reçu par email.
 * @route   GET /api/v1/auth/verifyemail/:token
 * @access  Public
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {token} = req.params;

<<<<<<< HEAD
        const user = await dbGet<IUser>(`
            SELECT *
            FROM User
            WHERE verificationToken = ?
              AND verificationExpiresAt > datetime('now')
        `, [token]);
=======
        // Requête préparée pour éviter l'injection SQL (directement dans le contrôleur car le modèle n'a pas de méthode findByToken)
        const user = await dbGet<IUser>(`SELECT * FROM Users WHERE verificationToken = ? AND verificationExpiresAt > datetime('now')`, [token]); // <-- Requête préparée sécurisée
>>>>>>> b13ebdf (add crud menu)

        if (!user) {
            return next(new ErrorResponse("Code de vérification invalide ou expiré.", 400));
        }

<<<<<<< HEAD
        // Mettre à jour l'utilisateur : isActive = true, clear tokens
        await UserModel.updateTokenFields(user.id!, {
            isActive: 1 as unknown as string, // SQLite stocke boolean comme 0/1
            verificationToken: null,
            verificationExpiresAt: null
        });

        // Simuler la récupération pour renvoyer la réponse
        const verifiedUser = await UserModel.findById(user.id!);
=======
        // Mise à jour via le Modèle (utilise requête préparée sécurisée)
        await UserModels.updateTokenFields(user.id!, {
            isActive: 1,
            verificationToken: null,
            verificationExpiresAt: null,
            updatedAt: new Date().toISOString()
        });

        // Récupérer l'utilisateur à jour
        const verifiedUser = await UserModels.findById(user.id!);
>>>>>>> b13ebdf (add crud menu)
        if (!verifiedUser) return next(new ErrorResponse("Utilisateur introuvable.", 404));

        sendTokenResponse(verifiedUser, 200, res);

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Connecter l'utilisateur (Login).
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return next(new ErrorResponse("Veuillez fournir un email et un mot de passe.", 400));
        }

<<<<<<< HEAD
        // 1. Vérifier l'utilisateur par email
        const user = await UserModel.findByEmail(email);
=======
        // 1. Vérifier l'utilisateur (méthode sécurisée)
        const user = await UserModels.findByEmail(email);
>>>>>>> b13ebdf (add crud menu)
        if (!user) {
            return next(new ErrorResponse("Identifiants invalides.", 401));
        }

        // 2. Vérifier si le compte est actif
        if (!user.isActive) {
            return next(new ErrorResponse("Compte non activé. Veuillez vérifier votre email.", 401));
        }

        // 3. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new ErrorResponse("Identifiants invalides.", 401));
        }

<<<<<<< HEAD
        // 4. Mettre à jour lastLogin et envoyer le token
        await UserModel.updateTokenFields(user.id!, {lastLogin: new Date()});
        user.lastLogin = new Date(); // Mettre à jour l'objet local pour la réponse
=======
        // 4. Mettre à jour lastLogin (méthode sécurisée)
        await UserModels.updateTokenFields(user.id!, {
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Mettre à jour l'objet local
        user.lastLogin = new Date().toISOString();
>>>>>>> b13ebdf (add crud menu)

        sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Déclencher la réinitialisation de mot de passe (envoie d'email).
 * @route   POST /api/v1/auth/forgotpassword
 * @access  Public
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email} = req.body;
<<<<<<< HEAD
        const user = await UserModel.findByEmail(email);

        if (!user) {
            // Envoyer un message générique même si l'utilisateur n'existe pas pour la sécurité
            return res.status(200).json({success: true, message: "Si l'utilisateur existe, un email a été envoyé."});
        }

        // 1. Générer le token de réinitialisation et l'expiration (1 heure)
        const resetToken = generateVerificationOrResetToken();
        const resetExpiresAt = getExpiryDate(60);

        // 2. Mettre à jour l'utilisateur
        await UserModel.updateTokenFields(user.id!, {
            resetPasswordToken: resetToken,
            resetPasswordExpiresAt: resetExpiresAt
        });

        // 3. Envoyer l'email
=======

        // 1. Chercher l'utilisateur par email (méthode sécurisée dans UserModel)
        const user = await UserModels.findByEmail(email);

        if (!user) {
            // Envoyer un message générique même si l'utilisateur n'existe pas, pour la sécurité
            return res.status(200).json({success: true, message: "Si l'utilisateur existe, un email a été envoyé."});
        }

        // 2. Générer le token de réinitialisation et l'expiration
        const resetToken = generateVerificationOrResetToken();
        const resetExpiresAt = getExpiryDate(60); // 60 minutes

        // 3. Mettre à jour l'utilisateur (méthode sécurisée dans UserModel)
        await UserModels.updateTokenFields(user.id!, {
            resetPasswordToken: resetToken,
            resetPasswordExpiresAt: resetExpiresAt,
            updatedAt: new Date().toISOString()
        });

        // 4. Envoyer l'email
>>>>>>> b13ebdf (add crud menu)
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
        const emailText = `Votre code de réinitialisation est: ${resetToken}. Lien de réinitialisation: ${resetURL}`;
        sendEmail(user.email, 'Réinitialisation de mot de passe', emailText);

        res.status(200).json({success: true, message: 'Email de réinitialisation envoyé.'});

    } catch (error) {
<<<<<<< HEAD
=======
        // En cas d'erreur de base de données ou de jeton, la fonction la passe au middleware d'erreur
>>>>>>> b13ebdf (add crud menu)
        next(error);
    }
};

/**
 * @desc    Réinitialiser le mot de passe avec le token.
 * @route   PUT /api/v1/auth/resetpassword/:token
 * @access  Public
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {token} = req.params;
        const {newPassword} = req.body;

<<<<<<< HEAD
        // 1. Valider le nouveau mot de passe (réutiliser la regex du modèle)
        if (!newPassword || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
            return next(new ErrorResponse("Le nouveau mot de passe est invalide (8 chars min, lettre et chiffre).", 400));
        }

        // 2. Chercher l'utilisateur par token et expiration
        const user = await dbGet<IUser>(`
            SELECT *
            FROM User
            WHERE resetPasswordToken = ?
              AND resetPasswordExpiresAt > datetime('now')
        `, [token]);
=======
        // Validation du mot de passe
        if (!newPassword || newPassword.length < 8) {
            return next(new ErrorResponse("Le nouveau mot de passe est invalide (8 chars min).", 400));
        }

        // Chercher l'utilisateur par token et expiration (Requête préparée sécurisée)
        const user = await dbGet<IUser>(`SELECT * FROM Users WHERE resetPasswordToken = ? AND resetPasswordExpiresAt > datetime('now')`, [token]);
>>>>>>> b13ebdf (add crud menu)

        if (!user) {
            return next(new ErrorResponse("Token de réinitialisation invalide ou expiré.", 400));
        }

<<<<<<< HEAD
        // 3. Hacher et mettre à jour le mot de passe, et effacer les tokens
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Mise à jour directe dans la DB pour simplifier (hors du Model.update pour la gestion du hachage)
        await dbRun(`
            UPDATE User
            SET password               = ?,
                resetPasswordToken     = NULL,
                resetPasswordExpiresAt = NULL,
                updatedAt              = ?
            WHERE id = ?
        `, [hashedPassword, new Date().toISOString(), user.id!]);

        // Simuler la récupération pour renvoyer la réponse et le token de connexion
        const updatedUser = await UserModel.findById(user.id!);
        if (!updatedUser) return next(new ErrorResponse("Utilisateur introuvable.", 404));

        sendTokenResponse(updatedUser, 200, res); // Connexion automatique
=======
        // Hacher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Mise à jour du mot de passe et effacement des tokens (méthode sécurisée)
        await UserModels.updateTokenFields(user.id!, {
            password: hashedPassword, // Le modèle peut gérer le hachage si on lui envoie 'newPassword', mais ici on gère le hachage avant l'appel.
            resetPasswordToken: null,
            resetPasswordExpiresAt: null,
            updatedAt: new Date().toISOString()
        });

        // Récupérer l'utilisateur mis à jour
        const updatedUser = await UserModels.findById(user.id!);
        if (!updatedUser) return next(new ErrorResponse("Utilisateur introuvable.", 404));

        sendTokenResponse(updatedUser, 200, res);
>>>>>>> b13ebdf (add crud menu)

    } catch (error) {
        next(error);
    }
};
<<<<<<< HEAD
=======

>>>>>>> b13ebdf (add crud menu)
/**
 * @desc    Déconnecter l'utilisateur (Logout).
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
<<<<<<< HEAD
        if (!req.user || !req.user.id) {
            // Should not happen if 'protect' middleware is used, but for safety
            return next(new ErrorResponse("Aucun utilisateur connecté.", 401));
        }

        // 1. Mettre à jour lastLogin dans la base de données
        // Le champ lastLogin est souvent mis à jour au login. Ici, on peut le mettre à jour
        // ou simplement s'assurer que l'objet utilisateur est retourné sans le token JWT.

        // Optionnel: Mettre à jour la date de dernière connexion si vous la considérez comme la date/heure de LOGOUT
        await UserModel.updateTokenFields(req.user.id, { lastLogin: new Date() });
        logger.info(`User ID ${req.user.id} logged out.`);

        // 2. Côté client: Le client est responsable de supprimer le token JWT
        // Si vous utilisiez des cookies HTTP-Only pour stocker le JWT:
        // res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });

        // 3. Envoyer la réponse de succès
        // En mode JWT, on renvoie simplement une réponse 200 sans token.
        res.status(200).json({
            success: true,
            data: {},
            message: "Déconnexion réussie. Le token doit être supprimé côté client. 👋"
=======
        const userId = (req as any).user?.id;

        if (!userId) {
            return next(new ErrorResponse("Non autorisé.", 401));
        }

        // Optionnel : Mettre à jour la date de dernière activité
        await UserModels.updateTokenFields(userId, {
            updatedAt: new Date().toISOString()
        });

        logger.info(`User ID ${userId} logged out.`);

        res.status(200).json({
            success: true,
            message: "Déconnexion réussie."
>>>>>>> b13ebdf (add crud menu)
        });

    } catch (error) {
        next(error);
    }
};