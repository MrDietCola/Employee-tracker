const mysql = require('mysql2');
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
);

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

// Export functions for use in other modules
module.exports = {
  addRoleToDataBase,
};




