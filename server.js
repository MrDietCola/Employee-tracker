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

app.post('/api/new-employee', ({ body }, res) => {
  const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while inserting the role.' });
    } else {
      console.log(results);
      res.json({ message: 'Employee inserted successfully.' });
    }
  });
});

app.post('/api/new-department', ({ body }, res) => {
  const sql = 'INSERT INTO department (department_name) VALUES (?)';
  const params = [body.department_name];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while inserting the role.' });
    } else {
      console.log(results);
      res.json({ message: 'Employee inserted successfully.' });
    }
  });
});


app.get('/departments', (req, res) =>
db.query('SELECT * FROM department', function (err, results) {
  console.log(results)
  res.json({results})
})
);

app.get('/roles', (req, res) =>
db.query('SELECT * FROM role', function (err, results) {
  console.log(results)
  res.json({results})
})
);

app.get('/employees', (req, res) =>
db.query('SELECT * FROM employee', function (err, results) {
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

  app.delete('/api/department/:id', ({params}, res) => {
    const sql = 'DELETE FROM department WHERE id = ?';
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

    app.delete('/api/employee/:id', ({params}, res) => {
      const sql = 'DELETE FROM employee WHERE id = ?';
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

      app.put('/api/edit-employee/:id', (req, res) => {
        // Handle the PUT request here
        const updatedEmployeeData = req.body;
        const { id } = req.params;
        const { first_name, last_name, role_id, manager_id } = updatedEmployeeData;
        
        const sql = 'UPDATE employee SET first_name=?, last_name=?, role_id=?, manager_id=? WHERE id=?';
        const params = [first_name, last_name, role_id, manager_id, id];
        
        db.query(sql, params, (err, results) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while updating the employee.' });
          } else {
            console.log('Employee updated successfully.');
            res.json({ message: 'Employee updated successfully.' });
          }
        });
        
      });

      app.put('/api/edit-role/:id', (req, res) => {
        const updatedRole = req.body;
        const { id } = req.params;
        const { title, salary, department_id } = updatedRole;
        
        const sql = 'UPDATE role SET title=?, salary=?, department_id=? WHERE id=?';
        const params = [title, salary, department_id, id];
        
        db.query(sql, params, (err, results) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while updating the employee.' });
          } else {
            console.log('Employee updated successfully.');
            res.json({ message: 'Employee updated successfully.' });
          }
        });
        
      });

      app.put('/api/edit-department/:id', (req, res) => {
        const updatedDepartment = req.body;
        const { id } = req.params;
        const { department_name } = updatedDepartment;
        
        const sql = 'UPDATE department SET department_name=? WHERE id=?';
        const params = [department_name, id];
        
        db.query(sql, params, (err, results) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while updating the employee.' });
          } else {
            console.log('Employee updated successfully.');
            res.json({ message: 'Employee updated successfully.' });
          }
        });
        
      });

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});
