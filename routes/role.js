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
    db.query('SELECT r.title AS role_title, r.salary, d.department_name FROM role r JOIN department d ON r.department_id = d.id', function (err, results) {
      if (err) {
        reject(err);
      } else {
        // const departmentNames = results.map((department) => department.department_name);
        // const departmentObjects = results.map((department) => ({
        //   id: department.id,
        //   name: department.department_name,
        // }));

        resolve(results);
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

// Export functions for use in other modules
module.exports = {
  getRoles,
  addRoleToDataBase,
};




