const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bradwagner',
        database: 'employee_db'
    },
    console.log('Connected to the db')
)

const roleList =  async function() {
    const [rows] = await db.promise().query('SELECT title FROM role')
    return rows.map(role => role.title)
}

const managerList = async function () {
    const [rows] = await db.promise().query('SELECT CONCAT(first_name, + " ", + last_name) AS name FROM employee');
    const managers = rows.map(manager => manager.name);
    managers.push("None");
    return managers;
}

const employeeList =  async function () {
    const [rows] = await db.promise().query('SELECT CONCAT(first_name, + " ", + last_name) AS name FROM employee');
    return rows.map(employee => employee.name)
}

const departmentList = async function () {
    const [rows] = await db.promise().query('SELECT name FROM department');
    return rows.map(department => department.name)
}

module.exports = { roleList, managerList, employeeList, departmentList }