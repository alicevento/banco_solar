const { Pool } = require('pg');

const pool = new Pool({
    user: 'alice',
    host: 'localhost',
    database: 'bancosolar',
    password: 'Camila',
    port: 5433
});

// Funcion para insertar usuarios a la tabla usuarios
async function agregar (nombre, balance) {
    try {
        const result = await pool.query({ 
            text: 'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *',
            values: [nombre, balance]
        });
        console.log("Registro agregado: ", result.rows[0]);
        return result.rows[0];
    } catch (error) {
        // console.error("Error al agregar el usuario:", error.message);
        throw error; 
    }
}

// agregar();

//Funcion para consultar todos los usuarios con su balance
async function todos () {
    const result = await pool.query("SELECT * FROM usuarios");
    return result.rows;
}

//Funcion para editar el usuario 
async function editar (id, nombre, balance) {
    try {
        const result = await pool.query({
            text: 'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *',
            values: [nombre, balance, id]
        });
        if (result.rows.length > 0) {
            return { mensaje: `Se eliminó el registro con ID ${id}`, status: 200 }; // Devuelve un mensaje indicando que se eliminó el registro
        } else {
            return { mensaje: 'El registro no se encontró o no se pudo eliminar.', status: 404 }; // Mensaje si no se encuentra el registro
        }
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return { mensaje: 'Error genérico del servidor', status: 500 };
    }
}

//Funcion para eliminar el usuario
async function eliminar (id) {
    try {
        const result = await pool.query("DELETE FROM usuarios WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length > 0) {
            return { mensaje: `Se eliminó el registro con ID ${id}` }; // Devuelve un mensaje indicando que se eliminó el registro
        } else {
            return { mensaje: 'El registro no se encontró o no se pudo eliminar.' }; // Mensaje si no se encuentra el registro
        }
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        throw error;
    }
}
//Función para hacer una nueva transferencia
async function nuevaTransferencia(emisorId, receptorId, monto) {
    try {
        // Iniciar una transacción SQL
        await pool.query('BEGIN');

        // Actualizar el balance del emisor
        await pool.query('UPDATE usuarios SET balance = balance - $1 WHERE id = $2', [monto, emisorId]);

        // Actualizar el balance del receptor
        await pool.query('UPDATE usuarios SET balance = balance + $1 WHERE id = $2', [monto, receptorId]);

        // Registrar la transferencia en la tabla transferencias
        const fecha = new Date();
        await pool.query('INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, $4)', [emisorId, receptorId, monto, fecha]);

        // Confirmar la transacción SQL
        await pool.query('COMMIT');

        return { mensaje: 'Transferencia realizada con éxito' };
    } catch (error) {
        // Si ocurre algún error, hacer un rollback de la transacción SQL
        await pool.query('ROLLBACK');
        throw error;
    }
}

//Funcion  /transferencias GET que devuelve todas las transferencias almacenadas en la base de datos en formato de arreglo
async function transferencias () {
    const consulta = `
    SELECT t.fecha, t.monto, e.nombre AS emisor, r.nombre AS receptor 
    FROM transferencias t 
    INNER JOIN usuarios e ON t.emisor = e.id
    INNER JOIN usuarios r ON t.receptor = r.id;
    `;
    const result = await pool.query(consulta);
    return result.rows;
}

module.exports = {agregar, todos, editar, eliminar, nuevaTransferencia, transferencias};