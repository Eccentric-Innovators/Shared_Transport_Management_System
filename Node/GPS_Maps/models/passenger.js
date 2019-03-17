const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passengerSchema = new Schema({
    passengerId: {
        type: Number,
        required: true
    },
    passengerName: {
        type: String
    },
    phoneNo: {
        type: Number
    },
    address: {
        type: String
    },
    vehicleNo: {
        type: Number
    },
    stopId: {
        type: Number
    }
});

module.exports = mongoose.model('Passenger', passengerSchema);