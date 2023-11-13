const mysql = require('mysql2');
const db = mysql.createPool(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
);

async function getRoles() {
  return new Promise((resolve, reject) => {
    db.query('SELECT r.title AS role_title, r.salary, d.department_name, r.id FROM role r JOIN department d ON r.department_id = d.id', function (err, results) {
      if (err) {
        reject(err);
      } else {
        const roleNames = results.map((role) => role.role_title);
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
    // Insert the new role into the database using the provided data
    const params = [roleData.title, roleData.salary, roleData.departmentId];

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




