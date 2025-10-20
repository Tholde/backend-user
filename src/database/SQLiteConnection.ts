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
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

// Fonction utilitaire pour obtenir une seule ligne
export const dbGet = <T>(sql: string, params: any[] = []): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row as T);
            }
        });
    });
};

// Fonction utilitaire pour obtenir toutes les lignes
export const dbAll = <T>(sql: string, params: any[] = []): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows as T[]);
            }
        });
    });
};

export default db;