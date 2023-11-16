// Import necessary modules
const inquirer = require('inquirer');
const mysql = require('mysql2');

const departmentModule = require('./routes/department');
const roleModule = require('./routes/role');
const employeeModule = require('./routes/employee');

// Create a database connection pool
const db = mysql.createPool(
  {
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'staff_db'
  },
  console.log(`Connected to the staff_db database.`)
);

// Function to initialize the application
async function init() {
  return inquirer
  // Prompt the user to choose an action
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
        // Switch based on user's choice
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

// Function to view all employees
async function viewAllEmployees() {
  try {
    // Retrieve employees and display in a table
    const employees = await employeeModule.getEmployees();
    console.table(employees.objects)
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Function to view all roles
async function viewAllRoles() {
  try {
    // Retrieve roles and display in a table
    const roles = await roleModule.getRoles();
    console.table(roles.viewAll)
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Function to view all departments
async function viewAllDepartments() {
  try {
    // Retrieve departmentss and display in a table
    const departments = await departmentModule.getDepartments();
    console.table(departments.names)
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Function to add a new department
async function addDepartment() {
  try {
    // Prompt for user to create department name
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

// Function to add a new role
async function addRole() {
  try {
    // Fetch departments from the database
    const { names, objects } = await departmentModule.getDepartments();
    
    // Prompt for user to create new role
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
    
    // Get department id to create new role
    const department = objects.find((dep) => dep.department_name === answers.department);
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

// Function to add new employee
async function addEmployee() {
  try {
    // Fetch employees and roles from database
    const employees = await employeeModule.getEmployees();
    const positions = await roleModule.getRoles()
    const managers = ['None']
    for (let i = 0; i < employees.names.length; i++) {
      managers.push(employees.names[i])
    }
    console.log(managers);
    // Prompt for user to create employee
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
        choices: managers,
        name: 'manager',
      },
    ]);
    // Finding the role and manager from current db to get their id
    const role = positions.objects.find((role) => role.role_title === employeeData.position);
    let manager;
    let managerInfo;
    if (employeeData.manager === 'None') {
      manager = null
    } else {
      managerInfo = employees.objects.find((employee) => `${employee.first_name} ${employee.last_name}` === employeeData.manager);
      manager = managerInfo.employee_id
    }
    // New employee object to be created
    const employee = {
      first_name: employeeData.first_name,
      last_name: employeeData.last_name,
      role_id: role.id,
      manager_id: manager
    };
    //Insert then new employee to database
    await employeeModule.addEmployeeToDatabase(employee);
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
// Function for updating the role of an employee
async function updateEmployeeRole() {
  try {
    // Fetching current employees and roles from database
    const employees = await employeeModule.getEmployees();
    const positions = await roleModule.getRoles()
    // Prompt for user to choose employee to update
    const employeeData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which employee would youl like to update?',
        choices: employees.names,
        name: 'employee',
      },
    ]);
    // creating a list of roles for user to choose from that does not include the employees current role
    const currentEmployee = employees.objects.find((employee) => `${employee.first_name} ${employee.last_name}` === employeeData.employee);
    const possiblePositions = [];
    for (let i = 0; i < positions.objects.length; i++) {
      if (positions.objects[i].role_title !== currentEmployee.role_title) {
        possiblePositions.push(positions.objects[i].role_title)
      }
    }
    // Getting the chosen employees current info
    const employeeinfo = await employeeModule.getEmployeeByName(currentEmployee.first_name, currentEmployee.last_name)
    // Prompt for user to choose new role for employee
    const updatedRoleData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which role would you like to assign the employee?',
        choices: possiblePositions,
        name: 'position',
      },
    ]);
    // Finding the id of the chosen role
    const role = positions.objects.find((role) => role.role_title === updatedRoleData.position);
    // Creating object of updated employee
    const employee = {
      first_name: employeeinfo[0].first_name,
      last_name: employeeinfo[0].last_name,
      role_id: role.id,
      manager_id: employeeinfo[0].manager_id,
      id: employeeinfo[0].id,
    }
    // Updating the employee in the database
    await employeeModule.updateEmployeeRole(employee);
    console.log('Employee Updated')
    init()
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
// Function to remove an employee
async function removeEmployee() {
  try {
    // Getting current employees
    const employees = await employeeModule.getEmployees();
    // Prompt for user to choose employee to remove
    const employeeData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which employee would you like to remove?',
        choices: employees.names,
        name: 'employee',
      },
    ]);
    // Finding the id of the chosen employee
    const employee = employees.objects.find((employee) => `${employee.first_name} ${employee.last_name}` === employeeData.employee);
    // Removing employee from database
    await employeeModule.removeEmployeeFromDatabase(employee.employee_id);
    console.log('Employee Removed');
    init();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Function to remove a department
async function removeDepartment() {
  try {
    // Getting current departments
    const departments = await departmentModule.getDepartments();
    // Prompt for user to choose department to remove
    const departmentData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which department would you like to remove?',
        choices: departments.names,
        name: 'department',
      },
    ]);
    // Finding the id of the chosen department
    const department = departments.objects.find((department) => department.department_name === departmentData.department);    
    // Removing department from database
    await departmentModule.removeDepartmentFromDatabase(department.id);
    console.log('Department Removed');
    init();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Function to remove a role
async function removeRole() {
  try {
    // Getting current roles
    const roles = await roleModule.getRoles();
    // Prompt for user to choose role to remove
    const roleData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which role would you like to remove?',
        choices: roles.names,
        name: 'role',
      },
    ]);
    // Finding the id of the chosen role
    const role = roles.objects.find((role) => role.role_title === roleData.role);
    // Removing role from database
    await roleModule.removeRoleFromDatabase(role.id);
    console.log('Role Removed');
    init();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
// Initializing the app by running the init function
init();
