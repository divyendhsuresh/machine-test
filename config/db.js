const mysql = require("mysql");
require('dotenv').config()

var con = mysql.createConnection({
    host: "localhost",
    port: 3309,
    user: "my_user",
    password: process.env.PASSWORD,
    database: "my_database",
    insecureAuth: false
});

con.connect((err) => {
    if (err) {
        console.log("Database Connection Failed !!!", err);
    } else {
        console.log("connected to Database");
    }
});

module.exports = con;
