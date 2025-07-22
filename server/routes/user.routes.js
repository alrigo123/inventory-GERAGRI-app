import { Router } from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    verifyPin,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserStatus
} from "../controllers/userManagement.controller.js";

import { verifyAdminToken } from "../middleware/tokenJWT.js";

const router = Router();

/* Methos to manage session and storage */
router.post("/login", loginUser); // Component "LoginModalComp", to compare user and password to access to patrimonial code functions
router.post("/register", verifyAdminToken, registerUser); // File "RegiterWithPin", to register new user in DB
router.post("/verify-pin", verifyPin); // File "RegisterWithPin", to match the PIN with the user payload
router.post("/logout", logoutUser); /* PROTECTED ROUTES files, to end a session and clear the token */

/* File "DashboardAdmin" */
router.get('/users/:dni', getUserById); /* METHOD NOT USED */
router.get('/users', verifyAdminToken, getAllUsers); // List and get all users registered in DB
router.delete('/users/:dni', deleteUser); // Delete user for its DNI
router.put("/:dni/status", updateUserStatus); // Update user status (ACTIVO/INACTIVO), for the login access

export default router;