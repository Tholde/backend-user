// import express, {Request, Response, NextFunction} from "express";
// import router from "./routes/router";
// import dotenv from "dotenv";
// import morgan from "morgan";
// import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
// import rateLimit from "express-rate-limit";
// import {ErrorHandler} from "./middleware/error";
// // import swaggerDocs from "./utils/swagger";
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerOptions from "./utils/swagger";
// import swaggerUi from "swagger-ui-express";
// import {connectToSQLiteDatabase} from "./database/SQLiteConnection";
//
// // Initialize app
// const app = express();
// dotenv.config();
// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// // Use SQLite connection instead of MongoDB
// const db = connectToSQLiteDatabase();
// // Port
// const port = parseInt(process.env.PORT as string) || 8000;
//
// if (db) {
//     app.listen(port, () => {
//         console.log(`Server started on port ${port}!`);
//         console.log("Swagger UI running at /api-docs");
//     });
// // Middleware
//     app.use(express.json());
//     app.use(cookieParser());
//     app.use("/api", router);
//
//     if (process.env.NODE_ENV === "development") {
//         app.use(morgan("dev"));
//     }
//
//     app.use(bodyParser.json({limit: "5mb"}));
//     app.use(bodyParser.urlencoded({limit: "5mb", extended: true}));
//
// // Removed mongoSanitize — it’s only for MongoDB
//     app.use(ErrorHandler);
//
// // Rate limiter
//     const limiter = rateLimit({
//         windowMs: 1000, // 1 second
//         max: 1000,
//         standardHeaders: true,
//         legacyHeaders: false,
//     });
//     app.use(limiter);
//
// // Swagger docs
//     app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//
// // Error middleware
//     app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//         console.error(err.stack);
//         const status = err.status || 500;
//         const message = err.message || "Internal Server Error";
//         res.status(status).json({
//             error: {message, status},
//         });
//     });
//
// } else {
//     console.error("Failed to start server: could not connect to SQLite database");
// }
// /src/server.ts

import 'dotenv/config'; // Pour charger les variables d'environnement
import express from 'express';
import router from "./routes/router";
import errorHandler from './middleware/error';
import logger from './utils/logger';
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
// import swaggerDocs from "./utils/swagger";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./utils/swagger";
import swaggerUi from "swagger-ui-express";

const app = express();
dotenv.config();
// Vérification de la clé secrète JWT
if (!process.env.JWT_SECRET) {
    logger.error("FATAL ERROR: JWT_SECRET is not defined in environment variables. Using default.");
    // En production, il faudrait sortir du processus ici
    // process.exit(1);
}

const PORT = process.env.PORT || 5000;

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(express.json()); // Body parser
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({limit: "5mb", extended: true}));

// Rate limiter
const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Montage des routes
app.use('/api/v1', router);

// Gestionnaire d'erreurs (doit être le dernier middleware)
app.use(errorHandler);

const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Gérer les rejets de promesses non gérés
process.on('unhandledRejection', (err: any, promise) => {
    logger.error(`Error: ${err.message}`, err);
    // Fermer le serveur & quitter le processus
    server.close(() => process.exit(1));
});

