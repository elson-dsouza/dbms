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
var sess = {isEnabled : false, fname : null, lname : null, email : null};

app.get('/',function(req,res){
  // sess = res.session;
  knex.select().from('flight').then(function(rows) {
     knex.distinct('from_location').select().from('flight').orderBy('from_location', 'asc').then(function(rows){
       
       var html=pug.renderFile('views/index_test.pug',{rows:rows, session: sess});
       res.send(html);
       console.log("Pug of index page rendered\n");})
     })
     
});

app.get('/about', function(req, res) {
  var html=pug.renderFile('views/about.pug', {session: sess});
  res.send(html);
  console.log("Pug of about page rendered\n");
});

app.get('/account', function(req, res) {
  if(sess.isEnabled){
    knex('passenger_profile').where({'email_id': sess.email}).select().then(function(results){
      if(results.length==1)
        var accountInfo = { email: results[0].email,
                            telno: results[0].tel_no,
                            addess: results[0].address}
        var creditInfo = {
          cardNo: '9663 7384 3384 4565',
          type: 'Master Card',
          expiry: '07/11'
        }
        res.render('account', {session: sess, creditInfoAvailable: false, accountInfo: accountInfo, creditInfo: creditInfo});
    });
  }
  else res.render('signin',{msg : "Please Sign in to see your account information"})
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
  knex('flight').where({'from_location': from, 'to_location': to}).select().then(function(results){
    var resultsExists='true';
      if(results.length==0)
        res.render('flightnotfound', {results:  results, session: sess});
      else res.render('flight', {results:  results,session: sess});
  });
});

app.post('/signup',urlencodedParser, function(req, res) {
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
            sess.isEnabled = true;
            sess.email=response.email_id;
            sess.fname = response.first_name;
            sess.lname = response.last_name;
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
            sess.isEnabled = true;
            sess.email=response.email_id;
            sess.fname = results[0].first_name;
            sess.last_name = results[0].last_name;
            res.redirect('/')
      }
      else res.render('signin',{msg : "Username or pasword is invalid!!!"});
  });
});


//not implemented
app.post('/book',urlencodedParser, function(req, res) {
    response= {
    flight_no : req.body.flight_no,
    seats : req.body.seats,
    email_id : req.body.email
    };
    if(response.email_id == null){
      res.render('signin',{msg : "Please sign in to Book tickets"});
    }
    else{
      //check if credit card details are enabled to user
    }
});

app.get('/history', function(req, res){
  if(sess.isEnabled){
    //fetch history for current user
    if(results.length > 0)
      hasHistory = true;
    else hasHistory = false;
    results = [{
      flight_id: '6E 678',
      flight_departure_date: '',
      status: '4 tickets',
      arrival_time: '6:08:00',
      departure_time: '7:08:00',
      from_location: 'Bengaluru',
      to_location: 'Chennai'
    },{
      flight_id: '6E 500',
      flight_departure_date: '',
      status: '5 tickets',
      arrival_time: '6:08:00',
      departure_time: '7:08:00',
      from_location: 'Bengaluru',
      to_location: 'Chennai'
    }];
    if(hasHistory)
      res.render('history', {session: sess, results: results});
    else 
      res.render('nohistory', {session: sess});
  }
  else res.render('signin',{msg : "Please Sign in to see history"})
});

app.get('/logout',function(req, res){
    sess.isEnabled = false;
    sess.email=null;
    res.redirect('/');
});

app.get('/enterCreditCardDetails', function(req, res){
  res.render('fillCreditCard', {session: sess});
});
app.post('/enterCreditCardDetails', function(req, res){
    response= { card_number : req.body.card_no,
                card_type : req.body.card_type,
                expiration_month : req.body.emonth,
                expiration_year : req.body.eyear
              };
    // put the response in the database, check data types
});
app.get('/logout',function(res, req){
    req.session.email=false;
    res.redirect('/');
})


