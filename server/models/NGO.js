const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    ngoName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }
});

module.exports =
    mongoose.model("NGO", ngoSchema);