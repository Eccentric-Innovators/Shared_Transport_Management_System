const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var stopSchema = new Schema({
    stopId: {
        type: int,
        required: true
    },
    lat: {
        type: double,
        required: true
    },
    lng: {
        type: double,
        required: true
    }
});

var vehicleSchema = new Schema({
    vehicleNo: {
        type: int,
        required: true
    },
    POC_No: {
        type: int,
        required: true
    },
    route: [stopSchema]
});

module.exports = mongoose.model('Vehicle', vehicleSchema);