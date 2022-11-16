const express = require('express');
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pagina'
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });


//   // Sample query 
//   let sql = `SELECT * FROM accounts`;

//   connection.query(sql, (error, results, fields) => {
//     if (error) {
//       return console.error(error.message);
//     }
//     console.log(results);
//   });
  
//   connection.end(); 

  