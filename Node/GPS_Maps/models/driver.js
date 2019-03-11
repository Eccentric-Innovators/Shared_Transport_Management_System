const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var driverSchema = new Schema({
    driverId: {
        type: int,
        required: true
    },
    driverName: {
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
    rating: {
        type: double,
        max: 5,
        min: 0
    }
});

module.exports = mongoose.model('Driver', driverSchema);