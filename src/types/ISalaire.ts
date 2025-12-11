export interface ISalaire{
    id: number;
    id_user: number;
    montant: number;
    updateAt: Date | null;
    dateCreated: string;
}
export interface ISalaireDetail extends ISalaire{
    nom_user: string;
}