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

const roleToId = async function (role) {
    const [rows] = await db.promise().query('SELECT id FROM role WHERE title = ?', role)
    return rows.map(data => data.id)
}

const employeeToId = async function (employee) {
    const name = employee.split(" ");
    const [rows] = await db.promise().query('SELECT id FROM employee WHERE first_name = ?', name[0])
    if (rows.length < 1) {
        return null
    } else {
    return rows.map(data => data.id)
    }
}

const departmentToId = async function (department) {
    const [rows] = await db.promise().query('SELECT id FROM department WHERE name = ?', department)
    return rows.map(data => data.id)
}

module.exports = {roleToId, employeeToId, departmentToId}