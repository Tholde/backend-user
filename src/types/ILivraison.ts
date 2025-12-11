export interface ILivraison {
    id: number;
    id_client: number;
    frais: number;
    updateAt: Date | null;
    dateCreated: string;
}
export interface ILivraisonDetail extends ILivraison{
    nom_client: string;
    num_client: string;
}