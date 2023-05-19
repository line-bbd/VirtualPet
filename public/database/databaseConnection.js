const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "testUser",
  password: "Password@123",
  database: "VirtualPetDB",
});

connection.connect();
connection.query("SELECT * From Users", (err, rows, fields) => {
  if (err) throw err;

  for (let row of rows) {
    console.log(row);
  }
});

connection.end();
