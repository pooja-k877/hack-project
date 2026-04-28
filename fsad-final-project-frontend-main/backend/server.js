const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= FRONTEND FIRST ================= */

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* ================= BACKEND ROUTES ================= */

// test route (OPTIONAL - keep or remove)
app.get("/api/test", (req, res) => {
  res.send("Backend running 🚀");
});

/* USERS */
app.post("/add", (req, res) => { ... });

app.post("/login", (req, res) => { ... });

app.post("/register", (req, res) => { ... });

app.get("/users", (req, res) => { ... });

/* COURSES */
app.post("/add-course", (req, res) => { ... });

app.get("/courses", (req, res) => { ... });

/* ================= START ================= */

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});