var express = require('express');

var flightRouter = express.Router();

flightRouter.route('/')
    .get(function(req, res){
        res.render('Flights',{
            Title: 'Flights'
        } );
    })

module.exports = flightRouter;