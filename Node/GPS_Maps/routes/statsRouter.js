const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const mongoose = require('mongoose');

var stats = require('../models/stats');

var today = moment().startOf('day');

const router = express.Router();

router.use(bodyParser.json());

router.route('/')
.post((req, res) => {
    stats.findOne({createdAt: {'$gte': today.toDate(), '$lte': moment(today).endOf('day').toDate()}, vehicleNo: req.body.vehicleNo})
    .then((stat) => {
        if(stat != null) {
            stat.data.push(req.body.data);
            stat.save()
            .then((stat) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({result: 'ok'});
            }, (err) => {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({result: 'Update not done. Please retry.'});
            });
        }
    }, (err) => {
        console.log(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'Update not done. Please retry.'});
    })
    .catch((err) => {
        console.log(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'Update not done. Please retry.'});
    });
})
.get((req, res) => {
    stats.findOne({createdAt: {'$gte': today.toDate(), '$lte': moment(today).endOf('day').toDate()}, vehicleNo: req.body.vehicleNo})
    .then((stat) => {
        data = stat.data[stat.data.length-1]
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({lat: data.lat, lng: data.lng});
    }, (err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'Update not done. Please retry.'});
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'Update not done. Please retry.'});
    });
});

router.route('/begin')
.post((req, res) => {
    stats.create(req.body)
    .then((stat) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'ok'});
    }, (err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'Update not done. Please retry.'});
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'Update not done. Please retry.'});
    });
});

module.exports = router;