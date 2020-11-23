const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContentCreatorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    premiumUser: {
        type: Boolean,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    courses: {
        type: Array
    },
    joinDate: {
        type: Date,
        default: Date.now()
    },
    verified: {
        type: Boolean,
        required: true
    },
    language: {
        type: String,
        required: false
    }
});

const ContentCreatorModel = mongoose.model('User', ContentCreatorSchema);

module.exports = ContentCreatorModel;