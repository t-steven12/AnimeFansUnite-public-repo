//The following code is based on the dbcon.js.template from Justin Wolford's "CS-290-Server-Side-Examples" @ https://github.com/wolfordj/CS290-Server-Side-Examples/tree/master/express-mysql

//To test the program, please provide your own MySQL database information where
//the asterisks appear below. 'host' value can be changed to your preferred host.
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : '****',
    password        : '****',
    database        : '****'
});

module.exports.pool = pool;
