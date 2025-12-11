import db, { dbRun, dbGet, dbAll } from "../database/SQLiteConnection";
import { IMenu } from "../types/IMenu";
import { RunResult } from "sqlite3";
import { Database } from "sqlite3"; // Import nécessaire pour le type

// Interface pour les données brutes retournées par la jointure
interface IMenuIngredientJoin {
    id: number;
    nom: string;
    prixNormal: number;
    prixPromo: number | null;
    updateAt: string | null;
    dateCreated: string;

    // Champs de la table Ingredient/MenuIngredient
    ingredient_id: number | null;
    ingredient_nom: string | null;
    quantite_requise: number | null;
    unite_requise: string | null;
}

// Interface finale pour un Menu agrégé
interface IMenuDetail extends IMenu {
    ingredients: {
        id: number;
        nom: string;
        quantite_requise: number;
        unite_requise: string;
    }[];
}


class MenuModel {
    /**
     * @desc Fournit l'accès à l'instance de base de données SQLite.
     * C'est essentiel pour le contrôleur afin d'exécuter les transactions (BEGIN/COMMIT/ROLLBACK).
     */
    public static getDb(): Database {
        return db; // 'db' est l'export par défaut de SQLiteConnection
    }

    // --------------------------------------------------------

    // Récupérer un menu par ID (version simple sans jointure, conservée pour le CRUD de base)
    public static async findById(id: number): Promise<IMenu | undefined> {
        const sql = 'SELECT * FROM Menu WHERE id = ?';
        return dbGet<IMenu>(sql, [id]);
    }

    // Supprimer un menu
    public static async delete(id: number): Promise<RunResult> {
        const sql = 'DELETE FROM Menu WHERE id = ?';
        return dbRun(sql, [id]);
    }
}

export default MenuModel;