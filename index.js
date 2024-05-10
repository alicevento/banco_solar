//Carga de servidor y definicion de las rutas
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => console.log("Servidor escuchado en puerto 3000"));

//Importando funcion desde el modulo consultas.js
const { agregar, todos, eliminar, editar} = require('./consultas/consultas.js');
//Importando funcion de manejo de errores handleerrors.js
const { handleErrors } = require('./consultas/handleErrors.js');
//middleware para recibir desde el front como json
app.use(express.json());

//Ruta raiz
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});