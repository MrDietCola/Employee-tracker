const employee = require('express').Router();
const mysql = require('mysql2');
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
  console.log(`Connected to the staff_db database.`)
);

employee.get('/', (req, res) => {
  db.query('SELECT * FROM employee', function (err, results) {
    if (err) {
      // Handle the error, e.g., return an error response
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching departments.' });
    } else {
      console.log(results);
      res.json({ results });
    }
  });
});

module.exports = employee;