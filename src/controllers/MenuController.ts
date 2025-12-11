import {Database} from "sqlite3";
import {IIngredient, IIngredientRecette} from "../types/IIngredient"
import db, {dbAll, dbGet, dbRun} from "../database/SQLiteConnection";
import {IMenu, IMenuCreation, IMenuWithIngredients} from "../types/IMenu";
import {response} from "express";

/**
 * Insere un ingredient dans la table ingredient s'il n'existe pas deja.
 * Retourne l'ID de l"ingredient existant ou nouvelle cree.
 * @param ingredientName le nom de l'ingredient.
 * @param transactionDb l'instance de la base de donnees por la transaction.
 * @returns L'ID de l'ingredient.
 */
const getOrCreateIngredientId = async (
    ingredientName: string,
    transactionDb: Database
): Promise<number> => {
    // Chercher l'ingredient existant
    const selectSql = `SELECT id
                       FROM Ingredient
                       WHERE nom = ?`;
    const existingIngredient = await new Promise<IIngredient | undefined>((resolve, reject) => {
        transactionDb.get(selectSql, [ingredientName], (err, row: any) => {
            if (err) reject(err);
            resolve(row as IIngredient);
        });
    });
    if (existingIngredient) {
        return existingIngredient.id;
    }
    const insertSql = `INSERT INTO Ingredient(nom, dateCreated)
                       VALUES (?, datetime('now'))`;
    const insertResult = await new Promise<number>((resolve, reject) => {
        transactionDb.run(insertSql, [ingredientName], function (this: any, err) {
            if (err) reject(err);
            resolve(this.lastID);
        });
    });
    return insertResult;
};

// Fonction Promisifiee pour db.run dans une transaction
const dbRunTransaction = (
    sql: string,
    params: any[] = [],
    transactionDb: Database
): Promise<number> => {
    return new Promise((resolve, reject) => {
        transactionDb.run(sql, params, function (this: any, err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID || this.changes);
            }
        });
    });
};

export class MenuController {
    /**
     * Cree un nouveau Menu et lie ses Ingredients dans ne transaction.
     * @param menuData les donnees du menu et des ingredients.
     * @returns Le menu cree avec son ID.
     */
    public static async createMenu(menuData: IMenuCreation): Promise<IMenuWithIngredients> {
        let menuId: number;
        const transactionDb = db;
        try {
            // Debut de la transaction
            await dbRun('BEGIN TRANSACTION');
            // Creer le Menu
            const menuSql = `INSERT INTO Menu (nom, prixNormal, prixPromo, dateCreated)
                             VALUES (?, ?, ?, datetime('now'))`;
            const paramsMenu = [
                menuData.nom,
                menuData.prixNormal,
                menuData.prixPromo || null
            ];
            const menuRunResult = await dbRunTransaction(menuSql, paramsMenu, transactionDb);
            menuId = menuRunResult;
            const savedIngredients: IIngredientRecette[] = [];
            // 2. Triter les ingredients et creer les liens dans MenuIngredient
            for (const item of menuData.ingredients) {
                const ingredientId = await getOrCreateIngredientId(item.nom, transactionDb);
                const menuIngredientSql = `INSERT INTO MenuIngredient (menuId, ingredientId, quantite, unite)
                                           VALUES (?, ?, ?, ?)`;
                const paramsMenuIngredient = [
                    menuId,
                    ingredientId,
                    item.quantite,
                    item.unite
                ];
                await dbRunTransaction(menuIngredientSql, paramsMenuIngredient, transactionDb);
                // Preparer la reponse
                savedIngredients.push({
                    id: ingredientId,
                    nom: item.nom,
                    quantite: item.quantite,
                    unite: item.unite
                });
            }
            // Validation finale et Commit
            await dbRun('COMMIT');
            // 3. Retourner le Menu cree
            const newMenu: IMenu = await dbGet<IMenu>('SELECT * FROM MENU WHERE id = ?', [menuId]) as IMenu;
            return {
                ...newMenu,
                ingredients: savedIngredients
            };
        } catch (error) {
            // Annulaer la transaction en cas d'erreur
            await dbRun('ROLLBACK');
            console.error('Erreur lors de la creation du Menu avec ingredients:', error);
            throw new Error(`Echec de la creation du Menu: ${(error as Error).message}`);
        }
    }

    // [READ ALL] Récupère tous les menus avec leurs ingrédients.
    public static async getAllMenus(): Promise<IMenuWithIngredients[]> {
        // ... (code inchangé)
        const menus: IMenu[] = await dbAll<IMenu>('SELECT * FROM Menu ORDER BY dateCreated DESC');

        const menusAvecIngredients: IMenuWithIngredients[] = [];

        for (const menu of menus) {
            const ingredientsSql = `
                SELECT I.id,
                       I.nom,
                       MI.quantite,
                       MI.unite
                FROM MenuIngredient MI
                         JOIN Ingredient I ON MI.ingredientId = I.id
                WHERE MI.menuId = ?
            `;
            const ingredients = await dbAll<IIngredientRecette>(ingredientsSql, [menu.id]);
            menusAvecIngredients.push({
                ...menu,
                ingredients: ingredients
            });
        }

        return menusAvecIngredients;
    }

    // [READ ONE] Récupère un seul menu par son ID avec ses ingrédients.
    public static async getMenuById(id: number): Promise<IMenuWithIngredients | undefined> {
        // ... (code inchangé)
        const menu: IMenu | undefined = await dbGet<IMenu>('SELECT * FROM Menu WHERE id = ?', [id]);

        if (!menu) {
            return undefined;
        }

        const ingredientsSql = `
            SELECT I.id,
                   I.nom,
                   MI.quantite,
                   MI.unite
            FROM MenuIngredient MI
                     JOIN Ingredient I ON MI.ingredientId = I.id
            WHERE MI.menuId = ?
        `;
        const ingredients = await dbAll<IIngredientRecette>(ingredientsSql, [menu.id]);

        return {
            ...menu,
            ingredients: ingredients
        };
    }

    // [UPDATE] Met à jour un menu et ses ingrédients associés.
    public static async updateMenu(id: number, menuData: IMenuCreation): Promise<IMenuWithIngredients> {
        const transactionDb = db;

        // Vérifier si le menu existe avant de commencer la transaction
        const existingMenu = await this.getMenuById(id);
        if (!existingMenu) {
            throw new Error(`Menu avec l'ID ${id} non trouvé.`);
        }

        try {
            await dbRun('BEGIN TRANSACTION');

            // 1. Mettre à jour les données du Menu
            const menuUpdateSql = `
                UPDATE Menu
                SET nom        = ?,
                    prixNormal = ?,
                    prixPromo  = ?,
                    updateAt   = datetime('now')
                WHERE id = ?
            `;
            const paramsMenu = [
                menuData.nom,
                menuData.prixNormal,
                menuData.prixPromo || null,
                id
            ];
            await dbRunTransaction(menuUpdateSql, paramsMenu, transactionDb);

            // 2. Supprimer les anciens liens d'ingrédients (table de jointure)
            const deleteLinksSql = `DELETE
                                    FROM MenuIngredient
                                    WHERE menuId = ?`;
            await dbRunTransaction(deleteLinksSql, [id], transactionDb);

            const updatedIngredients: IIngredientRecette[] = [];

            // 3. Traiter les nouveaux Ingrédients et créer les liens
            for (const item of menuData.ingredients) {
                const ingredientId = await getOrCreateIngredientId(item.nom, transactionDb);

                const menuIngredientSql = `
                    INSERT INTO MenuIngredient (menuId, ingredientId, quantite, unite)
                    VALUES (?, ?, ?, ?)
                `;
                const paramsMenuIngredient = [
                    id,
                    ingredientId,
                    item.quantite,
                    item.unite
                ];
                await dbRunTransaction(menuIngredientSql, paramsMenuIngredient, transactionDb);

                updatedIngredients.push({
                    id: ingredientId,
                    nom: item.nom,
                    quantite: item.quantite,
                    unite: item.unite
                });
            }

            await dbRun('COMMIT');

            // 4. Retourner le menu mis à jour
            const updatedMenu: IMenu = await dbGet<IMenu>('SELECT * FROM Menu WHERE id = ?', [id]) as IMenu;

            return {
                ...updatedMenu,
                ingredients: updatedIngredients
            };

        } catch (error) {
            await dbRun('ROLLBACK');
            console.error(`Erreur lors de la mise à jour du Menu ${id}:`, error);
            throw new Error(`Échec de la mise à jour du Menu: ${(error as Error).message}`);
        }
    }

    // [DELETE] Supprime un menu par son ID.
    public static async deleteMenu(id: number): Promise<void> {

        try {
            // Recuperer les IDs des ingredients lies
            const ingredientsToDelete: { ingredientId: number }[] = await dbAll<{ ingredientId: number }>(
                'SELECT ingredientId FROM MenuIngredient WHERE menuId = ?', [id]
            );
            const checkMenu = await dbGet<IMenu>('SELECT id FROM Menu WHERE id=?', [id]);
            if (!checkMenu) {
                throw new Error(`Menu avec l'ID ${id} non trouve.`);
            }

            const sql = 'DELETE FROM Menu WHERE id = ?';
            const result = await dbRun(sql, [id]);

            for (const item of ingredientsToDelete) {
                const sqlIngredient = 'DELETE FROM Ingredient WHERE id =?';
                await dbRunTransaction(sqlIngredient, [item.ingredientId], db);
            }

            if (result.changes === 0) {
                throw new Error(`Menu avec l'ID ${id} non trouvé.`);
            }
            console.log("Suppression reussie");
        } catch (error) {
            console.error(`Erreur lors de la suppression du Menu ${id}:`, error);
            throw new Error(`Échec de la suppression du Menu: ${(error as Error).message}`);
        }
    }
}