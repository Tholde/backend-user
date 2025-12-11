import { IIngredient } from "./IIngredient";
import { IMenu } from "./IMenu";

/**
 * Interface pour le DTO de création/récupération d'un Menu avec ses Ingrédients.
 * Note: L'ID des ingrédients n'est pas nécessaire pour la création, mais utile pour la réponse.
 */
export interface IMenuWithIngredients extends IMenu {
    ingredients: Omit<IIngredient, 'updateAt' | 'dateCreated'>[]; // On simplifie pour le DTO de la requête
}
