export interface IClient{
    id: number;
    nom: string;
    address: string;
    tel: string;
    status: string;
    updateAt: Date | null;
    dateCreated: string;
}