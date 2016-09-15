var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');
//connecting to database
var connection = mysql.createConnection({
 host: "localhost",
 port: 3306,
 user: "root", //Your username
 password: "", //Your password
 database: "bamazon"
});
var table = new Table({
 head: ['Item ID', 'Product', 'Price', 'Quantity'],
 colWidths: [20, 20, 10, 10]
});

connection.connect(function (err) {
 if (err) throw err;
});

var start = function () {  
 inquirer.prompt([
    {
     type: "list",
     name: "command",
     message: "Please select a menu item:",
     choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
  }
 ]).then(function (results) {
     switch (results.command) {
      case ("View Products for Sale"):
       connection.query('SELECT ItemID,ProductName,Price,StockQuantity FROM products', function (err, res) {
        if (err) throw err;
        res.forEach(function (value) {
         table.push(
    [value.ItemID, value.ProductName, value.Price, value.StockQuantity]
         );
        });
        console.log("\n" + table.toString());
       });
       connection.end();
       break
     } //end of switch case
     switch (results.command) {
      case ("View Low Inventory"):
       connection.query('SELECT ItemID,ProductName,Price, StockQuantity FROM products WHERE StockQuantity < 5', function (err, res) {
        if (err) throw err;
        res.forEach(function (value) {
         table.push(
    [value.ItemID, value.ProductName, value.Price, value.StockQuantity]
         );
        });
        console.log("\n" + table.toString());
       });
       connection.end();
       break;
     } //end of switch case
     switch (results.command) {
      case ("Add to Inventory"):
       connection.query('SELECT ItemID,ProductName,Price,StockQuantity FROM products', function (err, res) {
         if (err) throw err;
         res.forEach(function (value) {
          table.push(
    [value.ItemID, value.ProductName, value.Price, value.StockQuantity]
          );
         });
         console.log("\n" + table.toString());
        })
        inquirer.prompt([
         {
          name: "productid",
          type: "input",
          message: "Please enter the ID of the product you would like to add inventory to:",
          validate: function (value) {
           if (isNaN(value) == false) {
            return true;
           } else {
            return false;
           }
          }
 },
         {
          name: "quantity",
          type: "input",
          message: "Please enter how much stock you would like to add:",
          validate: function (value) {
           if (isNaN(value) == false) {
            return true;
           } else {
            return false;
           }
          }
 }
]).then(function (result) {
         var prodId = result.productid;
         var custQuant = Number(result.quantity);
         //query that selects the price and quantity for the selected ID
         connection.query('SELECT StockQuantity FROM products WHERE ItemID = ?', [prodId], function (err, res) {
          var availQuant = Number(res[0].StockQuantity);
          var newStock = (Number(availQuant) + Number(custQuant));
          connection.query('UPDATE products SET ? WHERE ?', [{
            StockQuantity: newStock
      },
           {
            ItemID: prodId
      }], function (err, res) {
           if (err) throw err;
           connection.end()
          });
         })
        }) // end of switch case
       } 
    }); //end of .then
         }

    start()
