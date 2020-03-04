var inquirer = require("inquirer");
var mysql = require("mysql");
var numberProducts;
var item_Id;
var price;

var connection = mysql.createConnection({
    host: "localhost",
    port:3306,
    user:"root",
    password:"Svs159728!",
    database:"bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // connection.query("SELECT COUNT(*) FROM products",function(err,res){
    //     if(err) throw err;
    //     numberProducts = res;
    //     console.log(numberProducts);
    // });
    connection.query("SELECT item_Id,product_Name,price FROM products",function(err,res){
        if(err) throw err;
        console.table(res);
        purchase();
    });
});


function purchase() {
    inquirer.prompt([
        {
            type:"list",
            message:"select the corrisponding id to the product that you would like to purchas.",
            name:"id",
            choices:["1","2","3","4","5","6","7","8","9","10"]
        },
        {
            type:"input",
            message:"How many would you like to buy.",
            name:"amount"
        }
    ]).then(function(data){
        console.log(data.id);
        console.log(data.amount);
        connection.query("SELECT * FROM products WHERE ?",{
            item_Id:data.id
        },
        function(err,res){
            if(err) throw err;
            item_Id = data.id;
            res.forEach(function(results){
                numberProducts = results.stock_Quantity;
                price = results.price;
            });
            if(data.amount < numberProducts ){
                numberProducts = numberProducts - data.amount;
                price = parseFloat(price) * parseFloat(data.amount);
                console.log("hurray");
                updateStore();
            }else{
                console.log("We Don't have that many in stock");
                connection.end();
            }
        });
    });
}

function updateStore(){
    connection.query("UPDATE products SET ? WHERE ?",[
        {
            stock_Quantity:numberProducts
        },
        {
            item_Id:item_Id
        }
    ],function(err,res){
        if(err) throw err;
        console.log("Thanks for your purchase your total was $" + price);
        connection.end();
    }
)};

