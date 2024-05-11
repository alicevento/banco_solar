//Carga de servidor y definicion de las rutas
const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => console.log("Servidor escuchado en puerto 3000"));

//Importando funcion desde el modulo consultas.js
const {agregar, todos, editar, eliminar, nuevaTransferencia, transferencias} = require("./consultas/consultas.js");
//Importando funcion de manejo de errores handleerrors.js
const { handleErrors } = require("./consultas/handleErrors.js");
//middleware para recibir desde el front como json
app.use(express.json());

//Ruta raiz
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Ruta /usuario POST que recibe los datos con la funcion agregar de un nuevo usuario y los almacena en la base de datos bancosolar
app.post("/usuario", async (req, res) => {
  const { nombre, balance } = req.body;
  //verificar si se pasó el nombre y balance en la solicitud
  if (!nombre || !balance) {
    res.status(400).json({ mensaje: "Se deben agregar todos los datos" });
  } else {
    try {
      const usuario = await agregar(nombre, balance);
      res.status(201).json(usuario);
    } catch (error) {
      // Verificar si el error tiene un código asociado y manejarlo
      if (error.code) {
        const { errorCode, status, message } = handleErrors(error.code); // Obtener el mensaje de error personalizado
        console.error(
          "Error al agregar el usuario.",
          "Código de error: ",
          errorCode,
          "-",
          message
        ); // Mostrar código de error y mensaje de error
        res.status(status).json({ error: message });
      } else {
        // Si el error no tiene un código, mostrar un mensaje genérico
        console.error("Error al agregar el usuario:", error.message);
        res.status(500).json({ error: "Error genérico del servidor" });
      }
    }
  }
});

//Ruta /usuarios GET que devuelve todos los usuarios registrados con sus balances
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await todos();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al consultar los usuarios:", error);
    res.status(500).json({ error: "Error genérico del servidor" });
  }
});

//Ruta /usuario PUT que recibe los datos modificados de un usuario registrado y los actualiza
app.put("/usuario", async (req, res) => {
  const { id, nombre, balance } = req.body;
  if (!id || !nombre || !balance) {
    res.status(400).json({ mensaje: "Se deben agregar todos los datos" });
  } else {
    try {
      const usuario = await editar(id, nombre, balance);
      res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al editar el usuario:", error);
      res.status(500).json({ error: "Error genérico del servidor" });
    }
  }
});

//Ruta /usuario DELETE que recibe el id de un usuario registrado y lo elimina
app.delete("/usuario", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ mensaje: "Se deben agregar todos los datos" });
  } else {
    try {
      const usuario = await eliminar(id);
      res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).json({ error: "Error genérico del servidor" });
    }
  }
});

//Ruta /transferencia post la cual recibe los datos para realizar una nueva transferencia
app.post("/transferencia", async (req, res) => {
  const { emisor, receptor, monto } = req.body;
  if (!emisor || !receptor || !monto) {
    res.status(400).json({ mensaje: "Se deben agregar todos los datos" });
  }
  try {
    const resultado = await nuevaTransferencia(emisor, receptor, monto);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al realizar la transferencia:", error.message);
    res.status(500).json({ error: "Error al hacer la transferencia" });
  }
});


//Ruta /transferencias GET que devuelve todas las transferencias registradas
app.get("/transferencias", async (req, res) => {
    try {
      const resTransferencias = await transferencias(); 
      res.status(200).json(resTransferencias); 
    } catch (error) {
      console.error("Error al consultar las transferencias:", error.message);
      res.status(500).json({ error: "Error genérico del servidor" });
    }
  });