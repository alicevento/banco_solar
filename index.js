//Carga de servidor y definicion de las rutas
const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => console.log("Servidor escuchado en puerto 3000"));

//Importando funcion desde el modulo consultas.js
const {agregar, todos, editar, eliminar, nuevaTransferencia, transferencias, obtenerSaldo} = require("./consultas/consultas.js");
//Importando funcion de manejo de errores handleerrors.js
const { handleErrors } = require("./consultas/handleErrors.js");
//middleware para recibir desde el front como json
app.use(express.json());

//Ruta raiz
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Middleware personalizado para manejar errores
const errorHandler = (error, req, res, next) => {
    if (error.code) {
      const { errorCode, status, message } = handleErrors(error.code);
      console.error("Error:", errorCode, "-", message);
      res.status(status).json({ error: message });
    } else {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Error genérico del servidor" });
    }
  };


//Ruta /usuario POST que recibe los datos con la funcion agregar de un nuevo usuario y los almacena en la base de datos bancosolar
app.post("/usuario", async (req, res, next) => {
    const { nombre, balance } = req.body;
    if (!nombre || !balance) {
      return res.status(400).json({ mensaje: "Se deben agregar todos los datos" });
    }
    try {
      const usuario = await agregar(nombre, balance);
      res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  });

//Ruta /usuarios GET que devuelve todos los usuarios registrados con sus balances
app.get("/usuarios", async (req, res, next) => {
    try {
      const usuarios = await todos();
      res.status(200).json(usuarios);
    } catch (error) {
      next(error);
    }
  });

//Ruta /usuario PUT que recibe los datos modificados de un usuario registrado y los actualiza
app.put("/usuario", async (req, res, next) => {
    const { id, nombre, balance } = req.body;
    if (!id || !nombre || !balance) {
      return res.status(400).json({ mensaje: "Se deben agregar todos los datos" });
    }
    try {
      const usuario = await editar(id, nombre, balance);
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  });

//Ruta /usuario DELETE que recibe el id de un usuario registrado y lo elimina
app.delete("/usuario", async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ mensaje: "Se deben agregar todos los datos" });
    }
    try {
      const usuario = await eliminar(id);
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  });

//Ruta /transferencia post la cual recibe los datos para realizar una nueva transferencia
app.post("/transferencia", async (req, res, next) => {
    const { emisor, receptor, monto } = req.body;
    if (!emisor || !receptor || !monto) {
      return res.status(400).json({ mensaje: "Se deben agregar todos los datos" });
    }
    try {
      const saldoEmisor = await obtenerSaldo(emisor);
      if (saldoEmisor < monto) {
        return res.status(400).json({ mensaje: "El emisor no tiene suficiente saldo para realizar la transferencia" });
      }
      const resultado = await nuevaTransferencia(emisor, receptor, monto);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  });

//Ruta /transferencias GET que devuelve todas las transferencias registradas
app.get("/transferencias", async (req, res, next) => {
    try {
      const resTransferencias = await transferencias(); 
      res.status(200).json(resTransferencias); 
    } catch (error) {
      next(error);
    }
  });


  // Aplicar el middleware de manejo de errores
app.use(errorHandler);