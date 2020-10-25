const mysql = require("mysql");
const { promisify } = require("util"); //Esto es un módulo para poder trabajar con promesas, porque el modulo de mysql no soporta las promesas y por tanto no soporta async await
require('dotenv').config();

const { database } = require("./keys");

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("DATABASE HAS TOO MANY CONNECTIONS");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("DATABASE CONNECTION WAS REFUSED");
    }
  }

  if (connection) connection.release();
  console.log("DB is Connected");
  console.log(process.env.DATABASE);
  return;
});

//Promisify pool querys, convirtiendo en promesas lo que antes eran callbacks
pool.query = promisify(pool.query);

module.exports = pool;
