const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var dataPt = new Schema({
    sats: {
        type: Number
    },
    hdop: {
        type: Number
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    course: {
        type: Number
    },
    speed: {
        type: Number
    }
}, {
    timestamps: true
});

var statsSchema = new Schema({
    driverId: {
        type: Number,
        required: true
    },
    vehicleNo: {
        type: Number
    },
    data: [dataPt]
}, {
    timestamps: true
});

module.exports = mongoose.model('Stat', statsSchema);