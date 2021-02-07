const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dolph900",
  database: "todo",
});

try {
  connection.connect();
} catch (e) {
  console.log("OOOOPs. Connection to MySQL failed.");
  console.log(e);
}

console.log(connection);

const api = express();

api.use(express.static(__dirname + "/public"));
api.use(bodyParser.json());

// Middleware from scratch
// api.use((req, res, next) => {
//   console.log("hello");
//   next();
// });

api.listen(3000, () => {
  console.log("Api up and running!");
});

api.get("/tasks", (req, res) => {
  connection.query(
    "SELECT * FROM tasks ORDER BY created DESC",
    (error, results) => {
      if (error) return res.json({ error: error });

      res.json(results);
      // res.json({
      //   todo: results.filter((item) => !item.completed),
      //   completed: results.filter((item) => item.completed),
      // });
    }
  );
});
// api.get("/", (req, res) => {
//   res.send("Hello World!");
// });

api.post("/tasks/add", (req, res) => {
  // console.log("Post request recieved");
  // console.log(req.body);
  // res.send("It works!");
  connection.query(
    "INSERT INTO tasks (description) VALUES (?)",
    [req.body.item],
    (error, results) => {
      if (error) {
        return res.json({ error: error });
      }
      connection.query(
        "SELECT LAST_INSERT_ID() FROM tasks",
        (error, results) => {
          if (error) {
            return res.json({ error: error });
          }
          res.json({
            id: results[0]["LAST_INSERT_ID()"],
            description: req.body.item,
          });
        }
      );
    }
  );
});

api.post("/tasks/:id/update", (req, res) => {
  connection.query(
    "UPDATE tasks SET completed = ? WHERE id =?",
    [req.body.completed, req.params.id],
    (error, results) => {
      if (error) return res.json({ error: error });

      res.json({});
    }
  );
});

api.post("/tasks/:id/remove", (req, res) => {
  connection.query(
    "DELETE FROM tasks WHERE id = ?",
    [req.params.item],
    (error, results) => {
      if (error) return res.json({ error: error });

      res.json({});
    }
  );
});

// 1. Serve the app
// 2. Create post route
