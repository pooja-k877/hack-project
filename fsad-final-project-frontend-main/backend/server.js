const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// insert data
app.post("/add", (req, res) => {
  const { name, email } = req.body;

  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("Error");
      } else {
        res.send("Saved");
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    if (result.length > 0) {
      res.json({
        success: true,
        user: result[0]
      });
    } else {
      res.json({ success: false });
    }
  });
});

// register user (store in DB)
app.post("/register", (req, res) => {
  const { name, email } = req.body;

  const sql = "INSERT IGNORE INTO users (name, email) VALUES (?, ?)";

  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true });
  });
});

// get data
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// ================= COURSES =================

// add course
app.post("/add-course", (req, res) => {
  const { title, description } = req.body;

  const sql = "INSERT INTO courses (title, description) VALUES (?, ?)";

  db.query(sql, [title, description], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true });
  });
});

// get courses
app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });
});