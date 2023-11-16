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

// Function to get all roles
async function getRoles() {
  return new Promise((resolve, reject) => {
    db.query('SELECT r.title AS role_title, r.salary, d.department_name, r.id FROM role r JOIN department d ON r.department_id = d.id', function (err, results) {
      if (err) {
        reject(err);
      } else {
        // Create an array of just the names of all the roles to use in prompts
        const roleNames = results.map((role) => role.role_title);
        // Create an array of objects including only the title, salary and department name for displaying on tables
        const viewAllRoles = results.map((role) => ({
          title: role.role_title,
          salary: role.salary,
          department: role.department_name

        }))
        resolve({ names: roleNames, viewAll: viewAllRoles, objects: results });
      }
    });
  });
}

async function addRoleToDataBase(roleData) {
  return new Promise((resolve, reject) => {
    const params = [roleData.title, roleData.salary, roleData.departmentId];
    // Insert the new role into the database using the provided data
    db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', params, function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function removeRoleFromDatabase(role) {
  return new Promise((resolve, reject) => {
  const sql = 'DELETE FROM role WHERE id = ?';
  // Remove the role from database using the provided data
  db.query(sql, role, function (err, results) {
    if (err) {
      reject(err);
    } else {
      resolve(results);
    }
  });
});
}

// Export functions for use in other modules
module.exports = {
  getRoles,
  addRoleToDataBase,
  removeRoleFromDatabase
};




