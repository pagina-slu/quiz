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

let connection;
let classes = {};
app.get('/', function (req, res) {
   connection = mysql.createConnection({
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
      // console.log(req.session.userid);

      if (req.session.userid) {
         // console.log("should send file");
         res.redirect('/category');
      }
   }

});

app.get('/category', function (req, res) {
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
         res.render("category", { classes: classes });
      });
   } else {
      res.redirect("/");
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
         res.render("test", { code: classCode, subject: classes[classCode].toString(), tests: results });

      })
   } else {
      res.redirect("/");
   }
})

app.post("/quiz/:code", (req, res) => {
   let results1;
   if (req.session.userid) {
      var testId = req.params.code;
      // console.log("test id = " + testId);

      let sql = "SELECT * FROM questions where test_id=?";

      connection.query(sql, [testId], (error, results) => {
         if (error) { return console.error(error.message); }
         putResults(results);

         // const questions = await getQuestions(results);
         // const r = await questions;
         // renderQuiz(await r);

         // questions.forEach((question) => {
         //    if (question.question_type == 'multiple-choice') {
         //       connection.query(sql, [question.question_id], (error, result) => {
         //          if (error) {
         //             return console.error(error.message);
         //          }
         //          console.log("dapat nauuna tong query, pero nahuhuli: " + result);
         //          getQuestions(question, result);

         //       });
         //       console.log("Dapat makuha muna to " + question.question_choices);
         //    }
         // })   
      })
      // console.log(results1);

      // sql = "SELECT * FROM question_choices WHERE question_id=?";
      // let questions = await getQuestions(results1);

   } else {
      res.redirect("/");
   }
   function putResults(res) {
      results1 = res;
      getQuestions(results1);
   }
   // async function sample(result) {
   //    let results = result;
   //    let sql = "SELECT * FROM question_choices WHERE question_id=?";
   //    // console.log(results[0]);
   //    for (let i = 0; i < results.length; i++) {
   //       console.log(results[i]);
   //       if (results[i].question_type == 'multiple-choice') {
   //          await connection.query(sql, [results[i].question_id], (error, result) => {
   //             if (error) {
   //                return console.error(error.message);
   //             }
   //             console.log("dapat nauuna tong query, pero nahuhuli: " + result);
   //             results[i].question_choices = result;
   //             // console.log(results[i]);
   //             if (i == results.length) {
   //                renderQuiz(results);
   //                // console.log("render quiz:" + r);
   //                // res.render("quiz", { questions: results });
   //             }
   //             return;

   //          });
   //          // console.log("Dapat makuha muna to " + results[i].question_choices);
   //       }

   //    }
   // }
   function renderQuiz(r) {
      console.log(r);
      res.render("quiz", { questions: r });

   }
   // function getQuestions(question, results) {
   //    question.question_choices = results;
   //    // console.log(r);
   //    // renderQuiz(r);
   // }

   function getQuestions(results) {
      let sql = "SELECT * FROM question_choices WHERE question_id=?"
      let r = results;
      // console.log(r);
      r.forEach((question, key, arr) => {
         if (question.question_type == 'multiple-choice') {
            connection.query(sql, [question.question_id], (error, results) => {
               if (error) {
                  return console.error(error.message);
               }
               // console.log("dapat nauuna tong query, pero nahuhuli: " + results);
               question.question_choices = results;
               console.log("dapat nauuna tong query, pero nahuhuli: " + question.question_choices);
               res.render("quiz", { questions: r});
               // if (key == arr.length-1) {
               //    console.log("Last callback call at index " + key + " with value " + question);
               // }

            });
            console.log("Dapat makuha muna to " + question.question_choices);
         }

      })

   }

   // function getQuestions(results) {
   //    let sql = "SELECT * FROM question_choices WHERE question_id=?"
   //    let r = results;

   //    return new Promise( (resolve, reject) =>{
   //       r.forEach((question) => {
   //          if (question.question_type == 'multiple-choice') {
   //             connection.query(sql, [question.question_id],  (error, results) => {
   //                if (error) {
   //                   reject (console.error(error.message));
   //                }
   //                console.log("dapat nauuna tong query, pero nahuhuli: " + results);
   //                question.question_choices = results;

   //             });
   //             console.log("Dapat makuha muna to " + question.question_choices);
   //          }
   //       })

   //       resolve(r);
   //    })
   // }
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



