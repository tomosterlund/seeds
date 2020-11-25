const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const limitSchema = Schema({
    userId: {
        type: String,
        required: true
    },
    emailCount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const limitModel = mongoose.model('emaillimit', limitSchema);

module.exports = limitModel;