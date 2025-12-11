export interface IFacture {
    id: number;
    numero_fac: string;
    id_client: number;
    id_menu: number;
    id_user: number;
    quantite: number;
    prix_total: number;
    updateAt: Date | null;
    dateCreated: string;
}
export interface IFactureDetail extends IFacture{
    nom_client: string;
    nom_menu: string;
    nom_user: string;
}