const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bradwagner',
        database: 'employee_db'
    }
)

//take in a role title and return its ID
const roleToId = async function (role) {
    const [rows] = await db.promise().query('SELECT id FROM role WHERE title = ?', role)
    return rows.map(data => data.id)
}

//take in an employee's name and return their ID
const employeeToId = async function (employee) {
    //split full name
    const name = employee.split(" ");
    //search for employee using their first nae
    const [rows] = await db.promise().query('SELECT id FROM employee WHERE first_name = ?', name[0])
    if (rows.length < 1) {
        return null
    } else {
    return rows.map(data => data.id)
    }
}

//take in a department name and return its ID
const departmentToId = async function (department) {
    const [rows] = await db.promise().query('SELECT id FROM department WHERE name = ?', department)
    return rows.map(data => data.id)
}

module.exports = {roleToId, employeeToId, departmentToId}