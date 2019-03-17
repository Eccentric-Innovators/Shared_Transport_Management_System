const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var stopSchema = new Schema({
    stopId: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
});

var vehicleSchema = new Schema({
    vehicleNo: {
        type: Number,
        required: true
    },
    POC_No: {
        type: Number,
        required: true
    },
    route: [stopSchema]
});

module.exports = mongoose.model('Vehicle', vehicleSchema);