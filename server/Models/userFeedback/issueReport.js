const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    userEmail: {
        type: String,
        required: false
    },
    browser: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    }
}, { timestamps: true });

const issueModel = mongoose.model('Issue', issueSchema);

module.exports = issueModel;