const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bradwagner',
        database: 'employee_db'
    },
    console.log('Connected to the db')
)

function mainMenu () {
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

function viewEmployees () {
    db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager 
    FROM employee
    JOIN role 
    ON employee.role_id = role.id
    JOIN department
    ON role.department_id = department.id
    LEFT OUTER JOIN employee AS manager
    ON employee.manager_id = manager.id`)
    .then( ([rows, fields]) => 
    console.table(rows))
    .then(() => mainMenu())
}


//TODO: addEmployee
// Ask first_name
// Ask last_name
// Ask role
    //from list of exixting roles
// Ask manager
    //from list of existing employees


function addEmployee () {
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
            choices: () => new Promise( (resolve, reject) => {
                resolve(
                    db.promise().query('SELECT title FROM role')
                    .then( ([rows, fields]) => {
                    return (roles = rows.map(role => role.title))}
                ))
            })
        },
        {
            type: 'list',
            message: "Who is the employee's manager?",
            name: 'manager',
            choices: () => new Promise( (resolve, reject) => {
                resolve(
                    db.promise().query('SELECT CONCAT(first_name, + " ", + last_name) AS name FROM employee')
                    .then( ([rows, fields]) => {
                        return managers = rows.map(manager => manager.name)
                    })
                )
            })
        }
    ])
    .then 
}

//TODO: updateEmployeeRole

function viewRoles () {
    db.promise().query(`SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role
    JOIN department
    ON role.department_id = department.id`)
    .then( ([rows, fields]) => 
    console.table(rows))
    .then(() => mainMenu())
}

//TODO: addRole
   
function viewDepartments (){
    db.promise().query('SELECT * FROM department')
    .then( ([rows, fields]) =>
    console.table(rows))
    .then(() => mainMenu())
}

function addDepartment () {
    inquirer
    .prompt ([
        {
            type: 'input',
            message: 'What is the name of the department',
            name: 'department'
        }
    ])
    .then( (response) => {
    db.promise().query('INSERT INTO department (name) VALUES(?)', response.department);
    console.log(`Added ${response.department} to the database`)
    })
    .then( () => mainMenu())
}


// mainMenu();
addEmployee();
