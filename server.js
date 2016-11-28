var express = require('express');
var app = express();
app.use(express.static('public'))
app.use(express.static('views'))
var path = require('path');
var pug= require('pug');
app.set('view engine', 'pug')

 var knex = require('knex')({
   client: 'mysql',
   connection: {
     host : 'localhost',
     user : 'root',
     password : '',
     database : 'airline'
   }
 });

//var mysql      = require('mysql');
//var connection = mysql.createConnection({
//    host : 'localhost',
//    user : 'root',
//    password : '',
//    database : 'airline'
//});
//connection.connect(function(err) {
//  if (err) {
//    console.error('error connecting: ' + err.stack);
//    return;
//  }
//
//  console.log('connected as id ' + connection.threadId);
//});

var server = app.listen(8080, function () {
	var host = server.address().address;
	var port = server.address().port;

  console.log("\nListening at http://%s:%s\n",host ,port);
});

// var flightRouter = require(__dirname + 'routes/flightRouter.js');

app.get('/',function(req,res){
   knex.select().from('flight').then(function(rows) {
     knex.distinct('from_location').select().from('flight').orderBy('from_location', 'asc').then(function(rows){
       var html=pug.renderFile('views/index_test.pug',{rows:rows});
       res.send(html);
       console.log("Pug of index page rendered\n");})
     })
//  connection.query('SELECT distinct `from_location` FROM `flight` ORBER BY `from_location` asc', function (error, rows, fields) {
//      var html=pug.renderFile('views/index_test.pug',{rows:rows});
//      res.send(html);
//      console.log("Pug of index page rendered\n");
//    });
});

app.get('/about', function(req, res) {
  var html=pug.renderFile('views/about.pug');
  res.send(html);
  console.log("Pug of about page rendered\n");
});

app.get('/account', function(req, res) {
  res.render('account');
  console.log("Pug of account page rendered\n");
});


app.get('/signin', function(req, res) {
  res.render('signin');
  console.log("Pug of signin page rendered\n");
});


app.get('/signup', function(req, res) {
  res.render('signup');
  console.log("Pug of signup page rendered\n");
});

app.get('/flight', function(req, res) {
  var from = req.headers.from;
  var to = req.headers.to;
  knex('flight').where({
    'from_location': from,
      'to+location': to}).select().then(function(rows){
//  connection.query('SELECT * FROM `flight` WHERE `from_location` = "'+from+'"' + ' and `to_location` = "'+to+'"', function (error, results, fields) {
    console.log("results" + results[0].from_location);
      res.render('flight', {results:  results});
  });
});
//app.use('/flight', flightRouter);

// res.sendFile(path.join(__dirname + '/views/about.html'))
//		knex.select().from('flight_details').then(function(rows) {console.log(rows); res.send(rows);})
//		knex.select().from('credit_card_details').then(function(rows) {console.log(rows); res.send(rows);})
//		knex.select().from('location').then(function(rows) {console.log(rows); res.send(rows);})
//		knex.select().from('passenger_profile').then(function(rows) {console.log(rows); res.send(rows);})
//		knex.select().from('ticket_info').then(function(rows) {console.log(rows); res.send(rows);})
    //res.send("Test");

