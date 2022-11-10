const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bradwagner',
        database: 'employee_db'
    }
)

//query a list of roles in the database and return them as an array
const roleList =  async function() {
    const [rows] = await db.promise().query('SELECT title FROM role')
    return rows.map(role => role.title)
}

//query a list of employees in the database, adding the option to select no manager, and return them as an array
const managerList = async function () {
    const [rows] = await db.promise().query('SELECT CONCAT(first_name, + " ", + last_name) AS name FROM employee');
    const managers = rows.map(manager => manager.name);
    managers.push("None");
    return managers;
}

//query a  list of employees and return them as an array
const employeeList =  async function () {
    const [rows] = await db.promise().query('SELECT CONCAT(first_name, + " ", + last_name) AS name FROM employee');
    return rows.map(employee => employee.name)
}

//query a list of departments and return them as an array
const departmentList = async function () {
    const [rows] = await db.promise().query('SELECT name FROM department');
    return rows.map(department => department.name)
}

module.exports = { roleList, managerList, employeeList, departmentList }