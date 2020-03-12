const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhostschool",
    port: 3306,
    user: "root",
    password:"Netisedavam7$",
    database:"employee_db"
});

connection.connect(function(err){
    if(err) throw(err);
});