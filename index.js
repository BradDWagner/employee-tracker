const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { roleToId, employeeToId, departmentToId } = require('./helpers/toId')
const { } = require('./helpers/queries')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bradwagner',
        database: 'employee_db'
    },
    console.log('Connected to the db')
)

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
mainMenu()

function viewEmployees() {
    db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager 
    FROM employee
    JOIN role 
    ON employee.role_id = role.id
    JOIN department
    ON role.department_id = department.id
    LEFT OUTER JOIN employee AS manager
    ON employee.manager_id = manager.id`)
        .then(([rows, fields]) =>
            console.table(rows))
        .then(() => mainMenu())
}
// viewEmployees()

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
                choices: async () => {
                    const [rows] = await db.promise().query('SELECT title FROM role')
                    return rows.map(role => role.title)
                }
            },
            {
                type: 'list',
                message: "Who is the employee's manager?",
                name: 'manager',
                choices: async () => {
                    const [rows] = await db.promise().query('SELECT CONCAT(first_name, + " ", + last_name) AS name FROM employee');
                    const managers = rows.map(manager => manager.name);
                    managers.push("None");
                    return managers;
                }
            }
        ])
        .then(async (response) => {
            const roleId = await roleToId(response.role);
            const managerId = await employeeToId(response.manager);
            db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES (?, ?, ?, ?)`, [response.firstName, response.lastName, roleId, managerId]);
            console.log(`Added ${response.firstName} ${response.lastName} to the database`);
        })
        .then(() => mainMenu());
}
// addEmployee();



function updateRole() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: "Which employee's role do you want to update?",
                name: 'employee',
                choices: () => new Promise((resolve, reject) => {
                    resolve(
                        db.promise().query('SELECT CONCAT(first_name, + " ", + last_name) AS name FROM employee')
                            .then(([rows, fields]) => {
                                return employees = rows.map(employee => employee.name)
                            })
                    )
                })
            },
            {
                type: 'list',
                message: 'Which role do you want to assign the selected employee?',
                name: 'role',
                choices: () => new Promise((resolve, reject) => {
                    resolve(
                        db.promise().query('SELECT title FROM role')
                            .then(([rows, fields]) => {
                                return (roles = rows.map(role => role.title))
                            }
                            ))
                })
            }
        ])
        .then(async (response) => {
            const roleId = await roleToId(response.role);
            const employeeId = await employeeToId(response.employee)
            db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId])
            console.log(`${response.employee}'s role has been updated in database`)
        })
        .then(() => mainMenu())
}
// updateRole()

function viewRoles() {
    db.promise().query(`SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role
    JOIN department
    ON role.department_id = department.id`)
        .then(([rows, fields]) =>
            console.table(rows))
        .then(() => mainMenu())
}
// viewRoles()

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
                choices: () => new Promise((resolve, reject) => {
                    resolve(
                        db.promise().query('SELECT name FROM department')
                            .then(([rows, fields]) => {
                                return (departmentss = rows.map(department => department.name))
                            }
                            ))
                })
            }
        ])
        .then(async (response) => {
            const departmentId = await departmentToId(response.department)
            db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [response.title, response.salary, departmentId])
            console.log(`Added ${response.title} to the database`)
        })
        .then(() => mainMenu())

}
// addRole()

function viewDepartments() {
    db.promise().query('SELECT * FROM department')
        .then(([rows, fields]) =>
            console.table(rows))
        .then(() => mainMenu())
}
// viewDepartments()

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
        .then(() => mainMenu())
}
// addDepartment()

