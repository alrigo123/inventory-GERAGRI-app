const modelItems = {}

modelItems.getAllItemsAndConservationLimited = async (pool, limit, offset) => {
    try {
        const stmt = `
        SELECT I.N, I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR,
            I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO,
            I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
            I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id
            ORDER BY I.CODIGO_PATRIMONIAL ASC
            LIMIT ? OFFSET ?
            `;
        const [items] = await pool.query(stmt, [limit, offset])
        return items;
    } catch (error) {
        console.log(error)
    }
}

modelItems.getItemByCodePatAndConservation = async (pool, id) => {
    try {
        const stmt = `
        SELECT I.CODIGO_PATRIMONIAL, I.DESCRIPCION, I.TRABAJADOR,
            I.DEPENDENCIA, I.UBICACION, I.FECHA_REGISTRO, I.OBSERVACION,
            I.FECHA_ALTA, I.FECHA_COMPRA, I.ESTADO, I.DISPOSICION,
            I.SITUACION, I.CONSERV, C.CONSERV AS EST_CONSERVACION
            FROM item AS I
            INNER JOIN conservacion AS C
            ON I.CONSERV = C.id
            WHERE I.CODIGO_PATRIMONIAL = ?
            `;
        const item = await pool.query(stmt, [id])
        // console.log(item[0])
        return item[0]; // GET THE FIRST ELEMENT [0]
    } catch (error) {
        console.log(error)
        return error;
    }

}

modelItems.findUserByDNI = async (pool, dni) => {
    const stmt = 'SELECT * FROM user_i WHERE dni = ?'
    const getSingleUser = await pool.query(stmt, [dni])
    const user = await getSingleUser
    return user[0];
}

export default modelItems;