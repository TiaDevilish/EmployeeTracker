use employee_db;

create table department(
    d_id int auto_increment primary key,
    departmentName varchar(30)
);


create table roles(
    r_id int auto_increment primary key, 
    role_title varchar(30) not null,
    salary decimal (8,2) not null,
    department_id int,
    foreign key (department_id) references department(d_id)
);


create table employee(
    e_id int auto_increment primary key, 
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int,
    foreign key (role_id) references roles(r_id),
    manager_id int,
    foreign key (manager_id) references employee(e_id)
);


select*from department;

select*from roles;

select*from employee;