const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    user: "SysAcc",
    password: "password",
    database: "amsdatabase"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


module.exports = con;