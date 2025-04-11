const modelItems = {}

modelItems.getAllItems = async (pool, dni, name_and_last, passHash) => {
    const stmt = `SELECT I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR,
            I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO,
            I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
            I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id
            ORDER BY I.CODIGO_PATRIMONIAL ASC
            LIMIT ? OFFSET ?`;
    const items = await pool.query(stmt, [dni, name_and_last, passHash])
    return registerUser;
}

modelItems.findUserByDNI = async (pool, dni) => {
    const stmt = 'SELECT * FROM user_i WHERE dni = ?'
    const getSingleUser = await pool.query(stmt, [dni])
    const user = await getSingleUser
    return user[0];
}

export default modelItems;