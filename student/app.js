const express = require('express');           //to get get post method request 
const mysql = require('mysql');               //to connect to database
const session = require('express-session');    //for session handling
const bodyParser = require('body-parser');     //to get the body of html request
const path = require('path');                     //to work with paths
// const cookieParser = require("cookie-parser");
// const { clearScreenDown } = require('readline');


const app = express();
app.listen(process.env.PORT || "8000");
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'public')))
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
   secret: "thisismysecrctekey",
   saveUninitialized: true,
   cookie: { maxAge: oneDay },
   resave: false
}));

let connection;

app.get('/', function (req, res) {
   connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'pagina'
   });
   connection.connect(async function (err) {
      if (err) {
         return console.error('error: ' + err.message);
      }
      console.log('Connected to the MySQL server.');
      if (req.session.userid) {
         res.redirect("category");
      }
      res.render("login");
   })
   
});

app.post('/login', function (req, res) {
   var username = req.body.uname;
   var password = req.body.upass;
   console.log("Username; " + username);
   let sql = `SELECT username FROM accounts WHERE username = ? AND password = ?`;

   connection.query(sql, [username, password], (error, results) => {
      if (error) {
         return console.error(error.message);
      }
      setUser(results[0].username);
   });

   function setUser(value) {
      req.session.userid = value;
      console.log(req.session.userid);

      if (req.session.userid) {
         console.log("should send file");
         res.redirect('/category');
      }
   }

});

app.get('/category', function (req, res) {
   if (req.session.userid){
      let sql = "SELECT * from classes";
   connection.query(sql, (error, results) => {
      if (error) {
         return console.error(error.message);
      }
      let classes = {};
      for (var i = 0; i < results.length; i++){
         classes[results[i].class_code] = results[i].class_description;
      }
      console.log(classes);
      res.render("category",{classes: classes});
   });
   } else{
      res.redirect("/");
   }
   
})

app.post("/quiz", function (req, res){
   if (req.session.userid){
 
      console.log(req.body.selected);
   } else{
      res.redirect("/");
   }
})

// // Sample query
// let sql = `SELECT * FROM accounts`;

// connection.query(sql, (error, results, fields) => {
//   if (error) {
//     return console.error(error.message);
//   }
//   console.log(results);
// });

// connection.end();



