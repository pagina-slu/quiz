// const jsStringify = require('js-stringify');
const express = require('express');           //to get get post method request 
const mysql = require('mysql');               //to connect to database
const session = require('express-session');    //for session handling
const bodyParser = require('body-parser');     //to get the body of html request
const path = require('path');                     //to work with paths

const { resolve } = require('path');
const { get } = require('http');
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

let connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'root',
   database: 'pagina'
});
connection.connect(function (err) {
   if (err) {
      return console.error('error: ' + err.message);
   }
   console.log('Connected to the MySQL server.');
});
let classes = {};

app.get('/', function (req, res) {
   if (req.session.userid) {
      res.redirect("/home");
   } else {
      res.render("login");
   }
});


app.post('/login', function (req, res) {
   try {
      let username = req.body.uname;
      let password = req.body.upass;
      let sql = `SELECT username FROM accounts WHERE username = ? AND password = ?`;

      connection.query(sql, [username, password], (error, results) => {
         if (error) {
            return console.error(error.message);
         }
         try {
            setUser(results[0].username);
         } catch (e) {
            res.render('login', {message: "Invalid Credentials"});
         }
      });
   } catch (err) {
      res.redirect('/');
   }


   function setUser(value) {
      if (value && value.length > 0) {
         req.session.userid = value;
         console.log("User Connected: " + req.session.userid);
         // req.flash('success', 'Data added successfully!')

         if (req.session.userid) {
            // console.log("should send file");
            res.redirect('/home');
         }
      } else {
         res.redirect('/');
      }
   }

});

app.get("/logout", (req, res) => {
   req.session.destroy();
   res.redirect("/");
})

app.get('/home', function (req, res) {
   if (req.session.userid) {
      let sql = "SELECT * from classes";
      connection.query(sql, (error, results) => {
         if (error) {
            return console.error(error.message);
         }

         for (var i = 0; i < results.length; i++) {
            classes[results[i].class_code] = results[i].class_description;
         }
         // console.log(classes);
         getStudentName();

      });
   } else {
      res.redirect("/");
   }

   function getStudentName() {
      let sql = "SELECT * from students WHERE student_id = ?";
      connection.query(sql, [req.session.userid], (error, results) => {
         if (error) {
            return console.error(error.message);
         }
         res.render("home", { classes: classes, username: results[0].first_name });
      })
   }
})


app.post("/test/:code", function (req, res) {
   if (req.session.userid) {

      var classCode = req.params.code;

      let sql = "SELECT * FROM tests where class_code=?";
      connection.query(sql, [classCode], (error, results) => {
         if (error) {
            return console.error(error.message);
         }
         getStudentName(results);
      })
   } else {
      res.redirect("/");
   }

   function getStudentName(r) {
      let sql = "SELECT * from students WHERE student_id = ?";
      connection.query(sql, [req.session.userid], (error, results) => {
         if (error) {
            return console.error(error.message);
         }
         res.render("test", { username: results[0].first_name, code: classCode, subject: classes[classCode].toString(), tests: r });
      })
   }
})

app.post("/quiz/:code", (req, res) => {
   if (req.session.userid) {
      var testId = req.params.code;
      req.session.testId = testId;
      let sql = "SELECT * FROM questions where test_id=?";

      connection.query(sql, [testId], (error, results) => {
         if (error) { return console.error(error.message); }
         getQuestions(results);
      })

   } else {
      res.redirect("/");
   }

   function getQuestions(results) {
      let sql = "SELECT * FROM question_choices WHERE question_id=?"
      let r = results;
      let multipleChoiceCounter = 0;
      let queryCounter = 0;
      r.forEach((question) => {
         if (question.question_type == 'multiple-choice') {
            multipleChoiceCounter++;
            connection.query(sql, [question.question_id], (error, results) => {
               if (error) {
                  return console.error(error.message);
               }
               question.question_choices = results;
               queryCounter++;
               if (queryCounter == multipleChoiceCounter) {
                  req.session.questions = r;
                  res.render("quiz", { questions: r });
               }
            });
         }
      })
   }
})

app.post("/submit", (req, res) => {
   if (req.session.userid) {
      let timestamp = Date.now();
      let responseId = req.session.userid + req.session.testId + timestamp;
      console.log("response ID: " + typeof responseId);
      let responseSQL = 'INSERT INTO `responses`(`response_id`, `test_id`, `student_id`, `is_checked`, `score`) VALUES (?,?,?,?,?)';
      let responseValues = [responseId, req.session.testId, req.session.userid, false, 0];
      console.log(responseValues);

      connection.query(responseSQL, responseValues, (error, results) => {
         if (error) { return console.error(error.message); }
         console.log();
         insertResponseDetails(responseId);
      })
      let i = 0;
      console.log(eval("req.body.q" + i));
      console.log(req.body.q1);
   } else {
      res.redirect("/");
   }

   function insertResponseDetails(responseId) {
      let detailsSQL = 'INSERT INTO response_details(response_id, question_id, answer) VALUES ?';
      let detailValues = [[]];
      for (var i = 0; i < req.session.questions.length; i++) {
         let response = [];
         response.push(responseId);
         response.push(req.session.questions[i].question_id);
         response.push(eval("req.body.q" + i));
         console.log("response: " + response);
         detailValues[0].push(response);
         // req.body.q0
      }

      connection.query(detailsSQL, detailValues, (error, results) => {
         if (error) { return console.error(error.message); }
         console.log("Response saved");
         res.render("submitted");
      })
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



