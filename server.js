var express = require('express');
var app = express();
app.use(express.static('public'))
app.use(express.static('views'))
var path = require('path');
var pug= require('pug');
app.set('view engine', 'pug')
var bodyParser = require('body-parser');
var session = require('express-session');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(session({secret: 'ssshhhhh'}));

 var knex = require('knex')({
   client: 'mysql',
   connection: {
     host : 'localhost',
     user : 'root',
     password : '',
     database : 'airline'
   }
 });

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

app.post('/flight',urlencodedParser, function(req, res) {
  //console.log(req.body);
  var from = req.body.from;
  var to = req.body.to;

  knex('flight').where({'from_location': from, 'to_location': to}).join('flight_details', 'flight.flight_id', '=', 'flight_details.flight_id').select().then(function(results){
    var resultsExists='true';
      if(results.length==0)
        res.render('flightnotfound', {results:  results,session: res.session.email});
      else res.render('flight', {results:  results});
  });
});

app.post('/register',urlencodedParser, function(req, res) {
    //  console.log(req.body);
    response= { first_name : req.body.first_name,
    last_name : req.body.last_name,
    email_id : req.body.email,
    password : req.body.password,
    address : req.body.address,
    tel_no : req.body.phone
              };
    var confirm_password = req.body.confirm_password;
    if(confirm_password!=response.password)
        res.render('signup',{msg : "Password entered do not match!!!"});
    else {
        knex('passenger_profile').insert(response).then(function(results){
            req.session.email=response.email_id;
            res.redirect('/')
        }).catch(function(err){
            res.render('signup',{msg : "Account already exists with given details!!!"});
        })
    }
});


app.post('/signin',urlencodedParser, function(req, res) {
    //  console.log(req.body);
    response= {
    email_id : req.body.email,
    password : req.body.password,
    };
    knex('passenger_profile').where(response).select().then(function(results){
    var resultsExists='true';
      if(results.length==1){
            req.session.email=response.email_id;
            res.redirect('/')
      }
      else res.render('signin',{msg : "Username or pasword is invalid!!!"});
  });
});
app.get('/history', function(req, res){});


