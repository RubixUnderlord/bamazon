var inquire = require("inquire");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port:3306,
    user:"root",
    password:"Svs159728!",
    database:"bamazon"
});