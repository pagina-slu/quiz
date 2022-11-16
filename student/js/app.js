const express = require('express');
const mysql = require('mysql');

const app =  express();
app.listen(5000);



app.get('/', function (req, res) {
    res.send('<b>My</b> first express http server');
});

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



  