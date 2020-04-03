const mysql = require('mysql');

const con = mysql.createConnection({
    host: process.env.HOST || "localhost",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || "password",
    database: process.env.DATABASE || "react-auth"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

module.exports = con;
