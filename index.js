//import node modules
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//import helper functions
const { roleToId, employeeToId, departmentToId } = require('./helpers/toId')
const { roleList, managerList, employeeList, departmentList } = require('./helpers/lists')

//establish database connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bradwagner',
        database: 'employee_db'
    },
    console.log('Connected to the db')
)

//handle main menu 
function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'choice',
                choices: [
                    'View All Employees',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Quit'
                ],
                loop: true
            }
        ])
        .then((response) => {
            switch (response.choice) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    console.log('bye');
                    break;
            }
        })
};

//return list of employee data
async function viewEmployees() {
    const [rows] = await db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee AS manager ON employee.manager_id = manager.id`);
    console.table(rows);
    mainMenu();
}

//add an employee to the database
function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'firstName'
            },
            {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'lastName'
            },
            {
                type: 'list',
                message: "What is the employee's role?",
                name: 'role',
                choices: roleList
            },
            {
                type: 'list',
                message: "Who is the employee's manager?",
                name: 'manager',
                choices: managerList
            }
        ])
        .then(async (response) => {
            //convert role title to role ID
            const roleId = await roleToId(response.role);
            //convert manager's name to employee ID
            const managerId = await employeeToId(response.manager);
            db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [response.firstName, response.lastName, roleId, managerId]);
            console.log(`Added ${response.firstName} ${response.lastName} to the database`);
        })
        .then(() => mainMenu());
}

//update an employee's role
function updateRole() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: "Which employee's role do you want to update?",
                name: 'employee',
                choices: employeeList
            },
            {
                type: 'list',
                message: 'Which role do you want to assign the selected employee?',
                name: 'role',
                choices: roleList
            }
        ])
        .then(async (response) => {
            //convert role title to role ID
            const roleId = await roleToId(response.role);
            //convert employee's name to employee ID
            const employeeId = await employeeToId(response.employee)
            db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId])
            console.log(`${response.employee}'s role has been updated in database`)
        })
        .then(() => mainMenu())
}

//return list of roles
async function viewRoles() {
    const [rows] = await db.promise().query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role   JOIN department ON role.department_id = department.id`);
    console.table(rows);
    mainMenu();
}

//add a role to the database
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'title'
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'department',
                choices: departmentList
            }
        ])
        .then(async (response) => {
            //convert department name to department ID
            const departmentId = await departmentToId(response.department)
            db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [response.title, response.salary, departmentId]);
            console.log(`Added ${response.title} to the database`);
        })
        .then(() => mainMenu());
}

//return list of department data
async function viewDepartments () {
    const [rows] = await db.promise().query('SELECT * FROM department');
    console.table(rows);
    mainMenu();
}

//add a department to the database
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department',
                name: 'department'
            }
        ])
        .then((response) => {
            db.promise().query('INSERT INTO department (name) VALUES(?)', response.department);
            console.log(`Added ${response.department} to the database`)
        })
        .then(() => mainMenu());
}

//begin application
function init () {
    console.log("Welcome to the Employee Tracker!")
    mainMenu()
}
init();