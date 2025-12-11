import {Router} from 'express';
import asyncHandler from "../../middleware/asyncHandler";
import {protect} from "../../middleware/auth";
import {forgotPassword, login, logout, register, resetPassword, verifyEmail} from "../../controllers/AuthController";
// } from "../../controllers/AuthController";

const authRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The firstname of the user
 *               lastname:
 *                 type: string
 *                 description: The lastname of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password for the user
 *               roleUser:
 *                 type: string
 *                 description: The role for the user, admin or employee or tresorier
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - roleUser
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
<<<<<<< HEAD
authRouter.post('/auth/register', asyncHandler(register));
=======
authRouter.post('/register', register);
>>>>>>> b13ebdf (add crud menu)
/**
 * @swagger
 * /api/v1/auth/verification:
 *   post:
 *     summary: Verify user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Code from e-mail, send from admin on signup
 *             required:
 *               - token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid input
 */
<<<<<<< HEAD
authRouter.get('/auth/verifyemail/:token', asyncHandler(verifyEmail));
=======
authRouter.get('/verifyemail/:token', verifyEmail);
>>>>>>> b13ebdf (add crud menu)
/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password for the user
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Invalid input
 */
<<<<<<< HEAD
authRouter.post('/auth/login', asyncHandler(login));
=======
authRouter.post('/login', login);
>>>>>>> b13ebdf (add crud menu)
/**
 * @swagger
 * /api/v1/auth/forgetPassword:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset requested
 *       400:
 *         description: Invalid input
 */
<<<<<<< HEAD
authRouter.post('/auth/forgotpassword', asyncHandler(forgotPassword));
=======
authRouter.post('/forgotpassword', asyncHandler(forgotPassword));
>>>>>>> b13ebdf (add crud menu)
// /**
//  * @swagger
//  * /api/v1/auth/verificationResetPassword:
//  *   post:
//  *     summary: Reset password
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               code:
//  *                 type: string
//  *                 description: The code from user email
//  *             required:
//  *               - code
//  *     responses:
//  *       200:
//  *         description: Code verified successfully. Try to change your password!
//  *       400:
//  *         description: Invalid input
//  */
// authRouter.post("/reset/code", resetPasswordCode)
/**
 * @swagger
 * /api/v1/auth/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The password for the user
 *               token:
 *                 type: string
 *                 description: The confirm_password for the user
 *             required:
 *               - newPassword
 *               - token
 *     responses:
 *       200:
 *         description: Change password successfully.
 *       400:
 *         description: Invalid input
 */
<<<<<<< HEAD
authRouter.put('/auth/resetpassword/:token', asyncHandler(resetPassword));
=======
authRouter.put('/resetpassword/:token', resetPassword);
>>>>>>> b13ebdf (add crud menu)
/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
<<<<<<< HEAD
authRouter.post('/auth/logout', protect, asyncHandler(logout));
=======
authRouter.post('/logout', protect,logout);
>>>>>>> b13ebdf (add crud menu)

export default authRouter;
