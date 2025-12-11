export interface IDepense {
    id: number;
    motif: string;
    quantite: number;
    unite: string;
    valeur: number;
    typeDep: string;
    updateAt: Date|null;
    dateCreated: string;
}