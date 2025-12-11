import {Router} from 'express';
import {authorize, protect} from "../../middleware/auth";
import asyncHandler from "../../middleware/asyncHandler";
<<<<<<< HEAD
import {createUserByAdmin, deleteUser, getUser, updateUser} from "../../controllers/UserController";
=======
import {createUser, deleteUser, getAllUsers, getUserById, updateMe} from "../../controllers/UserController";
>>>>>>> b13ebdf (add crud menu)

const userRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
userRouter.post('/users', protect, authorize('admin'), asyncHandler(createUserByAdmin));
=======
userRouter.post('/', protect, authorize('admin'), createUser);
>>>>>>> b13ebdf (add crud menu)
/**
 * @swagger
 * /api/v1/users/:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
<<<<<<< HEAD
userRouter.get('/users', protect, asyncHandler(getUser));
=======
userRouter.get('/', protect, authorize('admin'), getAllUsers);
>>>>>>> b13ebdf (add crud menu)
/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Retrieve a single user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: A single user
 */
<<<<<<< HEAD
userRouter.get('/users/:id', protect, asyncHandler(getUser));
=======
userRouter.get('/:id', protect, getUserById);
>>>>>>> b13ebdf (add crud menu)
/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
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
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 */
<<<<<<< HEAD
userRouter.put('/users/:id', protect, asyncHandler(updateUser));
=======
userRouter.put('/:id', protect, updateMe);
>>>>>>> b13ebdf (add crud menu)
/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User not found.
 */
<<<<<<< HEAD
userRouter.delete('/users/:id', protect, authorize('admin'), asyncHandler(deleteUser));
=======
userRouter.delete('/:id', protect, authorize('admin'), asyncHandler(deleteUser));
>>>>>>> b13ebdf (add crud menu)

export default userRouter;
