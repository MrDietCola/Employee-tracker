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

async function init() {
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
    console.log('Employee added');
    init()
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

async function removeEmployee() {
  try {
    const employees = await employeeModule.getEmployees();

    const employeeData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which employee would you like to remove?',
        choices: employees.names,
        name: 'employee',
      },
    ]);
    const employee = employees.objects.find((employee) => `${employee.first_name} ${employee.last_name}` === employeeData.employee);
    await employeeModule.removeEmployeeFromDatabase(employee.employee_id);
    console.log('Employee Removed');
    init();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function removeDepartment() {
  try {
    const departments = await departmentModule.getDepartments();

    const departmentData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which department would you like to remove?',
        choices: departments.names,
        name: 'department',
      },
    ]);
    const department = departments.objects.find((department) => department.name === departmentData.department);
    console.log(department);
    
    await departmentModule.removeDepartmentFromDatabase(department.id);
    console.log('Department Removed');
    init();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function removeRole() {
  try {
    const roles = await roleModule.getRoles();
    console.log(roles.objects[0]);
    const roleData = await inquirer.prompt([
      {
        type: 'list',
        message: 'Which role would you like to remove?',
        choices: roles.names,
        name: 'role',
      },
    ]);

    const role = roles.objects.find((role) => role.role_title === roleData.role);
    console.log(role);
    
    await roleModule.removeRoleFromDatabase(role.id);
    console.log('Role Removed');
    init();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

init();
