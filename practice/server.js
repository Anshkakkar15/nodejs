const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

connection.connect();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  connection.query("select * from crud", (err, result) => {
    if (err) {
      throw new Error("OOPS some error occured", err);
    } else {
      res.render("index", { data: result, single: {} });
    }
  });
});

// create or update
app.post("/", upload.single("image"), (req, res) => {
  const { title, description, hiddenId } = req.body;
  const img = req.file && `/uploads/${req.file.filename}`;
  const query = hiddenId
    ? `update crud SET title=? ,description=?,image=?  where id=${hiddenId}`
    : "insert into crud (title,description,image) values(?,?,?)";

  const data = hiddenId ? [title, description, img] : [title, description, img];

  connection.query(query, data, (err, result) => {
    if (err) {
      throw new Error("OOPS some error occured", err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/deleteNote/:id", (req, res) => {
  const { id } = req.params;
  connection.query(`delete from crud where id = ${id}`, (err, result) => {
    if (err) {
      throw new Error("OOPS some error occured", err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/singleNote/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `select * from crud where id = ${id}`,
    (err, singleResult) => {
      if (err) {
        throw new Error("OOPS some error occured", err);
      } else {
        connection.query("select * from crud", (err, result) => {
          if (err) {
            throw new Error("OOPS some error occured", err);
          } else {
            res.render("index", { single: singleResult[0], data: result });
          }
        });
      }
    }
  );
});

app.listen(port, () => console.log(`app is running on ${port}`));
