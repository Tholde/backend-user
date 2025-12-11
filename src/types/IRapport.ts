export interface IRapport {
    id: number;
    date_depense: Date | null;
    depense: number;
    benefice: number;
    impot: number;
    updateAt: Date | null;
    dateCreated: string;
}