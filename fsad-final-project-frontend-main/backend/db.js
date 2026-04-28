const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "sql107.infinityfree.com",
  user: "if0_41773410",
  password: "1234",
  database: "if0_41773410_testdb",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log("DB Error", err);
  } else {
    console.log("DB Connected ✅");
  }
});

module.exports = db;