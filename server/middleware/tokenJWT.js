import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_KEY;

// CHECK THE TOKEN FOR REGULAR USERS
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token

    if (!token) {
        console.log("NO AUTORIZADO no token provided")
        return res.status(401).json({ message: "Access denied. No token provided." }); // No autorizado
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.role !== "user") return res.status(403).json({ message: "Unauthorized role" });

        // jwt.verify(token, SECRET_KEY, (err, user) => {
        //     if (err) { return res.status(403).json({ message: 'Token no válido o expirado' }); } // Token inválido o expirado
        //     req.user = user; // Se guarda la información del usuario en el request
        //     next();
        // });

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token
    // const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.role !== "admin") return res.status(403).json({ message: "Unauthorized role" });

        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const authenticateTokenOptional = function (req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log('Aquí no tienes token');
        // Continúa sin autenticación ya que es opcional
        return next();
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Token no válido o expirado');
            // Si el token es inválido, también se continúa, o podrías manejarlo de otra forma
            return next();
        }
        req.user = user;
        next();
    });
};