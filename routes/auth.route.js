import express from 'express';
import AuthController from '../controller/auth.controller.js';

const authRouter = express.Router();
// const authController = new AuthController;
// authRouter.post('/', (req, res) => AuthController.signup(req.body));

authRouter.post('/register', AuthController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 *     description: Login and get access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login
 */
authRouter.post('/login', AuthController.login);

export default authRouter;