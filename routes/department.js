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

async function getDepartments() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM department', function (err, results) {
      if (err) {
        reject(err);
      } else {
        const departmentNames = results.map((department) => department.department_name);
        const departmentObjects = results.map((department) => ({
          id: department.id,
          name: department.department_name,
        }));

        resolve({ names: departmentNames, objects: departmentObjects });
      }
    });
  });
}


// Export the function for use in other modules
module.exports = getDepartments;

// department.get('/', (req, res) => {
//   db.query('SELECT * FROM department', function (err, results) {
//     if (err) {
//       // Handle the error, e.g., return an error response
//       console.error(err);
//       res.status(500).json({ error: 'An error occurred while fetching departments.' });
//     } else {
//       console.log(results);
//       res.json({ results });
//     }
//   });
// });

// department.post('/', ({ body }, res) => {
//   const sql = 'INSERT INTO department (department_name) VALUES (?)';
//   const params = [body.department_name];

//   db.query(sql, params, function (err, results) {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ error: 'An error occurred while inserting the role.' });
//     } else {
//       console.log(results);
//       res.json({ message: 'Department inserted successfully.' });
//     }
//   });
// });

// department.delete('/:id', ({params}, res) => {
//   const sql = 'DELETE FROM department WHERE id = ?';
//   const param = [params.id]
  
//   db.query(sql, param,  function (err, results) {
//     if (err) {
//       res.statusMessage(400).json({err: err})
//     } else if (!results.affectedRows) {
//       res.json({message: 'id not found'})
//     } else {
//       console.log(results)
//       res.json({results, message: "success"})
//     }
//   })
// });


// department.put('/:id', (req, res) => {
//     const updatedDepartment = req.body;
//     const { id } = req.params;
//     const { department_name } = updatedDepartment;
    
//     const sql = 'UPDATE department SET department_name=? WHERE id=?';
//     const params = [department_name, id];
    
//     db.query(sql, params, (err, results) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ error: 'An error occurred while updating the department.' });
//       } else {
//         console.log('department updated successfully.');
//         res.json({ message: 'department updated successfully.' });
//       }
//     });
    
//   });

// module.exports = department;