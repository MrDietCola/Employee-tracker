const express = require('express');
const mysql = require('mysql2');
const api = require('./routes/index'); 


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
  console.log(`Connected to the staff_db database.`)
);

// app.get('/', (req, res) =>
// db.query('SELECT * FROM staff_db', function (err, results) {
//   console.log(results)
//   res.json({results})
// })
// );

// app.post('/api/new-movie', (req, res) =>
// db.query('INSERT INTO movies (movie_name) VALUES ("Us")', function (err, results) {
//   console.log(results)
//   res.json({results})
// })
// );

app.post('/api/new-role', ({ body }, res) => {
  const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  const params = [body.title, body.salary, body.department_id];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while inserting the role.' });
    } else {
      console.log(results);
      res.json({ message: 'Role inserted successfully.' });
    }
  });
});


app.get('/department', (req, res) =>
db.query('SELECT * FROM department', function (err, results) {
  console.log(results)
  res.json({results})
})
);

app.get('/role', (req, res) =>
db.query('SELECT * FROM role', function (err, results) {
  console.log(results)
  res.json({results})
})
);


app.delete('/api/role/:id', ({params}, res) => {
  const sql = 'DELETE FROM role WHERE id = ?';
  const param = [params.id]
  
  db.query(sql, param,  function (err, results) {
    if (err) {
      res.statusMessage(400).json({err: err})
    } else if (!results.affectedRows) {
      res.json({message: 'id not found'})
    } else {
      console.log(results)
      res.json({results, message: "success"})
    }
  })
  });

// db.query('SELECT * FROM movies', function (err, results) {
//   console.log(results);
// });

// db.query('SELECT * FROM reviews', function (err, results) {
//   console.log(results);
// });

// db.query('INSERT INTO role (title, salary, department_id) VALUES (?)', ("CMO", 165000, 3) , function (err, results) {
//   console.log(results);
//   console.log(err);
// });

// db.query('DELETE FROM movies WHERE id = ?', 1,  function (err, results) {
//   console.log(results);
// });

// db.query('SELECT * FROM movies join reviews ON movies.id = reviews.movie_id', 1,  function (err, results) {
//   console.log(results);
// });

// db.query('SELECT movies FROM movie_name join reviews ON movies.id = reviews.movie_id', 1,  function (err, results) {
//   console.log(results);
// });

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});
