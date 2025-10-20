// /src/types/IUser.ts

export interface IUser {
    id?: number;
    firstname: string; // au moins 2 lettres
    lastname: string; // au moins 2 lettres
    email: string; // unique
    password: string; // 8 characteres minimum et ensemble de caractere (sera hashé)
    roleUser: 'employee' | 'admin' | string; // par défaut 'employee'
    isActive: boolean; // false au page de registration
    resetPasswordToken: string | null;
    resetPasswordExpiresAt: Date | null;
    verificationToken: string | null;
    verificationExpiresAt: Date | null;
    lastLogin?: Date | null; // dernier heure de click logout
    createdAt?: string; // date fixe (généralement TEXT dans SQLite)
    updatedAt?: Date; // lorsqu'il fait le modification, la date change
}

// Interface pour le modèle sans le mot de passe hashé
export type IUserPublic = Omit<IUser, 'password' | 'resetPasswordToken' | 'verificationToken'>;