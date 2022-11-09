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

const employeeRoles =  async function() {
    const [rows] = await db.promise().query('SELECT title FROM role')
    return rows.map(role => role.title)
}

module.exports = { employeeRoles }