export interface IIngredient{
    id: number;
    nom: string;
    updateAt: Date | null;
    dateCreated: string;
}
export interface IIngredientRecette {
    id: number;
    nom: string;
    quantite: number;
    unite: string;
}