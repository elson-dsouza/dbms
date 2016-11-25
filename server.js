var express = require('express');
var app = express();
app.use(express.static('front_end'))
var path = require('path');
var pug= require('pug');
app.set('view engine', 'pug')

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : 'elson.1996',
    database : 'airline'
  }
});

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("\nListening at http://%s:%s\n",host ,port)
})

app.get('/',function(req,res){
        //res.sendFile(path.join(__dirname + '/front_end/index.html'));
        knex.select().from('flight').then(function(rows) {var html=pug.renderFile('front_end/index_test.pug',{rows:rows});
                                                         res.send(html);
                                                          console.log("Pug rendered\n");})
        })
    .get('/test', function(req, res) {

//		knex.select().from('flight_details').then(function(rows) {console.log(rows); res.send(rows);})
//		knex.select().from('credit_card_details').then(function(rows) {console.log(rows); res.send(rows);})
//		knex.select().from('location').then(function(rows) {console.log(rows); res.send(rows);})
//		knex.select().from('passenger_profile').then(function(rows) {console.log(rows); res.send(rows);})
//		knex.select().from('ticket_info').then(function(rows) {console.log(rows); res.send(rows);})
    res.send("Test");

});
