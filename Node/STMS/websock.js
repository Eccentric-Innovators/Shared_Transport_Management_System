const moment = require('moment');
const mongoose = require('mongoose');

var stats = require('./models/stats');

var today = moment().startOf('day');

module.exports = (io, sockets) => {
    io.sockets.on('connection', (socket) => {
        socket.on('vehicleNo', (msg) => {
            sockets.push({vehicleNo: parseInt(msg), socket: socket});
            sendData(socket, msg);
        });
    });
}

var sendData = (socket, vehicleNo) => {
    stats.findOne({createdAt: {'$gte': today.toDate(), '$lte': moment(today).endOf('day').toDate()}, vehicleNo: vehicleNo})
    .then((stat) => {
        if(!stat) {
            socket.emit('nodata', 'No data');
        } else {
            data = stat.data[stat.data.length-1];
            socket.emit('new data', data);
        }
    }, (err) => {
        socket.emit('error', err);
    })
    .catch((err) => {
        socket.emit('error', err);
    });
}