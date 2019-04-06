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
            console.log(req.body.data);
            stat.data.push(req.body.data);
            stat.save()
            .then((stat) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({result: 'ok'});
                req.sockets.forEach((socket) => {
                    if (socket.vehicleNo == req.body.vehicleNo) {
                        socket.socket.emit('new data', req.body.data);
                    }
                });
            }, (err) => {
                console.log(err);
                res.statusCode = 0;
                res.setHeader('Content-Type', 'application/json');
                res.json({result: 'Update not done. Please retry.', err: err});
            });
        } else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json({result: 'Please begin first.'});
        }
    }, (err) => {
        console.log(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'Update not done. Please retry.', err: err});
    })
    .catch((err) => {
        console.log(err);
        res.statusCode = 418;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'Update not done. Please retry.', err: err});
    });
})
.get((req, res) => {
    stats.findOne({createdAt: {'$gte': today.toDate(), '$lte': moment(today).endOf('day').toDate()}, vehicleNo: req.query.vehicleNo})
    .then((stat) => {
        if(!stat) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({result: 'No data.'});
        } else {
            data = stat.data[stat.data.length-1]
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({lat: data.lat, lng: data.lng});
        }
    }, (err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'No data.', err: err});
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'No data.', err: err});
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
        res.json({result: 'Update not done. Please retry.', err: err});
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({result: 'Update not done. Please retry.', err: err});
    });
});

module.exports = router;