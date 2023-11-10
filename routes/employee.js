const mysql = require('mysql2');
const db = mysql.createPool(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
);

async function getEmployees() {
  return new Promise((resolve, reject) => {
db.query('SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS role_title, r.salary, CONCAT(m.first_name, m.last_name) AS manager_name FROM employee e JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id',     function (err, results) {
      if (err) {
        reject(err);
      } else {
        const employeeNames = results.map((employee) => ({ 
          first: employee.first_name,
          last: employee.last_name,
         }));

        resolve({ names: employeeNames, objects: results });
      }
    });
  });
}

async function addEmployeeToDatabase(employee) {
  const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';  
  return queryAsync(sql, employee);
}

// Export the function for use in other modules
module.exports = {
  getEmployees,
  addEmployeeToDatabase,
};

