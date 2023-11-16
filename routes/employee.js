// Import necessary modules
const mysql = require('mysql2');
// Create a database connection pool
const db = mysql.createPool(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
);

// Function to get all employees from database
async function getEmployees() {
  return new Promise((resolve, reject) => {
db.query('SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS role_title, r.salary, CONCAT(m.first_name, m.last_name) AS manager_name FROM employee e JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id', function (err, results) {
      if (err) {
        reject(err);
      } else {
        // Create an array of employees names to use in the prompt
        const employeeNames = results.map((employee) => `${employee.first_name} ${employee.last_name}`);
        // const addEmployeeChoices = employeeNames;
        // addEmployeeChoices.unshift('None')
        resolve({ names: employeeNames, objects: results });
      }
    });
  });
}

// Function to add a department to the database
async function getEmployeeByName(firstName, lastName) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM employee WHERE first_name = ? AND last_name = ?';
    const params = [firstName, lastName];
  
    db.query(sql, params, function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Function to add an employee to the database
async function addEmployeeToDatabase(employee) {
  return new Promise((resolve, reject) => {
  const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
  const params = [employee.first_name, employee.last_name, employee.role_id, employee.manager_id];

  db.query(sql, params, function (err, results) {
    if (err) {
      reject(err);
    } else {
      resolve(results);
    }
  });
});
}

// Function to update an employees role
async function updateEmployeeRole(employee) {
  return new Promise((resolve, reject) => {
  const sql = 'UPDATE employee SET first_name=?, last_name=?, role_id=?, manager_id=? WHERE id=?';
  const params = [employee.first_name, employee.last_name, employee.role_id, employee.manager_id, employee.id];

  db.query(sql, params, function (err, results) {
    if (err) {
      reject(err);
    } else {
      resolve(results);
    }
  });
});
}

// Function to remove employee from database
async function removeEmployeeFromDatabase(employee) {
  return new Promise((resolve, reject) => {
  const sql = 'DELETE FROM employee WHERE id = ?';

  db.query(sql, employee, function (err, results) {
    if (err) {
      reject(err);
    } else {
      resolve(results);
    }
  });
});
}

// Export the function for use in other modules
module.exports = {
  getEmployees,
  addEmployeeToDatabase,
  getEmployeeByName,
  updateEmployeeRole, 
  removeEmployeeFromDatabase
};

