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
            messafe:"Select from the following options:",
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
                    
                })
            })
    }
}