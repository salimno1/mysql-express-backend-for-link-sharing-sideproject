import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "Salim",
  password: "Nipsey2020",
  database: "linqr",
});
