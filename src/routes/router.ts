import express, {Router} from 'express';
import authRouter from "./api/authRouter";
import userRouter from "./api/userRouter";
<<<<<<< HEAD
=======
import menuRoute from "./api/menuRoute";
>>>>>>> b13ebdf (add crud menu)


const router = Router();
// router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const origin = req.headers.origin;
//     console.log(req.method);
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS,PATCH,DELETE,PATCH");
//     // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, API-KEY, D-Token, D-Appid");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     if (req.method === "OPTIONS") {
//         return res.sendStatus(200);
//     }
//     return next();
// })
<<<<<<< HEAD
router.use('/', authRouter, userRouter);
=======
// router.use('/', authRouter, userRouter, menuRoute);

// Monte chaque routeur sur son préfixe propre
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/menus', menuRoute);
>>>>>>> b13ebdf (add crud menu)
export default router;

// import express, { Router, Request, Response, NextFunction, RequestHandler } from 'express';
// import authRouter from './api/authRouter';
// import userRouter from './api/userRouter';
//
// const router = Router();
//
// // Middleware with proper return type
// const corsMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
//     const origin = req.headers.origin;
//     console.log(req.method);
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//
//     if (req.method === 'OPTIONS') {
//         res.sendStatus(200);  // Ensure no further execution with 'return'
//         return;
//     }
//
//     next();  // Explicitly call next if not an OPTIONS request
// };
//
// // Use middleware and routers
// router.use(corsMiddleware);
// router.use('/auth', authRouter);
// router.use('/users', userRouter);
// // router.use('/', authRouter, userRouter)
//
// export default router;
//

// /src/routes/index.ts

// src/routes/router.ts (previously src/routes/index.ts)

// import { Router } from 'express';
// import asyncHandler from '../middleware/asyncHandler'; // <-- NEW IMPORT
// import { protect, authorize } from '../middleware/auth';
// import {
//     deleteUser,
//     forgotPassword,
//     getUser,
//     getUsers,
//     login, logout,
//     register,
//     resetPassword, updateUser,
//     verifyEmail
// } from "../controllers/UserController";
//
// const router = Router();
//
// // --- Routes d'Authentification (Public) ---
// // Wrap the async functions with asyncHandler
// router.post('/auth/register', asyncHandler(register));
// router.get('/auth/verifyemail/:token', asyncHandler(verifyEmail));
// router.post('/auth/login', asyncHandler(login));
// // FIX for TS2769 on forgotPassword
// router.post('/auth/forgotpassword', asyncHandler(forgotPassword));
// router.put('/auth/resetpassword/:token', asyncHandler(resetPassword));
// router.post('/auth/logout', protect, asyncHandler(logout));
//
// // --- Routes CRUD Utilisateur (Protégées) ---
//
// // Wrap ALL async handlers
// router.get('/users', protect, authorize('admin'), asyncHandler(getUsers));
//
// router.get('/users/:id', protect, asyncHandler(getUser));
// router.get('/users', protect, asyncHandler(getUser)); // Pour la route ?search=...
//
// router.put('/users/:id', protect, asyncHandler(updateUser));
//
// router.delete('/users/:id', protect, authorize('admin'), asyncHandler(deleteUser));
//
// export default router;