var mysql = require('mysql');
var prompt = require('prompt');
var Table = require('cli-table2');
//connecting to database
var connection = mysql.createConnection({
 host: "localhost",
 port: 3306,
 user: "root", //Your username
 password: "", //Your password
 database: "bamazon"
});
//creating table object to display products to customer
var table = new Table({
    head: ['Item ID', 'Product', 'Price']
  , colWidths: [20, 20, 10]
});


connection.connect(function (err) {
 if (err) throw err;
});

connection.query('SELECT ItemID,ProductName,Price FROM products', function (err, res) {
 if (err) throw err;
 res.forEach(function(value){
  table.push(
    [value.ItemID, value.ProductName, value.Price]
);
 });
 console.log(table.toString());
});
connection.end(function (err) {
 if (err) throw err;
});

prompt.start();

prompt.get(['id', 'quantity'], function (err, result) {
 console.log(" Product ID: " + result.id);
 console.log(" Quanitity: " + result.quantity);
})

