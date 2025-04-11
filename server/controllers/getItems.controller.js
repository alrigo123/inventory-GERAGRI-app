import pool from '../db.js';
import modelItems from '../models/items.model.js';

//FUNCTION TO GET ALL DATA, INCLUDING: CONSERVATION STATE, AND IT IS LIMITED TO SHOW "n" SAMPLES
export const getAllItemsAndConservationLimited = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
        const limit = parseInt(req.query.limit) || 50; // Límite de registros por página, por defecto 50
        const offset = (page - 1) * limit; // Cálculo del offset

        const [rows] = await pool.query(
            `SELECT I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR,
            I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO,
            I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
            I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id
            ORDER BY I.CODIGO_PATRIMONIAL ASC
            LIMIT ? OFFSET ?`,
            [limit, offset] // Query parameters
        );

        const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM item');
        const total = totalRows[0].total; //COUNT OF ITEMS (9228)

        res.json({ total, page, limit, items: rows });

    } catch (error) {
        return res.status(500).json(error);
    }
};

//FUNCTION TO GET DATA FROM CONSERVATION TABLE (bueno, malo, regular)
export const getConservationStatus = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM conservacion`);
        res.json(rows)
    } catch (error) {
        return res.status(500).json(error);
    }
}

//FUNCTION TO GET DATA FROM A SINGLE ITEM BY THEIR "CODIGO_PATRIMONIAL" (:id)
export const getItemByCodePat = async (req, res, next) => {
    try {
        const id = req.params.id
        const [row] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]);
        //with the [] we only get an array with the necessary components, without that it gives us more rows

        if (!row.length) return res.status(404).json({ message: 'Item not found' })

        res.json(row[0])
        // res.json({ item :  row[0].id })
    } catch (error) {
        return res.status(500).json(error)
    }
}

//FUNCTION TO GET ALL DATA INCLUDING CONSERVATION STATE FROM A SINGLE ITEM BY THEIR "CODIGO_PATRIMONIAL"(:id)
export const getItemByCodePatAndConservation = async (req, res, next) => {
    try {
        const id = req.params.id
        const [row] = await pool.query(`
            SELECT I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR,
            I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, I.OBSERVACION,
            I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
            I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id
            WHERE I.CODIGO_PATRIMONIAL = ?`,
            [id]);
        //with the [] we only get an array with the necessary components, without that it gives us more rows

        if (!row.length) return res.status(404).json({ message: 'Item not found' })
        res.json(row[0]) // GET THE FIRST ELEMENT [0]
        // res.json(row) // GET ALL ITEMS, BUT DOESN'T PRINT BECAUSE IT REPATS ITS CODE
    } catch (error) {
        return res.status(500).json(error)
    }
}

//FUNCTION TO GET ITEMS QUANTITY FROM "TRABAJADOR" BY THEIR NAME AND LAST NAME
export const getItemsQtyByWorker = async (req, res, next) => {
    try {
        const input = req.query.q; // Worker data (name a/o last name)

        if (!input) return res.status(400).json({ message: 'No se proporcionó el término de búsqueda' });

        // Divide el input en palabras
        const palabras = input.split(' ');

        // Construye dinámicamente la consulta WHERE
        const condiciones = palabras.map(() => `TRABAJADOR LIKE ?`).join(' AND ');
        const parametros = palabras.map((palabra) => `%${palabra}%`);

        const [rows] = await pool.query(
            `SELECT
                TRABAJADOR, DESCRIPCION, DEPENDENCIA,
                COUNT(*) AS CANTIDAD_ITEMS,
                SUM(CASE WHEN ESTADO = 1 THEN 1 ELSE 0 END) AS CANTIDAD_PATRIMONIZADOS,
                SUM(CASE WHEN ESTADO = 0 THEN 1 ELSE 0 END) AS CANTIDAD_NO_PATRIMONIZADOS
            FROM item WHERE ${condiciones}
            GROUP BY
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA
            ORDER BY
                DESCRIPCION`,
            parametros); // Busqueda por coincidencia

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });

        res.json(rows);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

//FUNCTION TO GET ITEMS QUANTITY FROM A "DEPENDENCIA" BY THEIR SEDE NAME
export const getItemsQtyByDependece = async (req, res, next) => {
    try {
        const input = req.query.q; //Dependency data

        if (!input) return res.status(400).json({ message: 'No se proporcionó el término de búsqueda' });

        // Divide el input en palabras
        const palabras = input.split(' ');

        // Construye dinámicamente la consulta WHERE
        const condiciones = palabras.map(() => `DEPENDENCIA LIKE ?`).join(' AND ');
        const parametros = palabras.map((palabra) => `%${palabra}%`);

        const [rows] = await pool.query(
            `SELECT
                TRABAJADOR, DESCRIPCION, DEPENDENCIA,
                COUNT(*) AS CANTIDAD_ITEMS,
                SUM(CASE WHEN ESTADO = 1 THEN 1 ELSE 0 END) AS CANTIDAD_PATRIMONIZADOS,
                SUM(CASE WHEN ESTADO = 0 THEN 1 ELSE 0 END) AS CANTIDAD_NO_PATRIMONIZADOS
            FROM item WHERE ${condiciones}
            GROUP BY
                TRABAJADOR,
                DESCRIPCION,
                DEPENDENCIA
            ORDER BY
                DESCRIPCION`,
            parametros); // Aplicamos la búsqueda por coincidencia

        if (!rows.length) return res.status(404).json({ message: 'No se encontraron ítems para el trabajador especificado' });

        res.json(rows);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

