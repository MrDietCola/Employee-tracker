const inquirer = require('inquirer');
const mysql = require('mysql2');

const departmentModule = require('./routes/department');
const roleModule = require('./routes/role');
const employeeModule = require('./routes/employee');

const db = mysql.createPool(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
  console.log(`Connected to the staff_db database.`)
);

function init() {
  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all Employees',
          'Add Employee',
          'Update Employee Role',
          'View All Roles',
          'Add Role',
          'View All Departments',
          'Add Department',
          'Remove Department',
          'Remove Employee',
          'Remove Role',
          'Quit'
        ],
        name: 'option'
      }
    ])
    .then(({ option }) => {
      switch (option) {
        case 'View all Employees':
          viewAllEmployees();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Remove Department':
          removeDepartment();
          break;
        case 'Remove Employee':
          removeEmployee();
          break;
        case 'Remove Role':
          removeRole();
          break;
        case 'Quit':
          console.log('Goodbye!');
          process.exit(0);
        default:
          console.log('Invalid option. Please choose a valid option.');
          init();
      }
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });
}

async function viewAllEmployees() {
  try {
    const employees = await employeeModule.getEmployees();
    console.table(employees.objects)
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function viewAllRoles() {
  try {
    const roles = await roleModule.getRoles();
    console.table(roles.viewAll)
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function viewAllDepartments() {
  try {
    const departments = await departmentModule.getDepartments();
    console.table(departments.names)
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function addDepartment() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        message: 'Please enter the name of the department',
        name: 'departmentName',
      },
    ]);
    
    await departmentModule.addDepartmentToDatabase(answers.departmentName);
    
    console.log(`Department: ${answers.departmentName} added successfully`);
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function addRole() {
  try {
    // Fetch departments from the database
    const { names, objects } = await departmentModule.getDepartments();
    
    // Execute the database query and then prompt the user
    const answers = await inquirer.prompt([
      {
        type: 'input',
        message: 'Enter the name of the role:',
        name: 'title',
      },
      {
        type: 'number',
        message: 'Enter the salary for the role:',
        name: 'salary',
      },
      {
        type: 'list',
        message: 'Choose a department',
        choices: names,
        name: 'department',
      },
    ]);
    
    const department = objects.find((dep) => dep.name === answers.department);

    // Create an object with the role information
    const roleData = {
      title: answers.title,
      salary: answers.salary,
      departmentId: department.id,
    };
    
    // Insert the new role into the database
    await roleModule.addRoleToDataBase(roleData);
    
    console.log('Role successfully added');
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function addEmployee() {
  try {
    const employees = await employeeModule.getEmployees();
    const positions = await roleModule.getRoles()

    const employeeData = await inquirer.prompt([
      {
        type: 'input',
        message: 'First name?',
        name: 'first_name',
      },
      {
        type: 'input',
        message: 'Last name?',
        name: 'last_name',
      },
      {
        type: 'list',
        message: 'Choose a role',
        choices: positions.names,
        name: 'position',
      },
      {
        type: 'list',
        message: 'Choose a manager',
        choices: employees.add,
        name: 'manager',
      },
    ]);

    const role = positions.objects.find((role) => role.role_title === employeeData.position);
    const manager = employees.objects.find((employee) => `${employee.first_name} ${employee.last_name}` === employeeData.manager);

    const employee = {
      first_name: employeeData.first_name,
      last_name: employeeData.last_name,
      role_id: role.id,
      manager_id: manager.employee_id
    };

    await employeeModule.addEmployeeToDatabase(employee);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function updateEmployeeRole() {
  try {
    const employees = await employeeModule.getEmployees();
    const positions = await roleModule.getRoles()

    const employeeData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which employee would youl like to update?',
        choices: employees.names,
        name: 'employee',
      },
    ]);

    const currentEmployee = employees.objects.find((employee) => `${employee.first_name} ${employee.last_name}` === employeeData.employee);
    const possiblePositions = [];
    for (let i = 0; i < positions.objects.length; i++) {
      if (positions.objects[i].role_title !== currentEmployee.role_title) {
        possiblePositions.push(positions.objects[i].role_title)
      }
    }
    const employeeinfo = await employeeModule.getEmployeeByName(currentEmployee.first_name, currentEmployee.last_name)

    const updatedRoleData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which role would you like to assign the employee?',
        choices: possiblePositions,
        name: 'position',
      },
    ]);

    const role = positions.objects.find((role) => role.role_title === updatedRoleData.position);
    const employee = {
      first_name: employeeinfo[0].first_name,
      last_name: employeeinfo[0].last_name,
      role_id: role.id,
      manager_id: employeeinfo[0].manager_id,
      id: employeeinfo[0].id,
    }
    await employeeModule.updateEmployeeRole(employee);
    console.log('Employee Updated')
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

init();



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
            choices: departments, 
            name: 'removeDep',
          },
        ])
        .then(({ removeDep }) => {
          console.log(`Removing department: ${removeDep}`);

          const sql = 'DELETE FROM department WHERE department_name = ?';
          db.query(sql, removeDep, function (err, results) {
            if (err) {
              console.error(err);
              init()
            } else {
              console.log('Department removed.');
              init()
            }
          });
        });
    }
  });
}






// function updateDepartment() {
//   const departments = []
//   let departmentsArray;
//   db.query('SELECT * FROM department', function (err, results) {
//     if (err) {
//       // Handle the error, e.g., return an error response
//       console.error(err);
//     } else {
//       departmentsArray = results
//       results.forEach(department => {
//         departments.push(department.department_name);
//       });
//       inquirer
//         .prompt([
//           {
//             type: 'list',
//             message: 'Which department would you like to update?',
//             choices: departments, 
//             name: 'updateDep',
//           },
//           {
//             type: 'input',
//             message: 'What would you like to change the name too?',
//             name: 'newName',
//           },
//         ])
//         .then((update) => {
//           console.log(`Updating department: ${update.updateDep}`);

//           let params;
//           const sql = 'UPDATE department SET department_name=? WHERE id=?';
//           for (let index = 0; index < results.length; index++) {
//             const element = departmentsArray[index].department_name;
//             if (element === update.updateDep) {
//               params = [update.newName, departmentsArray[index].id]  
//             }
//           }           
//           db.query(sql, params, (err, results) => {
//             if (err) {
//               console.error(err);
//             } else {
//               console.log('Department updated successfully.');
//               init()
//             }
//           })
//         })
//     }
//   })
// }



// function removeEmployee() {
//   const employees = []
//   let employeesArray;
//   db.query('SELECT * FROM employee', function (err, results) {
//     if (err) {
//       // Handle the error, e.g., return an error response
//       console.error(err);
//     } else {
//       employeesArray = results;
//       results.forEach(employee => {
//         employees.push(`${employee.first_name} ${employee.last_name}`);
//       });
//       inquirer
//         .prompt([
//           {
//             type: 'list',
//             message: 'Which employee would you like to remove?',
//             choices: employees, 
//             name: 'removeEmp',
//           },
//         ])
//         .then((employee) => {
//           console.log(`Removing employee: ${employee.removeEmp}`);

//           const sql = 'DELETE FROM employee WHERE id = ?';
//           let params;

//           for (let index = 0; index < employeesArray.length; index++) {
//             const element = `${employeesArray[index].first_name} ${employeesArray[index].last_name}`;
//             if (element === employee.removeEmp) {
//               params = [employeesArray[index].id]
//             }            
//           }

//           db.query(sql, params, function (err, results) {
//             if (err) {
//               console.error(err);
//               init()
//             } else {
//               console.log('Employee removed.');
//               getEmployees()
//             }
//           });
//         });
//     }
//   });
// }

// function updateEmployee() {
//   let employeeToUpdate;
//   inquirer
//   .prompt([
//     {
//       type: 'list',
//       message: 'Select an employee to update:',
//       choices: employeeList,
//       name: 'employeeToUpdate',
//     },

//   ])
//     .then((employee) => {
//       employeeToUpdate = employee.employeeToUpdate;
//       const updatedEmployees = employeeList.filter((employee) => employee !== employeeToUpdate)
//       inquirer
//         .prompt([
//           {
//             type: 'input',
//             message: 'Enter the updated first name:',
//             name: 'updatedFirstName',
//           },
//           {
//             type: 'input',
//             message: 'Enter the updated last name:',
//             name: 'updatedLastName',
//           },
//           {
//             type: 'list',
//             message: 'Pick a new role',
//             choices: roles,
//             name: 'updatedRole',
//           },
//           {
//             type: 'list',
//             message: 'Choose a manager',
//             choices: updatedEmployees,
//             name: 'updatedManager',
//           },
//         ])
//           .then((updatedEmployeeInfo) => {
//             let newRole = roleDataArray.filter((role) => role.title === updatedEmployeeInfo.updatedRole)
//             const newManagerIdString = updatedEmployeeInfo.updatedManager.match(/\d+/g);
//             const newManageId = newManagerIdString.map(number => parseInt(number, 10));
//             const employeeIdString = employeeToUpdate.match(/\d+/g);
//             const employeeId = employeeIdString.map(number => parseInt(number, 10));
//             let params = [updatedEmployeeInfo.updatedFirstName, updatedEmployeeInfo.updatedLastName, newRole[0].id, newManageId, employeeId];
            
//             db.query('UPDATE employee SET first_name=?, last_name=?, role_id=?, manager_id=? WHERE id=?', params, (err, results) => {
//               if (err) {
//                 console.error(err);
//               } else {
//                 console.log('Employee updated successfully.');
//                 init()
//               }
//         })
//           })    
//     })
// }



// function removeRole() {
//   return inquirer
//   .prompt([
//     {
//       type: 'list',
//       message: 'Which role would you like to remove?',
//       choices: roles,
//       name: 'roleRemove',
//     },
//   ])
//   .then(({roleRemove}) => {
//     const param = roleDataArray.filter((role) => role.title === roleRemove);
//     db.query('DELETE FROM role WHERE id = ?', param[0].id,  function (err, results) {
//           if (err) {
//             res.statusMessage(400).json({err: err})
//           } else if (!results.affectedRows) {
//             console.log({message: 'Id not found'});
//           } else {
//             console.log('Role successfully removed')
//             init()
//           }
//         })
//   })
// }

// function updateRole() {
//   let roleToUpdate;
//   return inquirer
//   .prompt([
//     {
//       type: 'list',
//       message: 'Which role would you like to update?',
//       choices: roles,
//       name: 'roleUpdate',
//     },
//   ])
//   .then(({roleUpdate}) => {
//     roleToUpdate = roleUpdate;
//     inquirer
//     .prompt([
//       {
//         type: 'input',
//         message: 'Enter the updated role title:',
//         name: 'newTitle',
//       },
//       {
//         type: 'number',
//         message: 'Enter the updated salary:',
//         name: 'newSalary',
//       },
//       {
//         type: 'list',
//         message: 'Pick a new department',
//         choices: departments,
//         name: 'newDepartment',
//       },
//     ])
//     .then ((response) => {
//       const roleId = roleDataArray.filter((role) => role.title === roleToUpdate)
//       const departmentId = departmentDataArray.filter((department) => department.department_name === response.newDepartment);
//       const params = [response.newTitle, response.newSalary, departmentId[0].id, roleId[0].id]
//       db.query('UPDATE role SET title=?, salary=?, department_id=? WHERE id=?', params,  function (err, results) {
//         if (err) {
//           console.log(err);
//         } else if (!results.affectedRows) {
//           console.log({message: 'Id not found'});
//           init()
//         } else {
//           console.log('Role successfully updated')
//           init()
//         }
//       })
//     })
//   })
// }
