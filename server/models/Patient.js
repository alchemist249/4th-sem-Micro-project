const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({

    drive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drive",
        required: true
    },

    patientName: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    healthConcern: {
        type: String,
        required: true
    },

    registeredAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
    mongoose.model("Patient", patientSchema);