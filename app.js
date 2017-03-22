var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var expressHandlebars = require('express-handlebars');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
var PORT = process.env.NODE_ENV || 1738;
app.engine('handlebars', expressHandlebars({defaultLayout: 'noteslayout'}));
app.set('view engine', 'handlebars');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'quick_notes_db'
});

app.get ('/', function(req, res) {
  connection.query("SELECT * FROM quick_notes", function(err, results) {
    if(err) {
      throw err;
    }
    console.log(results);

    var data = {
        notes: results
    }
    res.render('noteview', data);
  });
});

app.post('/', function(req, res) {
  var mySQLQuery = "INSERT INTO quick_notes (note) VALUES ('" + req.body.notedata + "')";

  connection.query(mySQLQuery, function(err, result) {
    if (err) {
      throw err
    }
    res.redirect('/');
  });
});

app.get('/delete/:id', function(req, res) {
  var mySQLQuery = "DELETE FROM quick_notes WHERE id=" + req.params.id;

  connection.query(mySQLQuery, function(err, result) {
    if (err) {
      throw err
    }
    res.redirect('/');
  });
});

app.post('/update/:id', function(req, res) {
  var mySQLQuery = "UPDATE quick_notes SET note=" + connection.escape(req.body.note) + "WHERE id=" + req.params.id;

  connection.query(mySQLQuery, function(err, result) {
    if (err) {
      throw err
    }
    res.redirect('/');
  });
});

app.get('/*', function(req, res) {
  res.redirect('/');
});

app.listen(PORT, function() {
  console.log('Listening on %s', PORT);
});