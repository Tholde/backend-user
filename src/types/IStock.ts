export interface IStock {
    id: number;
    id_admin: number;
    id_gestionnaire: number;
    nom: string;
    quantite: number;
    unite: string;
    prix_unit: number;
    updateAt: Date|null;
    dateCreated: string;
}
export interface StockDetail extends IStock {
    nomAdmin: string;
    nomGestionnaire: string;
}