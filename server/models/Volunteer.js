const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({

    drive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drive",
        required: true
    },

    volunteerName: {
        type: String,
        required: true
    },

    contact: {
        type: String,
        required: true
    },

    skills: {
        type: String,
        required: true
    },

    registeredAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
    mongoose.model("Volunteer", volunteerSchema);