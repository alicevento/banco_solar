const { Pool } = require('pg');

const pool = new Pool({
    user: 'alice',
    host: 'localhost',
    database: 'bancosolar',
    password: 'Camila',
    port: 5433
});

// Funcion para insertar registros en la tabla repertorio

async function agregar (titulo, artista, tono) {
    console.log("Valores recibidos: ", titulo, artista, tono);
    try {
        const result = await pool.query({ 
            text: 'INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3) RETURNING *',
            values: [titulo, artista, tono]
        });
        console.log("Registro agregado: ", result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al agregar la canción:", error);
        throw error; // relanza el error para que pueda ser manejado en el archivo index.js
    }
}

//Funcion para ver todos los ingresos
async function todos () {
    const result = await pool.query("SELECT * FROM canciones");
    return result.rows;
}

//funcion para eliminar un registro según su nombre recibido como un query.string
async function eliminar(id) {
    try {
        const result = await pool.query("DELETE FROM canciones WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length > 0) {
            return { mensaje: `Se eliminó el registro con ID ${id}` }; // Devuelve un mensaje indicando que se eliminó el registro
        } else {
            return { mensaje: 'El registro no se encontró o no se pudo eliminar.' }; // Mensaje si no se encuentra el registro
        }
    } catch (error) {
        console.error("Error al eliminar la canción:", error);
        throw error;
    }
}

//funcion para editar un registro
async function editar(id, titulo, artista, tono) {
    const result = await pool.query("UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4 RETURNING *", [titulo, artista, tono, id]);
    return result.rows[0];
}

// //funcion para consultar por un registro
// async function consultar (nombre) {
//     const result = await pool.query("SELECT * FROM canciones WHERE titulo = $1", [titulo]);
//     if (result.rows.length > 0) {
//         return { encontrado: true, titulo: result.rows[0] };
//     } else {
//         return { encontrado: false };
//     }
// }


module.exports = {agregar, todos, eliminar, editar};