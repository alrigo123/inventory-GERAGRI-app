import { createPool } from 'mysql2/promise'; //pool to use
import { config } from 'dotenv';
config(); //Cargar las variables del archivo .env

// Local Host
const pool = new createPool({
    host: 'localhost',
    user: process.env.DB_USER_LOCAL,
    password: '',
    database: process.env.DB_NAME_LOCAL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// Clever cloud
// const pool = new createPool({
//     host: process.env.DB_HOST_CLOUD,
//     user: process.env.DB_USER_CLOUD,
//     password: process.env.DB_PASSWORD_CLOUD,
//     database: process.env.DB_NAME_CLOUD
// })

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
        const connection = await pool.getConnection(); // Intentar obtener una conexión
        // console.log(`Connected to BD`)
        console.log('Conexión establecida como id ' + connection.threadId);
        connection.release(); // Liberar la conexión al pool
    } catch (error) {
        console.error('Error in the database connection:', error.stack);
    }
}

// ⬇️ Prevent idle disconnections (Ping DB every 5 minutes)
setInterval(() => {
    pool.query('SELECT 1').catch((err) => {
        console.error("Keep-Alive Query Error:", err);
    });
}, 300000); // Every 5 min

function handleDisconnect() {
    pool.getConnection()
        .then((connection) => {
            console.log("✅ Database reconnected!");
            connection.release();
        })
        .catch((err) => {
            console.error("❌ Database reconnection failed:", err);
            setTimeout(handleDisconnect, 5000); // Retry in 5s
        });
}

// ⬇️ Check every 10 minutes
setInterval(handleDisconnect, 600000);

// Llamar a la función
checkConnection();

export default pool;