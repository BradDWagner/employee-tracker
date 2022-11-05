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
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View all Departments',
                    'Add Department',
                    'Quit'
                ],
                loop: true

            }
        ])
        .then((response) => 
        console.log(response))
};

function addEmployee () {
    let roles;
    db.query('SELECT title FROM role', function (err, results) {
        roles = results.map(role => role.title);
        console.log(roles)
    })

    // console.log(roles);
    // inquirer
    //     .prompt([
    //         {
    //             type: 'input',
    //             message: "What is the employee's first name?",
    //             name: 'firstName'
    //         },
    //         {
    //             type: 'input',
    //             message: "What is the employee's last name?",
    //             name: 'lastName'
    //         },
    //         {
    //             type: 'list',
    //             message: "What is the employee's role?",
    //             name: 'role',
    //             choices: 
    //         }

    // ])
}

// mainMenu();
addEmployee();