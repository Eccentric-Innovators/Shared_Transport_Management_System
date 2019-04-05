const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var driverSchema = new Schema({
    driverId: {
        type: Number,
        required: true
    },
    driverName: {
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
    rating: {
        type: Number,
        max: 5,
        min: 0
    }
});

module.exports = mongoose.model('Driver', driverSchema);