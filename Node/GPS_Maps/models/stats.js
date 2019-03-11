const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var dataPt = new Schema({
    lat: {
        type: double,
        required: true
    },
    lng: {
        type: double,
        required: true
    },
    speed: {
        type: double
    }
});

var statsSchema = new Schema({
    driverId: {
        type: int,
        required: true
    },
    vehicleNo: {
        type: int
    },
    data: [dataPt]
});

module.exports = mongoose.model('Stat', statsSchema);