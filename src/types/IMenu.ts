import {IIngredient, IIngredientRecette} from "./IIngredient";

export interface IMenu {
    id: number;
    nom: string;
    prixNormal: number;
    prixPromo?: number | null;
    updateAt?: string | null;
    dateCreated: string;
}

/**
 * Interface pour le DTO de création/récupération d'un Menu avec ses Ingrédients.
 * Note: L'ID des ingrédients n'est pas nécessaire pour la création, mais utile pour la réponse.
 */
// Interface pour la creation et la lecture d'un Menu avec ses Ingredients
export interface IMenuWithIngredients extends IMenu {
    ingredients: IIngredientRecette[];
}

// Interface pour la body de la requete de creation/mise a jour
export interface IMenuCreation{
    nom: string;
    prixNormal: number;
    prixPromo?: number | null;
    ingredients: {
        nom: string;
        quantite: number;
        unite: string;
    }[];
}
