import pool from '../db.js';
import { authenticateToken } from '../middleware/tokenJWT.js';

/* CHECK FUNCTIONS ***SPECIALLY EXCEL INSERT */

// FUNCTION to add new item
export const addItem = async (req, res) => {
    const { codigoPatrimonial, descripcion, trabajador, dependencia, ubicacion, FECHA_COMPRA, FECHA_ALTA, conservacion, disposicion, situacion } = req.body;

    try {
        // Verificar si el código patrimonial ya existe
        const [existingRows] = await pool.query('SELECT 1 FROM item WHERE CODIGO_PATRIMONIAL = ?', [codigoPatrimonial]);

        if (existingRows.length > 0) {
            return res.status(400).json({ message: `El código patrimonial ${codigoPatrimonial} ya existe en la base de datos.` });
        }

        // Generar un valor único y aleatorio para N
        let randomN;
        let isUnique = false;

        while (!isUnique) {
            randomN = Math.floor(10000 + Math.random() * 90000); // Generar número entre 10000 y 99999
            const [rows] = await pool.query(
                'SELECT 1 FROM item WHERE N = ?',
                [randomN]
            );

            if (rows.length === 0) {
                isUnique = true; // Asegurar que el valor no exista
            }
        }

        // Insertar nuevo bien patrimonial con el valor único para N
        await pool.query(
            `INSERT INTO item (
                CODIGO_PATRIMONIAL,
                DESCRIPCION,
                TRABAJADOR,
                DEPENDENCIA,
                UBICACION,
                FECHA_COMPRA,
                FECHA_ALTA,
                CONSERV,
                DISPOSICION,
                SITUACION
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                codigoPatrimonial,
                descripcion,
                trabajador,
                dependencia,
                ubicacion,
                FECHA_COMPRA || null,
                FECHA_ALTA || null,
                conservacion,
                disposicion,
                situacion
            ]
        );

        res.json({ message: 'Bien patrimonial agregado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el bien patrimonial.', error });
    }
};

// FUNCTION to add some text in OBSERVATION (modal)
export const addObservation = async (req, res) => {
    const { id } = req.params;
    const { observacion } = req.body;

    try {
        // Actualiza el campo OBSERVACION en la base de datos
        await pool.query('UPDATE item SET OBSERVACION = ? WHERE CODIGO_PATRIMONIAL = ?', [observacion, id]);
        res.status(200).json({ message: 'Observación actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la observación:', error);
        res.status(500).json({ message: 'Error al actualizar la observación' });
    }
};

// FUNCTION to update item status and situation (QR scan) by their CODIGO_PATRIMONIAL (registrado & verificado to 1)
export const getItemByCodePatAndUpdate = async (req, res, next) => {
    try {
        const id = req.params.id;  // Código patrimonial del item
        const { trabajador_data } = req.query; // trabajador
        const { dependencia_data } = req.query; // dependencia

        // Verificar si el código patrimonial existe en la base de datos
        const [rows] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]);

        if (!rows.length) {
            console.log('Item no encontrado.');
            return res.status(404).json({ message: 'El código patrimonial no existe en la base de datos' });
        }

        const item = rows[0];

        if (trabajador_data) {
            const [trabajador] = await pool.query("SELECT * FROM item WHERE TRABAJADOR = ? AND CODIGO_PATRIMONIAL = ?", [trabajador_data, id]);

            if (trabajador.length === 0) {
                // Verificar si el código pertenece a otro trabajador
                const [otroTrabajador] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]);

                if (otroTrabajador.length > 0) {
                    return res.status(400).json({
                        message: 'El código patrimonial pertenece a otro trabajador',
                        otroTrabajador: {
                            TRABAJADOR: otroTrabajador[0].TRABAJADOR,
                            DEPENDENCIA: otroTrabajador[0].DEPENDENCIA,
                            UBICACION: otroTrabajador[0].UBICACION,
                        },
                    });
                }
                console.log('El código patrimonial no pertenece a este trabajador');
                return res.status(400).json({ message: 'El código patrimonial no pertenece a este trabajador' });
            }
        } else if (dependencia_data) {
            const [dependencia] = await pool.query("SELECT * FROM item WHERE DEPENDENCIA = ? AND CODIGO_PATRIMONIAL = ?", [dependencia_data, id]);

            if (dependencia.length === 0) {
                // Verificar si el código pertenece a otra dependencia
                const [otraDependencia] = await pool.query("SELECT * FROM item WHERE CODIGO_PATRIMONIAL = ?", [id]);

                if (otraDependencia.length > 0) {
                    return res.status(400).json({
                        message: 'El código patrimonial pertenece a otra dependencia',
                        otraDependencia: {
                            TRABAJADOR: otraDependencia[0].TRABAJADOR,
                            DEPENDENCIA: otraDependencia[0].DEPENDENCIA,
                            UBICACION: otraDependencia[0].UBICACION,
                        },
                    });
                }
                console.log('El código patrimonial no pertenece a esta dependencia');
                return res.status(400).json({ message: 'El código patrimonial no pertenece a esta dependencia' });
            }
        }

        // Si el código pertenece al trabajador o dependencia, proceder con la actualización
        const fechaRegistro = new Date(); // Fecha actual

        const [updateResult] = await pool.query("UPDATE item SET ESTADO = 1, SITUACION = 1, FECHA_REGISTRO = ? WHERE CODIGO_PATRIMONIAL = ?", [fechaRegistro, id]);

        // Verificar si se actualizó algún registro
        if (updateResult.affectedRows === 0) {
            console.log('No se actualizó ningún registro.');
            return res.status(400).json({ message: 'No se pudo actualizar el registro' });
        }

        // Retornar el item actualizado
        res.json({ ...item, ESTADO: 1, SITUACION: 1, FECHA_REGISTRO: fechaRegistro });

    } catch (error) {
        console.error('Error en la actualización:', error.message);
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
};

// FUNCTION to update item (edit form) by their CODIGO_PATRIMONIAL
export const updateItem = async (req, res) => {
    const { id } = req.params;
    const { DESCRIPCION, TRABAJADOR, DEPENDENCIA, UBICACION, FECHA_ALTA, FECHA_COMPRA, DISPOSICION, SITUACION, CONSERV } = req.body;

    try {
        // Verificar si el ítem existe y está relacionado con la tabla 'conservacion'
        const [item] = await pool.query(
            `SELECT I.CODIGO_PATRIMONIAL
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id
            WHERE I.CODIGO_PATRIMONIAL = ?`,
            [id]
        );

        // Si no se encuentra el ítem, retornar un mensaje de error
        if (item.length === 0) {
            console.log("NO SE ENCONTRO EL ITEM");
            return res.status(404).json({ message: 'Item not found or not related to conservacion' });
        }

        // Consulta SQL para actualizar el item, incluyendo la actualización del campo CONSERV
        const [result] = await pool.query(
            `
            UPDATE item
            SET
                DESCRIPCION = ?,
                TRABAJADOR = ?,
                DEPENDENCIA = ?,
                UBICACION = ?,
                FECHA_ALTA = ?,
                FECHA_COMPRA = ?,
                DISPOSICION = ?,
                SITUACION = ?,
                CONSERV = ?
            WHERE
                CODIGO_PATRIMONIAL = ?
            `,
            [
                DESCRIPCION, TRABAJADOR, DEPENDENCIA, UBICACION,
                FECHA_ALTA || null, FECHA_COMPRA || null,
                DISPOSICION, SITUACION,
                CONSERV || null,  // Aquí se actualiza CONSERV
                id
            ]
        );

        // Verificar si el ítem fue encontrado y actualizado
        if (result.affectedRows === 0) {
            console.log("NO SE ENCONTRO EL ITEM");
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.log("ERROR EN HANDLER: ", error);
        res.status(500).json({ message: 'Error updating item', error });
    }
};

// FUNCTION add data from excel
export const insertExcelData = async (req, res) => {
    let { data } = req.body; // Datos enviados desde el frontend
    try {

        if (!data || data.length < 2) {
            return res.status(400).json({ message: "No hay suficientes datos para procesar." });
        }

        // data = data.slice(1); // Skips the first row (headers)

        // Start a transaction to ensure atomicity
        await pool.query('START TRANSACTION');
        // console.log("--------------DATA DEL FRONT: ", data)

        for (let row of data) {

            //REALIZA EL PROCESO PARA CADA FILA
            const { CODIGO_PATRIMONIAL, DESCRIPCION,
                TRABAJADOR, DEPENDENCIA, UBICACION,
                FECHA_COMPRA, FECHA_ALTA } = row;

            // Verificar si el código ya existe en la base de datos
            const [existingRows] = await pool.query(
                'SELECT 1 FROM item WHERE CODIGO_PATRIMONIAL = ?',
                [CODIGO_PATRIMONIAL]
            );

            if (existingRows.length > 0) {
                // Si el código ya existe, devuelve un mensaje de error
                await pool.query('ROLLBACK');
                return res.status(400).json({ message: `El código patrimonial ${CODIGO_PATRIMONIAL} ya existe en la base de datos.` });
            }

            // Insertar los datos si no hay duplicados
            await pool.query(
                `INSERT INTO item (CODIGO_PATRIMONIAL, DESCRIPCION,
                TRABAJADOR, DEPENDENCIA, UBICACION,
                FECHA_COMPRA, FECHA_ALTA) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [CODIGO_PATRIMONIAL, DESCRIPCION,
                    TRABAJADOR, DEPENDENCIA, UBICACION,
                    FECHA_COMPRA, FECHA_ALTA]
            );
        }

        await pool.query('COMMIT'); // Commit the transaction
        res.json({ message: 'Datos importados correctamente.' });
    } catch (error) {
        // Rollback en caso de error
        console.log("DATOS ERRADOS EN EL BACKEND: ", error)
        await pool.query('ROLLBACK');
        res.status(500).json({ message: 'Error al importar datos.', error });
    }
};


