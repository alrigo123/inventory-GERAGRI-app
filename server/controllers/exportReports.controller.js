import pool from '../db.js';

/* CHECK QUERIES AND DUPLICITY */

// FUNCTION to get all data including the conservation state
export const getItemsGeneralState = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR,
                I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO,
                I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
                I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id`
        );

        // Check if there are results
        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron elementos" });
        }

        res.json(rows);
        // console.log(rows)

    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error.message);
        return res.status(500).json({ error: "Error al obtener los datos de la base de datos" });
    }
};

// FUNCTION to get state 1 of item (registrado)
export const getItemsStateTrue = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION,
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, ESTADO
            FROM item WHERE ESTADO = 1`
        );

        res.json(rows);
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

// FUNCTION to get state 0 of item (no registrado)
export const getItemsStateFalse = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION,
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, ESTADO
            FROM item WHERE ESTADO = 0`
        );

        res.json(rows);
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

// FUNCTION to get general disposition of the item
export const getItemsGeneralDisposition = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION,
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, DISPOSICION
            FROM item`
        );

        res.json(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
};

// FUNCTION to get disposition 1 of item (activo)
export const getItemsDispositionTrue = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION,
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, DISPOSICION
            FROM item WHERE DISPOSICION = 1`
        );

        res.json(rows)
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

// FUNCTION to get disposition 1 of item (de baja)
export const getItemsDispositionFalse = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, TRABAJADOR,
            FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, DISPOSICION
            FROM item WHERE DISPOSICION = 0`
        );

        res.json(rows)
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

// FUNCTION to get general situation of the item
export const getItemsGeneralSituation = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION,
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, SITUACION
            FROM item`
        );

        // Validar si hay resultados
        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron elementos" });
        }
        res.json(rows);
        // console.log(rows)

    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error.message);
        return res.status(500).json({ error: "Error al obtener los datos de la base de datos" });
    }
};

// FUNCTION to get situation 1 of item (verificado)
export const getItemsSituationTrue = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION,
            TRABAJADOR, FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, SITUACION
            FROM item WHERE SITUACION = 1`
        );

        res.json(rows)
        // console.log(rows)


    } catch (error) {
        return res.status(500).json(error);
    }
}

// FUNCTION to get situation 0 of item (no verificado)
export const getItemsSituationFalse = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT N, CODIGO_PATRIMONIAL, DESCRIPCION, DEPENDENCIA, UBICACION, TRABAJADOR,
            FECHA_COMPRA, FECHA_ALTA, FECHA_REGISTRO, SITUACION
            FROM item WHERE SITUACION = 0`
        );

        res.json(rows)
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}

// FUNCTION to get all items to export
export const getAllItemsToExport = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR,
                I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO,
                I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
                I.SITUACION, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id`
        );

        res.json(rows)
        // console.log(rows)

    } catch (error) {
        return res.status(500).json(error);
    }
}