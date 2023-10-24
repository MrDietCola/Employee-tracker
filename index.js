const inquirer = require('inquirer');
const mysql = require('mysql2');
const department = require('./routes/department');
const { log, table } = require('console');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
  console.log(`Connected to the staff_db database.`)
);


function init () {
  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add Department', 'Add Employee', 'Add Role', 'Update Department', "Update Employee", 'Update Role', 'View All Departments', 'View All Employees', 'View All Roles', 'Remove Department', 'Remove Employee', 'Remove Role','Quit' ],
        name: 'option'
      }
    ])
    .then(({option}) => {
      switch (option) {
        case 'Add Department':
          addDepartment()
          break;
        case 'Add Employee':

          break;
        case 'Add Role':

          break;
        case 'Update Department':
          // updateDepartment()
          break;
        case 'Update Employee':

          break;
        case 'Update Role':

          break;
        case 'View All Departments':
          getDepartments()
          break;
        case 'View All Employees':

          break;
        case 'View All Roles':

          break;
        case 'Remove Department':
          removeDepartment()
          break;
        case 'Remove Employee':

          break;
        case 'Remove Role':

          break;
        default:
      }
    })
}

init();

function getDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    if (err) {
      // Handle the error, e.g., return an error response
      console.error(err);
    } else {
      console.table(results)

      init()
    }
  });
}

function addDepartment() {
  return inquirer
  .prompt([
    {
      type: 'input',
      message: 'Please enter the name of the department',
      name: 'departmentName',
    },
  ])
  .then(({ departmentName }) => {
    console.log(`Adding department: ${departmentName}`);

    const sql = 'INSERT INTO department (department_name) VALUES (?)';
    db.query(sql, departmentName, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log(results);
      }
    })
    getDepartments()
  })
}

function removeDepartment() {
  const departments = []
  db.query('SELECT department_name FROM department', function (err, results) {
    if (err) {
      // Handle the error, e.g., return an error response
      console.error(err);
    } else {
      results.forEach(department => {
        departments.push(department.department_name);
      });
      inquirer
        .prompt([
          {
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departments, // Use the departments array as choices
            name: 'removeDep',
          },
        ])
        .then(({ removeDep }) => {
          console.log(`Removing department: ${removeDep}`);

          // Now, you can write the query to delete the department
          const sql = 'DELETE FROM department WHERE department_name = ?';
          db.query(sql, removeDep, function (err, results) {
            if (err) {
              console.error(err);
              init()
            } else {
              console.log('Department removed.');
              // console.log(getDepartments()); // You may want to call a function to update the department list
              init()
            }
          });
        });
    }
  });
}
