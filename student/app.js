const express = require('express');           //to get get post method request 
const mysql = require('mysql');               //to connect to database
const session = require('express-session');    //for session handling
const bodyParser = require('body-parser');     //to get the body of html request
const path = require('path');                     //to work with paths
const cookieParser = require("cookie-parser");


const app = express();
app.listen(5000);
// app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
   secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
   saveUninitialized: true,
   cookie: { maxAge: oneDay },
   resave: false
}));

let connection;

app.get('/', function (req, res) {
   res.sendFile(__dirname + "/views/login.html");
   connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'pagina'
   });


});

app.post('/login', function (req, res) {
   var username = req.body.uname;
   var password = req.body.upass;
   let sql = `SELECT username FROM accounts WHERE username = ? AND password = ?`;

   connection.connect(async function (err) {
      if (err) {
         return console.error('error: ' + err.message);
      }

      console.log('Connected to the MySQL server.');
      connection.query(sql, [username, password],  (error, results) => {
         if (error) {
            return console.error(error.message);
         }
         // console.log(results[0].username);
         setUser(results[0].username);
      });
   
   });
   

   function setUser(value) {
      req.session.userid = value;
      console.log(req.session.userid);

      if (req.session.userid) {
         console.log("should send file");
         res.sendFile(__dirname + "/views/quiz.html");
      }
   }

});






// // Sample query
// let sql = `SELECT * FROM accounts`;

// connection.query(sql, (error, results, fields) => {
//   if (error) {
//     return console.error(error.message);
//   }
//   console.log(results);
// });

// connection.end();



