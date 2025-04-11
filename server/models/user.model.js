const modelUser = {}
import pool from '../db.js'; // Asegúrate de importar tu pool de conexión a la base de datos

modelUser.registerUser = async (pool, dni, name_and_last, passHash) => {
    const stmt = 'INSERT INTO user_i (dni, name_and_last, password) VALUES (?, ?, ?)'
    const registerUser = await pool.query(stmt, [dni, name_and_last, passHash])
    return registerUser;
}

modelUser.findUserByDNI = async (pool, dni) => {
    const stmt = 'SELECT * FROM user_i WHERE dni = ?'
    const getSingleUser = await pool.query(stmt, [dni])
    const user = await getSingleUser
    return user[0];
}

// 📌 GET All Users
modelUser.getAllUsers = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM user_i");
        return rows;
    } catch (error) {
        throw error;
    }
};

// 📌 Get user by ID
modelUser.getUserById = async (dni) => {
    try {
        const [rows] = await pool.query("SELECT * FROM user_i WHERE dni = ?", [dni]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

// 📌 Update user
modelUser.updateUser = async (dni, name_and_last, status) => {
    try {
        const [result] = await pool.query(
            "UPDATE user_i SET name_and_last = ?, status = ? WHERE dni = ?",
            [name_and_last, status, dni]
        );
        return result;
    } catch (error) {
        throw error;
    }
};

// 📌 Delete user
modelUser.deleteUser = async (dni) => {
    try {
        const [result] = await pool.query("DELETE FROM user_i WHERE dni = ?", [dni]);
        return result;
    } catch (error) {
        throw error;
    }
};

// 📌 Change user status
modelUser.updateUserStatus = async (dni, status) => {
    try {
        const [result] = await pool.query(
            "UPDATE user_i SET status = ? WHERE dni = ?",
            [status, dni]
        );
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
};

export default modelUser;