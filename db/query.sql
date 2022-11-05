--view all departments
SELECT * FROM department;

--view all roles THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
SELECT role.id, role.title, department.name AS department, role.salary 
FROM role
JOIN department
ON role.department_id = department.id;

--view all employees showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager 
FROM employee
JOIN role 
ON employee.role_id = role.id
JOIN department
ON role.department_id = department.id
LEFT OUTER JOIN employee AS manager
ON employee.manager_id = manager.id;

--add department 
INSERT INTO department (name)
VALUES(?);

--add role
INSERT INTO role (title, salary, department_id)
VALUES(?,?,?);

--add employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
values(?,?,?,?)

UPDATE employee SET role_id = ? 

