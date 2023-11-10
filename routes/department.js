const mysql = require('mysql2');
const db = mysql.createPool(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
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

async function addDepartmentToDatabase(department) {
  const sql = 'INSERT INTO department (department_name) VALUES (?)';
  return queryAsync(sql, department);
}

// Export the function for use in other modules
module.exports = {
  getDepartments,
  addDepartmentToDatabase,
};

