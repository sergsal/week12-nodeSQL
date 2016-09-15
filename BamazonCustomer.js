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
 head: ['Item ID', 'Product', 'Price'],
 colWidths: [20, 20, 10]
});
var schema = {
 properties: {
  productid: {
   pattern: /^(0|[1-9][0-9]*)$/,
   message: 'Product ID can be only numbers',
   required: true,
   description: "Please enter the ID of the product you would like to purchase"
  },
  quantity: {
   pattern: /^(0|[1-9][0-9]*)$/,
   message: 'Quantity can be only numbers',
   required: true,
   description: "Please enter how many you would like to buy"
  }
 }
};

connection.connect(function (err) {
 if (err) throw err;
});

connection.query('SELECT ItemID,ProductName,Price FROM products', function (err, res) {
 if (err) throw err;
 res.forEach(function (value) {
  table.push(
    [value.ItemID, value.ProductName, value.Price]
  );
 });
 console.log("\n" +table.toString());
});
//connection.query('SELECT Price FROM products WHERE ItemID = ?',[4], function(err, res) {
//  console.log(res[0].Price);
// })

prompt.get(schema, function (err, result) {
 var prodId = result.productid;
 var custQuant = result.quantity;
 connection.query('SELECT Price,StockQuantity FROM products WHERE ItemID = ?', [prodId], function (err, res) {
  var prodPrice = res[0].Price;
  var availQuant = res[0].StockQuantity;
  var totalCost = (prodPrice * custQuant);
  var newStock = (availQuant - custQuant);
  if ((newStock) < 0) {
   console.log("Insufficient availability!");
   connection.end();
  } else if (newStock >= 0){
   connection.query('UPDATE products SET ? WHERE ?', [{StockQuantity: newStock},
     {ItemID: prodId}], function(err, res) {
    if (err) throw err;
    console.log("Your total cost is $" + totalCost.toFixed(2));
    connection.end()
   });
  };
 });
 //console.log(result.id)
});
//connection.end(function (err) {
// if (err) throw err;
//});
 prompt.start();