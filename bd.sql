CREATE DATABASE candidatos;
\c candidatos;

CREATE TABLE candidatos (
id SERIAL PRIMARY KEY,
nombre VARCHAR(255) NOT NULL,
foto VARCHAR(255) NOT NULL,
color VARCHAR(20) NOT NULL
);
CREATE TABLE historial (
id SERIAL PRIMARY KEY,
estado VARCHAR(255) NOT NULL,
cantidad_votos INT NOT NULL,
candidato_ganador VARCHAR(255) NOT NULL
);

\dt 

SELECT * FROM candidatos;
SELECT * FROM historial;