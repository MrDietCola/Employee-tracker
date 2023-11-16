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

// Function to get all departments from database
async function getDepartments() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM department', function (err, results) {
      if (err) {
        reject(err);
      } else {
        // Create an array of department names to use in the prompt
        const departmentNames = results.map((department) => department.department_name);
        resolve({ names: departmentNames, objects: results });
      }
    });
  });
}

// Function to add a department to the database
async function addDepartmentToDatabase(department) {
  return new Promise((resolve, reject) => {
  const sql = 'INSERT INTO department (department_name) VALUES (?)';
  const params = department;
// Add department based off provided data
  db.query(sql, params, function (err, results) {
    if (err) {
      reject(err);
    } else {
      resolve(results);
    }
  });
});
}

// Function to remove a department to the database
async function removeDepartmentFromDatabase(department) {
  return new Promise((resolve, reject) => {
  const sql = 'DELETE FROM department WHERE id = ?';
  // Add department based off provided data
  db.query(sql, department, function (err, results) {
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
  getDepartments,
  addDepartmentToDatabase,
  removeDepartmentFromDatabase
};

