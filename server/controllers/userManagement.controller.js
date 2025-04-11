import pool from '../db.js'; // Asegúrate de importar tu pool de conexión a la base de datos
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import modelUser from '../models/user.model.js'

const SECRET_KEY = process.env.JWT_KEY
const SECURITY_PIN = process.env.SECURITY_PIN; // Store this securely (e.g., in an environment variable)

let blacklist = []; // Lista negra para tokens

// FUNCTION to login a user with their DNI and PASSWORD
export const loginUser = async (req, res) => {
    try {
        const { dni, password } = req.body;

        // Verifica que ambos campos estén presentes
        if (!dni || !password) { return res.status(400).json({ message: 'DNI y contraseña son requeridos BACKEND' }); }

        // Buscar al usuario por DNI
        // const [rows] = await pool.query("SELECT * FROM user_i WHERE dni = ?", [dni]); // Destructuring para evitar niveles anidados
        const rows = await modelUser.findUserByDNI(pool, dni)
        // console.log("ROWWS", rows)

        // Verificar si el usuario existe
        if (rows.length === 0) { return res.status(404).json({ message: 'Usuario no encontrado' }); }

        const user = rows[0]; // Primer resultado
        const su = user.dni;

        // Verificar si la contraseña existe en los datos del usuario
        if (!user.password) { return res.status(500).json({ message: 'Error del servidor: contraseña no encontrada en el usuario' }); }

        // Verificar si el usuario está activo
        if (user.status === 0) { return res.status(403).json({ message: 'Usuario desactivado. Contacte al administrador' }); }

        // Comparar contraseñas con bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) { return res.status(401).json({ message: 'Contraseña Incorrecta' }); }

        let token = ""
        if (su === 'root') {
            // Generar un token JWT
            token = jwt.sign({ dni: user.dni, name: user.name_and_last, role: "user" }, SECRET_KEY, { expiresIn: '30s' });
        } else {
            token = jwt.sign({ dni: user.dni, name: user.name_and_last, role: "user" }, SECRET_KEY, { expiresIn: '2h' }); // 2h de expiración
        }

        // Respuesta exitosa
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: {
                dni: user.dni,
                name_and_last: user.name_and_last
            },
            token: token,
            su: su
        });

    } catch (error) {
        console.error("Error en loginUser:", error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

// FUNCTION to register a new user
export const registerUser = async (req, res) => {
    const { dni, name_and_last, password } = req.body;

    try {
        if (!dni || !name_and_last || !password) { return res.status(400).json({ message: "Todos los campos son obligatorios" }); }

        // Verificar si el DNI ya existe
        // const [existingDNI] = await pool.query("SELECT * FROM user_i WHERE dni = ?", [dni]);
        const existingDNI = await modelUser.findUserByDNI(pool, dni)
        if (existingDNI.length > 0) { return res.status(400).json({ message: "El DNI ya está registrado" }); }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar el usuario en la base de datos
        await modelUser.registerUser(pool, dni, name_and_last, hashedPassword)
        /* await pool.query(
             "INSERT INTO user_i (dni, name_and_last, password) VALUES (?, ?, ?)",
             [dni, name_and_last, hashedPassword]
         ); */
        res.status(201).json({ message: "Usuario registrado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// FUNCTION for user to logout
export const logoutUser = (req, res) => {
    const userToken = req.headers["authorization"]?.split(" ")[1];
    const adminToken = req.headers["admin-authorization"]?.split(" ")[1]; // Assume admin token is sent separately

    if (!userToken && !adminToken) {
        return res.status(400).json({ message: "No token provided" });
    }

    if (userToken) {
        blacklist.push(userToken);
    }

    if (adminToken) {
        blacklist.push(adminToken);
    }

    // Cleanup old tokens after 1 hour
    setTimeout(() => {
        blacklist = blacklist.filter(t => t !== userToken && t !== adminToken);
    }, 3600000);

    res.status(200).json({ message: "Sesión cerrada correctamente" });
}

//FUNCTION to send PIN for AUTH register
export const verifyPin = (req, res) => {
    const { pin } = req.body;
    if (pin === SECURITY_PIN) {
        // Generate Admin Token
        const adminToken = jwt.sign({ access: true, role: "admin" }, SECRET_KEY, { expiresIn: '1h' });

        return res.json({ valid: true, adminToken });
    }

    return res.status(401).json({ valid: false, message: "Invalid PIN" });
};

/* CRUD FUNCTIONS/OPERATION */
// 📌 READ all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await modelUser.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 📌 READ a single user by ID
export const getUserById = async (req, res) => {
    const { dni } = req.params;
    try {
        const user = await modelUser.getUserById(dni);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 📌 UPDATE a user by ID
export const updateUser = async (req, res) => {
    const { dni } = req.params;
    const { name_and_last, status } = req.body;

    try {
        const updatedUser = await modelUser.updateUser(dni, name_and_last, status);
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 📌 DELETE a user by ID
export const deleteUser = async (req, res) => {
    const { dni } = req.params;

    try {
        const result = await modelUser.deleteUser(dni);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Change user status for the login permissions
export const updateUserStatus = async (req, res) => {
    const { dni } = req.params;
    let { status } = req.body; // Extract status from request body

    try {
        const result = await modelUser.updateUserStatus(dni, status);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User status updated successfully", status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
