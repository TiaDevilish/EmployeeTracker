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
    ])
}