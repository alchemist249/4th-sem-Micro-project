const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema({

    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NGO",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    institution: {
        type: String,
        required: true
    },

    month: String,

    type: String,

    date: String,

    description: String

}, {
    timestamps: true
});

module.exports =
    mongoose.model("Drive", driveSchema);