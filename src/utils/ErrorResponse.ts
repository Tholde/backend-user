<<<<<<< HEAD
// /src/utils/ErrorResponse.ts

=======
// export class ErrorResponse extends Error {
//     statusCode: number;
//
//     constructor(message: string, statusCode: number) {
//         super(message);
//         this.statusCode = statusCode;
//     }
// }
/**
 * @class ErrorResponse
 * @description Classe d'erreur personnalisée pour gérer les erreurs d'API avec un statut HTTP.
 */
>>>>>>> b13ebdf (add crud menu)
export class ErrorResponse extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
<<<<<<< HEAD
    }
}
=======

        // Capture la stack trace pour un meilleur débogage
        Error.captureStackTrace(this, this.constructor);
    }
}
>>>>>>> b13ebdf (add crud menu)
