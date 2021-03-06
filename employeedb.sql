DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
    d_id INT AUTO_INCREMENT PRIMARY KEY,
    departmentName VARCHAR(30)
);


CREATE TABLE roles(
    r_id INT AUTO_INCREMENT PRIMARY KEY, 
    role_title VARCHAR(30) NOT NULL,
    salary DECIMAL (8,2) NOT NULL,
    department_id INT
);


CREATE TABLE employee(
    e_id INT AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(r_id),
    manager_id INT
);


SELECT*FROM department;

SELECT*FROM roles;

SELECT*FROM employee;