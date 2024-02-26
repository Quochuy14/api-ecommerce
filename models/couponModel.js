const mongoose = require('mongoose');

var couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
        uppercase: true,
    },
    event: {
        type: String,
    },
    expiry: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('coupon', couponSchema);