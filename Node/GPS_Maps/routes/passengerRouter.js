const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Passenger = require('../models/passenger');

const passengerRouter = express.Router();

passengerRouter.use(bodyParser.json());

var adminAuth = (req, res, next) => {
    if(req.body.user == 'admin' && req.body.pass == 'pass') {
        return next();
    }
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({err: 'You are not authorized to access this route!'})
}

passengerRouter.use(adminAuth);

passengerRouter.route('/')
.get((req, res, next) => {
    Passenger.find({})
    .then((passengers) => {
        if (!passengers) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: 'No passengers found.', n: 0});
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(passengers);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Passenger.create(req.body)
    .then((passenger) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(passenger);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    Passenger.findOneAndUpdate(req.body.filter, {$set: req.body.updates}, {new: true})
    .then((passenger) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(passenger)
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Passenger.remove({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result)
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = passengerRouter;