<<<<<<< HEAD
// /src/models/UserModel.ts

=======
>>>>>>> b13ebdf (add crud menu)
import { IUser, IUserPublic } from '../types/IUser';
import {dbRun, dbGet, dbAll} from "../database/SQLiteConnection";
import * as bcrypt from 'bcryptjs';
import { ErrorResponse } from '../utils/ErrorResponse';
import logger from '../utils/logger';

// Regex selon vos spécifications
const NAME_REGEX = /^.{2,}$/; // Au moins 2 lettres
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // 8 caractères minimum, au moins une lettre et un chiffre

/**
 * Valide les données utilisateur (hors password pour l'update).
 * @param user L'objet utilisateur à valider.
 * @param isUpdate Indique si c'est une opération de mise à jour.
 */
const validateUser = (user: Partial<IUser>, isUpdate: boolean = false) => {
    if (user.firstname && !NAME_REGEX.test(user.firstname)) {
        throw new ErrorResponse("Le prénom doit contenir au moins 2 lettres.", 400);
    }
    if (user.lastname && !NAME_REGEX.test(user.lastname)) {
        throw new ErrorResponse("Le nom doit contenir au moins 2 lettres.", 400);
    }
    // La validation du mot de passe est requise uniquement pour la création
    if (!isUpdate && user.password && !PASSWORD_REGEX.test(user.password)) {
        throw new ErrorResponse("Le mot de passe doit avoir 8 caractères min, incluant au moins une lettre et un chiffre.", 400);
    }
    // Validation du format d'email simple
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        throw new ErrorResponse("Le format de l'email est invalide.", 400);
    }
};

class UserModel {
    /**
     * Enregistre un nouvel utilisateur (register).
     * @param userData Les données de l'utilisateur.
     * @param token Le jeton de vérification.
     * @param expiresAt L'expiration du jeton.
     * @returns L'utilisateur enregistré (sans le mot de passe).
     */
    async create(userData: IUser, token: string, expiresAt: Date): Promise<IUserPublic> {
        validateUser(userData);

        try {
            // Hachage du mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

           const sql = `
<<<<<<< HEAD
                INSERT INTO User (firstname, lastname, email, password, roleUser, isActive, verificationToken, verificationExpiresAt)
=======
                INSERT INTO Users (firstname, lastname, email, password, roleUser, isActive, verificationToken, verificationExpiresAt)
>>>>>>> b13ebdf (add crud menu)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                userData.firstname,
                userData.lastname,
                userData.email,
                hashedPassword,
                userData.roleUser || 'employee',
                0,
<<<<<<< HEAD
                token, // <-- USE RENAMED PARAMETER 'token' here
=======
                token,
>>>>>>> b13ebdf (add crud menu)
                expiresAt.toISOString(),
            ];

            const res = await dbRun(sql, params);
            const user = await this.findById(res.lastID!);
            if (!user) throw new ErrorResponse("Erreur lors de la création de l'utilisateur.", 500);

            // Destructuring the user object: extract the *database fields*
            const { password, resetPasswordToken, verificationToken, ...userPublic } = user;
            // Note: verificationToken here is the database field, which is fine as it's a new scope.

            return userPublic as IUserPublic;

        } catch (error: any) {
            logger.error(`Erreur lors de la création de l'utilisateur: ${error.message}`, error);
            if (error.message.includes('UNIQUE constraint failed: User.email')) {
                throw new ErrorResponse("Cet email est déjà utilisé.", 409);
            }
            throw error instanceof ErrorResponse ? error : new ErrorResponse("Échec de l'enregistrement.", 500);
        }
    }

    /**
     * Trouve un utilisateur par son ID.
     */
    async findById(id: number): Promise<IUser | undefined> {
<<<<<<< HEAD
        const sql = 'SELECT * FROM User WHERE id = ?';
=======
        const sql = 'SELECT * FROM Users WHERE id = ?';
>>>>>>> b13ebdf (add crud menu)
        return dbGet<IUser>(sql, [id]);
    }

    /**
     * Trouve un utilisateur par email.
     */
    async findByEmail(email: string): Promise<IUser | undefined> {
<<<<<<< HEAD
        const sql = 'SELECT * FROM User WHERE email = ?';
=======
        const sql = 'SELECT * FROM Users WHERE email = ?';
>>>>>>> b13ebdf (add crud menu)
        return dbGet<IUser>(sql, [email]);
    }

    /**
     * Met à jour les champs de réinitialisation/vérification.
     */
    async updateTokenFields(id: number, fields: { [key: string]: string | Date | null | number | boolean }): Promise<void> {
        const setClauses: string[] = [];
        // Define params to include all possible types, including number and boolean (for 0/1)
        const params: (string | Date | null | number | boolean)[] = [];

        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                setClauses.push(`${key} = ?`);
                params.push(fields[key] instanceof Date ? fields[key].toISOString() : fields[key]);
            }
        }

        if (setClauses.length === 0) return;

<<<<<<< HEAD
        const sql = `UPDATE User SET ${setClauses.join(', ')} WHERE id = ?`;
=======
        const sql = `UPDATE Users SET ${setClauses.join(', ')} WHERE id = ?`;
>>>>>>> b13ebdf (add crud menu)
        // Now, pushing 'id' (number) is allowed
        params.push(id);

        await dbRun(sql, params);
    }

    /**
     * Lit tous les utilisateurs (pour les admins/démo).
     */
    async findAll(): Promise<IUserPublic[]> {
<<<<<<< HEAD
        const sql = 'SELECT id, firstname, lastname, email, roleUser, isActive, lastLogin, createdAt, updatedAt FROM User';
=======
        const sql = 'SELECT id, firstname, lastname, email, roleUser, isActive, lastLogin, createdAt, updatedAt FROM Users';
>>>>>>> b13ebdf (add crud menu)
        return dbAll<IUserPublic>(sql);
    }

    /**
     * Recherche un utilisateur par n'importe quel attribut (simplifié).
     * @param query La valeur à rechercher.
     * @returns Liste d'utilisateurs publics.
     */
    async search(query: string): Promise<IUserPublic[]> {
        const sql = `
            SELECT id, firstname, lastname, email, roleUser, isActive, lastLogin, createdAt, updatedAt
<<<<<<< HEAD
            FROM User
=======
            FROM Users
>>>>>>> b13ebdf (add crud menu)
            WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ?
        `;
        const searchParam = `%${query}%`;
        return dbAll<IUserPublic>(sql, [searchParam, searchParam, searchParam]);
    }

    /**
     * Met à jour un utilisateur.
     */
    async update(id: number, updateData: Partial<Omit<IUser, 'id' | 'createdAt' | 'password'>>): Promise<IUserPublic> {
        validateUser(updateData, true); // Validation des champs existants

        const setClauses: string[] = [];
        const params: (string | number | Date | null | boolean)[] = []; // Type definition is correct here

        const allowedFields = ['firstname', 'lastname', 'email', 'roleUser', 'isActive', 'lastLogin'];

        for (const key of allowedFields) {
            if (updateData.hasOwnProperty(key)) {
                setClauses.push(`${key} = ?`);
                const value = updateData[key as keyof typeof updateData];

                // ✅ FIX: Explicitly check that 'value' is not undefined before pushing
                if (value !== undefined) {
                    // Conversion de boolean en 0/1 pour SQLite
                    params.push(typeof value === 'boolean' ? (value ? 1 : 0) : value); // Line 162 fix
                }
            }
        }

        if (setClauses.length === 0) {
            throw new ErrorResponse("Aucun champ valide à mettre à jour fourni.", 400);
        }

        setClauses.push('updatedAt = ?');
        params.push(new Date().toISOString());

        const sql = `UPDATE User SET ${setClauses.join(', ')} WHERE id = ?`;
        params.push(id);

        try {
            await dbRun(sql, params);

            const updatedUser = await this.findById(id);
            if (!updatedUser) throw new ErrorResponse("Utilisateur non trouvé après mise à jour.", 404);

            const { password, resetPasswordToken, verificationToken, ...userPublic } = updatedUser;
            return userPublic as IUserPublic;

        } catch (error: any) {
            if (error.message.includes('UNIQUE constraint failed: User.email')) {
                throw new ErrorResponse("Cet email est déjà utilisé par un autre utilisateur.", 409);
            }
            throw error instanceof ErrorResponse ? error : new ErrorResponse("Échec de la mise à jour.", 500);
        }
    }

    /**
     * Supprime un utilisateur par ID.
     */
    async delete(id: number): Promise<void> {
<<<<<<< HEAD
        const sql = 'DELETE FROM User WHERE id = ?';
=======
        const sql = 'DELETE FROM Users WHERE id = ?';
>>>>>>> b13ebdf (add crud menu)
        const res = await dbRun(sql, [id]);
        if (res.changes === 0) {
            throw new ErrorResponse(`Utilisateur avec ID ${id} non trouvé.`, 404);
        }
    }
}

export default new UserModel();