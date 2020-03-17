const inquirer = require("inquirer");
const mysql = require("mysql");
const util = require("util");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "Netisedavam7",
    database: "employee_db"
});

connection.connect(function(err){
    if(err) throw(err);
    startingFunction();
});

// connection.query = util.promisify(connection.query);

function startingFunction(){
    inquirer.prompt([
        {
            message:"What would you like to do?",
            choices:["Add", "View", "Update", "Delete"],
            type:"list",
            name:"action"
        },
        {
            message:"Select from the following options:",
            choices:["Department", "Employee", "Roles"],
            type:"list",
            name:"options"
        }
    ]).then(function(res){
        console.log(`You chose to ${res.action} a ${res.options}`);

        switch(res.action){
            case "Add":
                createData(res.options);
                break;
            case "View":
                readData(res.options);
                break;
            case "Update":
                updateData(res.options);
                break;
            case "Delete":
                deleteData(res.options);
                break;
        }
    }).catch(function(err){
        console.log(err);
    })
}

function createData(options){
    switch(options){
        case "Employee":
            connection.query("SELECT * FROM roles", function(err, res){
                if(err) throw(err);
                const roles = res.map(object => {
                    return {
                        name: object.role_title,
                        value: object.r_id
                    }
                });
                roles.push("N/A")

                connection.query("SELECT * FROM employee", function(err, res){
                    if(err) throw(err);

                    const employee = res.map(object => {
                        return {
                            name: `${object.first_name} ${object.last_name}`,
                            value: object.e_id
                        }
                    });

                    employee.unshift({
                        name: "no manager",
                        value: null
                    })

                    inquirer.prompt([
                        {
                            name: "first_name",
                            type:"input",
                            message: "What is the employee's first name?"
                        },
                        {
                            name: "last_name",
                            type: "input",
                            message:"What is the employee's last name?"
                        },
                        {
                            name: "role",
                            type: "list",
                            message: "What is the employee's position?",
                            choices: roles
                        },
                        {
                            name: "manager",
                            type: "list",
                            message: "Who is the employee's manager?",
                            choices: employee
                        }
                    ]).then(function(res){
                        if(res.role === "N/A"){
                            genRolePrompt();
                        }else {
                            console.log(`Adding ${res.first_name} ${res.last_name} as a new employee!`);
                            console.log(res.manager);
                            connection.query(
                                "INSERT INTO employee SET?", {
                                    first_name: res.first_name,
                                    last_name: res.last_name,
                                    role_id: res.role,
                                    manager_id: res.manager
                                },
                                function(err, res){
                                    if(err) throw(err);
                                    console.log(res.affectedRows + "employee added!\n");
                                    continuePrompt()
                                }
                            );
                        }
                    }).catch(function(err){
                        console.log(err);
                    })
                })
            })
            break;

        case "Role":
            connection.query("SELECT * FROM department", function(err, res){
                if(err) throw(err);

                const departments = res.map(object => {
                    return{
                        name: object.departmentName,
                        value: object.d_id
                    }
                });
                departments.push("N/A")

                inquirer.prompt([
                    {
                        name:"title",
                        type: "input",
                        message: "What is the new role?"
                    },
                    {
                        name:"salary",
                        type: "number",
                        message:"What is the salary for that role?"
                    },
                    {
                        name: "department",
                        type: "list",
                        message: "Which department does the employee work in?",
                        choices: departments
                    }
                ]).then(function(res){
                    if(res.department === "N/A"){
                        genDepartmentPrompt();
                    }else{
                        console.log("Inserting a new role ...\n");
                        connection.query(
                            "INSERT INTO roles SET ?", {
                                role_title: res.title,
                                salary: res.salary,
                                department_id: res.department
                            },

                            function(err, res){
                                if(err) throw(err);
                                console.log(res.affectedRows + "Role added!\n");
                                continuePrompt();
                            }
                        );
                    }
                }).catch(function(err){
                    console.log(err);
                })
            });
            break;
        
        case "Department":
            inquirer.prompt([
                {
                    name: "departmentname",
                    type: "input",
                    message: "What is the name of the new department?"
                }
            ]).then(function(res){
                console.log("Adding a new department... \n");
                connection.query(
                    "INSERT INTO department SET ?", {
                        departmentName: res.departmentname
                    },

                    function(err, res){
                        if(err) throw(err);
                        console.log(res.affectedRows + "Department added!\n");
                        continuePrompt()
                    }
                );
            }).catch(function(err){
                console.log(err);
            })
            break;
    }
};

function readData(res){
    switch(res){
        case "Employee":
            console.log("Select all employees...\n");
            connection.query("SELECT * FROM roles", function(err,res){
                if(err)throw(err);
                console.table(res);
                continuePrompt()
            });
            break;
        
            case "Department":
                console.log("Selecting all departments...\n");
                connection.query("SELECT * FROM department", function(err,res){
                    if(err) throw(err);
                    console.table(res);
                    continuePrompt()
                });
                break;
    }
}

function updateData(options){
    switch(options){
        case "Employee":
            connection.query("SELECT * FROM employee", function(err, res){
                if(err) throw(err);
                const employees = res.map(object => {
                    return{
                        name: `${object.first_name} ${object.last_name}`,
                        value: object.e_id
                    }
                });

                connection.query("SELECT * FROM roles", function(err, res){
                    if(err) throw(err);
                    const roles = res.map(object => {
                        return {
                            name: object.role_title,
                            value: object.r_id
                        }
                    });

                    console.log("Updating employee position...\n");
                    inquirer.prompt([
                        {
                            name: "employee",
                            type: "list",
                            message:"Which employee would you like to update?",
                            choices: employees
                        },
                        {
                            name: "role",
                            type: "list",
                            message:"What position would you like to change them into?",
                            choices: roles
                        }
                    ]).then(function(res){
                        console.log("Updating existing employee...\n");
                        connection.query(
                            "UPDATE employee SET ? WHERE ?",
                            [
                                {
                                    role_id: res.role
                                },
                                {
                                    e_id: res.employee
                                }
                            ],
                            function(err, res){
                                if(err)throw(err);
                                console.log(res.affectedRows + "employee updated!\n");
                                continuePrompt()
                            }
                        );
                    }).catch(function(err){
                        console.log(err);
                    })
                });
            });
            break;
        case "Role":
            console.log("Can't update role...\n");
            continuePrompt();
            break;
        case "Department":
            console.log("Can't update department...\n");
            continuePrompt();
            break;
    }
};

function deleteData(options){
    switch(options){
        case "Employee":
            connection.query("SELECT * FROM employee", function(err, res){
                if(err) throw(err); 
                const employees = res.map(object => {
                    return{
                        name: `${object.first_name} ${object.last_name}`,
                        value: object.e_id
                    }
                });
                inquirer.prompt([
                    {
                        name: "employee",
                        type:"list",
                        message:"Which employee would you like to delete?",
                        choices: employees
                    }
                ]).then(function(res){
                    console.log("Deleting an existing employee...\n");
                    connection.query(
                        "DELETE FROM employee WHERE ?",
                        [{
                            e_id: res.employee
                        }],
                        function(err, res){
                            if(err) throw(err);
                            console.log(res.affectedRows + "employee removed!\n");
                            continuePrompt()
                        }
                    );
                }).catch(function(err){
                    console.log(err);
                })
            })
            break;
        case "Role":
            console.log("Can't remove a position unless you have a permission!\n");
            continuePrompt();
            break;
        case "Department":
            console.log("Can't remove a department unless you're a manager!\n");
            continuePrompt();
            break;
    }
}

function continuePrompt(){
    inquirer.prompt(
        {
            name:"action",
            type:"list",
            message:"Would you like to continue or to exit?",
            choices:["Continue", "Exit"]
        }
    ).then(function(res){
        console.log(`${res.action}...\n`);
        switch(res.action){
            case "Exit":
                connection.end();
                break;
            case "Continue":
                startingFunction();
                break;
        }
    }).catch(function(err){
        console.log(err);
    })
}

function genDepartmentPrompt(){
    inquirer.prompt(
        {
            name:"action",
            type:"list",
            message: "Add this role by creating the appropriate department",
            choices:["Continue", "Exit"]
        }
    ).then(function(res){
        console.log(`${res.action}...\n`);
        switch(res.action){
            case "Exit":
                connection.end();
                break;
            case "Continue":
                startingFunction();
                break;
        }
    }).catch(function(err){
        console.log(err);
    })
}

function genRolePrompt(){
    inquirer.prompt(
        {
            name:"action",
            type:"list",
            message: "Add this employee by creating the appropriate role",
            choices:["Continue", "Exit"]
        }
    ).then(function(res){
        console.log(`${res.action}...\n`);
        switch(res.action){
            case "Exit":
                connection.end();
                break;
            case "Continue":
                startingFunction();
                break;
        }
    }).catch(function(err){
        console.log(err);
    })
}