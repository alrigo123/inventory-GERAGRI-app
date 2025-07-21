import { createPool } from 'mysql2/promise'; //pool to use
import { config } from 'dotenv';
config(); //Cargar las variables del archivo .env

// Local Host
// const pool = new createPool({
//     host: 'localhost',
//     user: process.env.DB_USER_LOCAL,
//     password: '',
//     database: process.env.DB_NAME_LOCAL,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// })

// Clever cloud
const pool = new createPool({
    host: process.env.DB_HOST_CLOUD,
    user: process.env.DB_USER_CLOUD,
    password: process.env.DB_PASSWORD_CLOUD,
    database: process.env.DB_NAME_CLOUD,
    waitForConnections: true,
    connectionLimit: 5, // <-- CLAVE, pon el máximo permitido
    queueLimit: 0
});

// Hostgator GERAGRI
// const pool = new createPool({
//     host: process.env.DB_HOST_HGATOR,
//     user: process.env.DB_USER_HGATOR,
//     password: process.env.DB_PASSWORD_HGATOR,
//     database: process.env.DB_NAME_HGATOR,
//     waitForConnections: true, // Queue connection requests if the pool is full
//     // connectionLimit: 10, // Limit the number of active connections
//     queueLimit: 0, // Unlimited request queue
//     connectTimeout: 30000, // ⬅️ Increases timeout to 30s
//     multipleStatements: false, // Prevent SQL injection risks
//     // acquireTimeout: 30000,   // Avoid waiting forever
//     keepAliveInitialDelay: 10000 // ⬅️ Keeps connection alive
// });

// Check database connection
async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión establecida como id ' + connection.threadId);
        connection.release();
    } catch (error) {
        console.error('Error in the database connection:', error.stack);
    }
}
checkConnection();

// Keep-alive (siempre usando pool, NO nueva conexión)
setInterval(() => {
    pool.query('SELECT 1').catch((err) => {
        console.error("Keep-Alive Query Error:", err);
    });
}, 300000);

export default pool;