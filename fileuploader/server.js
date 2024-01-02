const express = require("express");
const multer = require("multer");
const app = express();
const port = 3000;
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fileuplode",
});

connection.connect();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", upload.single("image"), (req, res) => {
  const img = `/uploads/${req?.file?.filename}`;
  connection.query(`insert into file (image) values(?)`, [img], (err, row) => {
    if (err) {
      throw new Error("An error occured");
    }
     else {
      res.redirect("/");
    }
  });
});

app.listen(port, () => console.log(`port is listening to ${port}`));
