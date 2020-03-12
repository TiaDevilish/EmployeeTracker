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
    console.log("hello");
});

// connection.query = util.promisify(connection.query);