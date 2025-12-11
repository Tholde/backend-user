<<<<<<< HEAD
// /src/database/db.ts

import * as sqlite3 from 'sqlite3';
import { IUser } from '../types/IUser';
import logger from '../utils/logger';

const db = new sqlite3.Database('./src/database/database.db', (err) => {
    if (err) {
        logger.error('Error connecting to database', err);
        throw err;
    }
    logger.info('Connected to the SQLite database.');
});

// Fonction pour créer la table User
const createTables = () => {
    const createUserTable = `
        CREATE TABLE IF NOT EXISTS User (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            roleUser TEXT DEFAULT 'employee',
            isActive INTEGER DEFAULT 0, -- 0 for false, 1 for true
            resetPasswordToken TEXT,
            resetPasswordExpiresAt DATETIME,
            verificationToken TEXT,
            verificationExpiresAt DATETIME,
            lastLogin DATETIME,
            createdAt TEXT NOT NULL DEFAULT (datetime('now')),
            updatedAt DATETIME
        );
    `;

    db.run(createUserTable, (err) => {
        if (err) {
            logger.error('Error creating User table', err);
        } else {
            logger.info('User table created or already exists.');
        }
    });
};

createTables();

// Fonction utilitaire pour exécuter des requêtes (promisify)
export const dbRun = (sql: string, params: any[] = []): Promise<sqlite3.RunResult> => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
=======
// import * as sqlite3 from 'sqlite3';
// import { IUser } from '../types/IUser';
// import logger from '../utils/logger';
//
// const db = new sqlite3.Database('./src/database/database.db', (err) => {
//     if (err) {
//         logger.error('Error connecting to database', err);
//         throw err;
//     }
//     logger.info('Connected to the SQLite database.');
// });
//
// // Fonction pour créer la table User
// const createTables = () => {
//     const createUserTable = `
//         CREATE TABLE IF NOT EXISTS User (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             firstname TEXT NOT NULL,
//             lastname TEXT NOT NULL,
//             email TEXT NOT NULL UNIQUE,
//             password TEXT NOT NULL,
//             roleUser TEXT DEFAULT 'employee',
//             isActive INTEGER DEFAULT 0, -- 0 for false, 1 for true
//             resetPasswordToken TEXT,
//             resetPasswordExpiresAt DATETIME,
//             verificationToken TEXT,
//             verificationExpiresAt DATETIME,
//             lastLogin DATETIME,
//             createdAt TEXT NOT NULL DEFAULT (datetime('now')),
//             updatedAt DATETIME
//         );
//     `;
//
//     db.run(createUserTable, (err) => {
//         if (err) {
//             logger.error('Error creating User table', err);
//         } else {
//             logger.info('User table created or already exists.');
//         }
//     });
// };
//
// createTables();
//
// // Fonction utilitaire pour exécuter des requêtes (promisify)
// export const dbRun = (sql: string, params: any[] = []): Promise<sqlite3.RunResult> => {
//     return new Promise((resolve, reject) => {
//         db.run(sql, params, function (err) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(this);
//             }
//         });
//     });
// };
//
// // Fonction utilitaire pour obtenir une seule ligne
// export const dbGet = <T>(sql: string, params: any[] = []): Promise<T | undefined> => {
//     return new Promise((resolve, reject) => {
//         db.get(sql, params, (err, row) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(row as T);
//             }
//         });
//     });
// };
//
// // Fonction utilitaire pour obtenir toutes les lignes
// export const dbAll = <T>(sql: string, params: any[] = []): Promise<T[]> => {
//     return new Promise((resolve, reject) => {
//         db.all(sql, params, (err, rows) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(rows as T[]);
//             }
//         });
//     });
// };
//
// export default db;

import * as sqlite3 from "sqlite3";
import { Database, RunResult } from "sqlite3";

const DB_PATH = './data.db';

class SQLiteConnection{
    private db: Database;
    constructor() {
        this.db = new sqlite3.Database(DB_PATH, (err)=>{
            if (err){
                // Utilisez console.error si logger n'est pas encore importé/configuré
                console.error('Erreur lors de la connexion à la base de données SQLite:', err.message);
                throw err;
            }else {
                console.log('Connexion à la base de données SQLite reussie.');
                this.initializeDatabase();
            }
        })
    }
    private initializeDatabase(){
        const createTableQueries = [
            // 1. Table Users (Pas d'erreur, mais renommée par convention)
            `CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                roleUser TEXT DEFAULT 'employee',
                isActive INTEGER DEFAULT 0, -- 0 for false, 1 for true
                resetPasswordToken TEXT,
                resetPasswordExpiresAt DATETIME,
                verificationToken TEXT,
                verificationExpiresAt DATETIME,
                lastLogin TEXT,
                createdAt TEXT NOT NULL DEFAULT (datetime('now')),
                updatedAt TEXT
            );`,

            // 2. Table Client (Correction: 'status TEXT NOT DEFAULT' -> 'status TEXT DEFAULT 'actif'', suppression de la virgule finale)
            `CREATE TABLE IF NOT EXISTS Client(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                address TEXT NOT NULL,
                tel TEXT NOT NULL,
                status TEXT DEFAULT 'actif', -- Correction de la syntaxe
                updateAt TEXT,
                dateCreated TEXT NOT NULL DEFAULT (datetime('now'))
             );`,

            // 3. Table Menu (Correction: suppression de la virgule finale)
            `CREATE TABLE IF NOT EXISTS Menu(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                prixNormal REAL NOT NULL,
                prixPromo REAL,
                updateAt TEXT,
                dateCreated TEXT NOT NULL DEFAULT (datetime('now'))
             );`,
            // 4. Table Ingredient (Mise à jour: retrait de quantite et unite)
            `CREATE TABLE IF NOT EXISTS Ingredient(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL UNIQUE,
                updateAt TEXT,
                dateCreated TEXT NOT NULL DEFAULT (datetime('now'))
             );`,
             // 5. Nouvelle table de jointure pour la relation Many-to-Many
             `CREATE TABLE IF NOT EXISTS MenuIngredient(
                menuId INTEGER NOT NULL,
                ingredientId INTEGER NOT NULL,
                quantite REAL NOT NULL,
                unite TEXT NOT NULL,
                PRIMARY KEY (menuId, ingredientId),
                FOREIGN KEY (menuId) REFERENCES Menu(id) ON DELETE CASCADE,
                FOREIGN KEY (ingredientId) REFERENCES Ingredient(id) ON DELETE CASCADE
             );`,
            // 5. Table Depense (Correction: suppression de la virgule finale)
            `CREATE TABLE IF NOT EXISTS Depense(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                motif TEXT NOT NULL,
                quantite REAL NOT NULL,
                unite TEXT NOT NULL,
                valeur REAL NOT NULL,
                typeDep TEXT NOT NULL,
                updateAt TEXT,
                dateCreated TEXT NOT NULL DEFAULT (datetime('now'))
             );`,

            // 6. Table Stock (Correction: suppression de la virgule finale)
            `CREATE TABLE IF NOT EXISTS Stock(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_admin INTEGER,
                id_gestionnaire INTEGER NOT NULL,
                nom TEXT NOT NULL,
                quatite REAL NOT NULL,
                unite TEXT NOT NULL,
                prix_unit REAL NOT NULL,
                updateAt TEXT,
                dateCreated TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (id_admin) REFERENCES Users(id),
                FOREIGN KEY (id_gestionnaire) REFERENCES Users(id) 
             );`,

            // 7. Table Salaire (Correction: suppression de la virgule finale)
            `CREATE TABLE IF NOT EXISTS Salaire(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_user INTEGER NOT NULL,
                montant REAL NOT NULL,
                updateAt TEXT,
                FOREIGN KEY (id_user) REFERENCES Users(id)
             );`,

            // 8. Table Offre (Correction: suppression de la virgule finale)
            `CREATE TABLE IF NOT EXISTS Offre(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                quantite REAL NOT NULL,
                updateAt TEXT,
                dateCreated TEXT NOT NULL DEFAULT (datetime('now'))
             );`,

            // 9. Table Livraison (Correction: suppression de la virgule finale)
            `CREATE TABLE IF NOT EXISTS Livraison(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_client INTEGER NOT NULL,
                frais REAL NOT NULL,
                updateAt TEXT,
                dateCreated TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (id_client) REFERENCES Client(id)
             );`,

            // 10. Table Facture (Correction: suppression de la virgule finale)
            `CREATE TABLE IF NOT EXISTS Facture(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                numero_fac TEXT UNIQUE NOT NULL,
                id_client INTEGER NOT NULL,
                id_menu INTEGER NOT NULL,
                id_user INTEGER NOT NULL,
                prix_menu REAL NOT NULL,
                quantite REAL NOT NULL,
                prix_total REAL NOT NULL,
                updateAt TEXT,
                dateCreated TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (id_client) REFERENCES Client(id),
                FOREIGN KEY (id_menu) REFERENCES Menu(id),
                FOREIGN KEY (id_user) REFERENCES Users(id)
             );`,

            // 11. Table Rapport (Correction: suppression de la virgule finale)
            `CREATE TABLE IF NOT EXISTS Rapport(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date_depense TEXT,
                depense REAL,
                benefice REAL,
                impot REAL,
                updateAt TEXT,
                dateCreated TEXT NOT NULL DEFAULT (datetime('now'))
             );`
        ];
        this.db.serialize(() => {
            // Activer les clés étrangères (important pour les contraintes de relation)
            this.db.run("PRAGMA foreign_keys = ON;");
            createTableQueries.forEach(sql => {
                this.db.run(sql, (err) =>{
                    if(err){
                        console.error('Erreur lors de la creation de table:', err.message, '\nSQL:', sql);
                    }
                });
            });
            console.log('Initialisation de toutes les tables terminee.');
        });
    }
    public getDb(): Database {
        return this.db;
    }
}
const dbInstance = new SQLiteConnection();

// --- Fonctions utilitaires Promisifiées (pour réutilisation) ---
// Les fonctions dbRun, dbGet, dbAll restent les mêmes

// Fonction utilitaire pour db.run (INSERT, UPDATE, DELETE)
export const dbRun = (sql: string, params: any[] = []): Promise<RunResult> => {
    return new Promise((resolve, reject) => {
        dbInstance.getDb().run(sql, params, function (this: RunResult, err) {
>>>>>>> b13ebdf (add crud menu)
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

<<<<<<< HEAD
// Fonction utilitaire pour obtenir une seule ligne
export const dbGet = <T>(sql: string, params: any[] = []): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
=======
// Fonction utilitaire pour db.get (SELECT single)
export const dbGet = <T>(sql: string, params: any[] = []): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
        // T utilise l'interface IUser ou autre type
        dbInstance.getDb().get(sql, params, (err: Error | null, row: any) => {
            if (err) {
                reject(err);
            } else {
                // Le cast vers T est nécessaire ici pour le type checking
>>>>>>> b13ebdf (add crud menu)
                resolve(row as T);
            }
        });
    });
};

<<<<<<< HEAD
// Fonction utilitaire pour obtenir toutes les lignes
export const dbAll = <T>(sql: string, params: any[] = []): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
=======
// Fonction utilitaire pour db.all (SELECT multiple)
export const dbAll = <T>(sql: string, params: any[] = []): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        dbInstance.getDb().all(sql, params, (err: Error | null, rows: any[]) => {
            if (err) {
                reject(err);
            } else {
                // Le cast vers T[] est nécessaire ici pour le type checking
>>>>>>> b13ebdf (add crud menu)
                resolve(rows as T[]);
            }
        });
    });
};

<<<<<<< HEAD
export default db;
=======
export default dbInstance.getDb(); //
>>>>>>> b13ebdf (add crud menu)
