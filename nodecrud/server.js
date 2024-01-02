const express = require("express");
const app = express();
const mysql = require("mysql");
var bodyParser = require("body-parser");
const port = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todos",
});
connection.connect();

// create and update todos
app.post("/", (req, res) => {
  const { title, description, userId } = req.body;
  const query = userId
    ? `UPDATE  todo SET title=?, description=? WHERE id=?`
    : `insert into todo (title,description) values(?,?)`;
  const payload = userId ? [title, description, userId] : [title, description];

  connection.query(query, payload, (error, rows) => {
    try {
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  });
});

// get todos
app.get("/", (req, res) => {
  connection.query(`select * from todo`, (err, rows) => {
    res.render("index", { todos: rows, singleTodo: {} });
  });
});

// fetch single todo
app.get("/singleTodos/:id", (req, res) => {
  const { id } = req.params;
  connection.query(`select * from todo where id = ${id}`, (err, row) => {
    if (err) {
      console.log(err);
    } else {
      connection.query(`select * from todo`, (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          console.log(row[0]);
          res.render("index", { todos: rows, singleTodo: row[0] });
        }
      });
    }
  });
});

// delete todos
app.get("/deleteTodos/:id", (req, res) => {
  const { id } = req.params;
  connection.query(`delete from todo where id = ${id}`, (error, row) => {
    if (error) {
      console.log("error", error);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(port, () => console.log(`app is listening to port ${port}`));
