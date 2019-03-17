const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Driver = require('../models/driver');

const driverRouter = express.Router();

driverRouter.use(bodyParser.json());

var adminAuth = (req, res, next) => {
    if(req.body.user == 'admin' && req.body.pass == 'pass') {
        return next();
    }
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({err: 'You are not authorized to access this route!'})
}

driverRouter.use(adminAuth);

driverRouter.route('/')
.get((req, res, next) => {
    Driver.find({})
    .then((drivers) => {
        if (!drivers) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: 'No drivers found.', n: 0});
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(drivers);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Driver.create(req.body)
    .then((driver) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(driver);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    Driver.findOneAndUpdate(req.body.filter, {$set: req.body.updates}, {new: true})
    .then((driver) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(driver)
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Driver.remove({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result)
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = driverRouter;