const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TTLschema = new Schema({
    newEmail: String,
    userId: String
}, { timestamps: true })

const TTLmodel = mongoose.model('TTLdata', TTLschema);

module.exports = TTLmodel;