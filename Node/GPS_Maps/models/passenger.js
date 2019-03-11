const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passengerSchema = new Schema({
    passengerId: {
        type: int,
        required: true
    },
    passengerName: {
        type: String
    },
    phoneNo: {
        type: int
    },
    address: {
        type: String
    },
    vehicleNo: {
        type: int
    },
    stopId: {
        type: int
    }
});

module.exports = mongoose.model('Passenger', passengerSchema);