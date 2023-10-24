const inquirer = require('inquirer');
const fs = require('fs');

function Init () {
  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add Department', 'Add Employee', 'Add Role', 'Update Department', "Update Employee", 'Update Role', 'View All Departments', 'View All Employees', 'View All Roles', 'Quit' ],
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
        default:
      }
    })
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

      // Create an object with the correct property name for the request body
      const requestData = { departmentName };

      // Send a POST request to the server
      fetch('/api/new-department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Department added successfully.');
          } else {
            console.error('Error adding department.');
          }
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    });
}

const getDepartments = () =>
  fetch('api/departments', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error('Error:', error);
    });

Init()