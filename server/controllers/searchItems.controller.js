import pool from '../db.js';

// FUNCTION to get data information of DESCRIPCION (bien), TRABAJADOR o DEPENDENCIA
export const searchGeneral = async (req, res, next) => {
    try {
        const input = req.query.q;

        if (!input) return res.status(400).json({ message: 'No se proporcionó el término de búsqueda' });

        const palabras = input.split(' '); // Divide la búsqueda en palabras

        // Aplica búsqueda en varios campos con AND entre cada palabra
        const condiciones = palabras.map(() => `
            (DESCRIPCION LIKE ? OR TRABAJADOR LIKE ? OR DEPENDENCIA LIKE ?)
        `).join(' AND ');

        // Para cada palabra se agregan 3 parámetros (uno por cada campo)
        const parametros = palabras.flatMap(palabra => {
            const like = `%${palabra}%`;
            return [like, like, like];
        });

        const [rows] = await pool.query(
            `SELECT * FROM item
            WHERE ${condiciones}
            ORDER BY CODIGO_PATRIMONIAL ASC`,
            parametros
        );

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron resultados' });

        res.json(rows);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// FUNCTION to obtain items based on WORKER matches
export const searchItemsByWorker = async (req, res, next) => {
    try {
        const input = req.query.q;

        if (!input) return res.status(400).json({ message: 'No se proporcionó el término de búsqueda' });

        const palabras = input.split(' '); // Divide el input en palabras

        // Construye dinámicamente la consulta WHERE
        const condiciones = palabras.map(() => `I.TRABAJADOR LIKE ?`).join(' AND ');
        const parametros = palabras.map((palabra) => `%${palabra}%`);

        const [rows] = await pool.query(
            `SELECT
                I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR,
                I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, I.OBSERVACION,
                I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
                I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
                ON I.CONSERV = C.id
            WHERE ${condiciones}
            ORDER BY I.CODIGO_PATRIMONIAL ASC;`,
            parametros
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });
        }

        res.json(rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// FUNCTION to obtain items based on SEDES/DEPENDENCIA matches
export const searchItemsByDependece = async (req, res, next) => {
    try {
        const input = req.query.q;

        if (!input) return res.status(400).json({ message: 'No se proporcionó el término de búsqueda' });

        // Divide el input en palabras
        const palabras = input.split(' ');

        // Construye dinámicamente la consulta WHERE
        const condiciones = palabras.map(() => `I.DEPENDENCIA LIKE ?`).join(' AND ');
        const parametros = palabras.map((palabra) => `%${palabra}%`);

        const [rows] = await pool.query(
            `SELECT
                I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR,
                I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, I.OBSERVACION,
                I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
                I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
                ON I.CONSERV = C.id
            WHERE ${condiciones}
            ORDER BY I.CODIGO_PATRIMONIAL ASC;`,
            parametros
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ítems para la sede especificada' });
        }

        res.json(rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// FUNCTION to obtain WORKERS based on the search field (TO REGISTER ITEM)
export const searchItemByPartialWorker = async (req, res, next) => {
    try {
        const searchTerm = req.query.search;  // Usar 'search' que es el nombre correcto del parámetro en la URL

        if (!searchTerm) { return res.status(400).json({ message: 'El parámetro de búsqueda es requerido.' }); }

        const [rows] = await pool.query(
            `SELECT DISTINCT TRABAJADOR
            FROM item
            WHERE TRABAJADOR LIKE ?
            LIMIT 10; `,
            [`%${searchTerm}%`]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'No se encontraron resultados de trabajadores' });
        }

        res.json(rows); // Devolvemos las 'sugerencias' encontradas

    } catch (error) {
        console.error('Error en la búsqueda:', error);
        return res.status(500).json({ message: 'Hubo un error interno en el servidor', error });
    }
};

// FUNCTION to obtain SEDES based on the search field (TO REGISTER ITEM)
export const searchItemByPartialDependency = async (req, res, next) => {
    try {
        const searchTerm = req.query.search;  // Usar 'search' que es el nombre correcto del parámetro en la URL

        if (!searchTerm) { return res.status(400).json({ message: 'El parámetro de búsqueda es requerido.' }); }

        const [rows] = await pool.query(
            `SELECT DISTINCT DEPENDENCIA
            FROM item
            WHERE DEPENDENCIA LIKE ?
            LIMIT 10;`,
            [`%${searchTerm}%`]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'No se encontraron resultados de la sede' });
        }

        res.json(rows); // Devolvemos las sugerencias encontradas

    } catch (error) {
        console.error('Error en la búsqueda:', error);  // Agregar un log más específico para el error
        return res.status(500).json({ message: 'Hubo un error interno en el servidor', error });
    }
};