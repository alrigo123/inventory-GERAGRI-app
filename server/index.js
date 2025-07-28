import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { config } from 'dotenv';
import helmet from 'helmet';
// npm install helmet --> Protege tu aplicación Express.js de vulnerabilidades comunes
import rateLimit from 'express-rate-limit';
// npm install express-rate-limit --> Esto evita ataques de denegación de servicio (DoS).
import { initSwagger } from './swagger.js';

config(); // Cargar las variables del archivo .env
const app = express(); // Init Server

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutos
//     max: 100, // Límite de 100 peticiones por IP
//     message: 'Demasiadas solicitudes desde esta IP, por favor inténtalo de nuevo más tarde.'
// });


//Middleware
app.set('trust proxy', 1);
app.use(cors({ origin: '*', credentials: true })); // Configuración CORS para permitir accesos desde cualquier origen
app.use(express.json()) //process data to send to the backend
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
// app.use(limiter);

// Middleware para deshabilitar el caché
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.header('Surrogate-Control', 'no-store');
    next();
});

//Routes
import routes from './routes/index.routes.js';
import item_routes from './routes/item.routes.js';
import user_routes from './routes/user.routes.js';
import export_reports from './routes/export.routes.js'

//app
app.use(routes)
app.use('/items', item_routes)
app.use('/user', user_routes)
app.use('/export', export_reports)

const PORT = process.env.PORT || process.env.SERVER_PORT;

// now initialize Swagger **after** routes
initSwagger(app);

app.listen(PORT, () => {
    console.log(`server :${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});