const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "testdb",
  port: 3307   // 👈 ADD THIS
});

db.connect((err) => {
  if (err) {
    console.log("DB Error", err);
  } else {
    console.log("DB Connected");
  }
});

module.exports = db;