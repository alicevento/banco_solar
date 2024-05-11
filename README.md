# Banco Solar

Este es un desafío diseñado para evaluar las habilidades en el desarrollo de un servidor con Express y PostgreSQL, así como también las capacidades para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en una base de datos.

## Descripción ⚙️

El Banco Solar ha decidido invertir en el desarrollo de un nuevo sistema de transferencias y ha convocado a un equipo de desarrolladores Full Stack para llevar a cabo este proyecto. El objetivo es construir un servidor con Node.js que utilice PostgreSQL para la gestión y persistencia de datos, simulando un sistema de transferencias entre usuarios.

## Requerimientos 🚀

1. Utilizar el paquete `pg` para conectarse a PostgreSQL y realizar consultas DML para la gestión y persistencia de datos.
2. Usar transacciones SQL para realizar el registro de las transferencias.
3. Servir una API RESTful en el servidor con los datos de los usuarios almacenados en PostgreSQL.
4. Capturar los posibles errores que puedan ocurrir a través de bloques `catch` o parámetros de funciones `callbacks` para condicionar las funciones del servidor.
5. Devolver correctamente los códigos de estado según las diferentes situaciones.

## Pre-requisitos 📋

1. Clona este repositorio en tu máquina local.
2. Abre una terminal y navega hasta el directorio del proyecto.
3. Instala las dependencias ejecutando el siguiente comando:

   npm install

## Despliegue 📦

Para desplegar este proyecto, asegúrate de tener una base de datos PostgreSQL configurada correctamente con los datos que contiene el archivo de configuración. Sigue estos pasos:

1. Ejecuta el script proporcionado de nuestra base de datos para crear la base de datos y la tabla necesaria.
2. Modifica el archivo de configuración para establecer la conexión a tu base de datos PostgreSQL según tu entorno local.
3. Ejecuta el proyecto con el siguiente comando:

   nodemon index.js

## Construido con 🛠️

- Node.js - Entorno de ejecución de JavaScript.
- PostgreSQL - Sistema de gestión de bases de datos relacional.

## Autor ✒️

Alicia Vento