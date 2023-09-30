const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'SysAcc',
  password: 'password',
  database: 'amsdatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();