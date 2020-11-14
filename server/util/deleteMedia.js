const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const shortid = require('shortid');

// Configuring AWS & Multer
AWS.config.loadFromPath('./config.json');
AWS.config.getCredentials(err => {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Access key loaded');
    }
});
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const deleteMedia = async (mediaName) => {
    const params = {  Bucket: 'seeds-platform', Key: mediaName };
    try {
        s3.deleteObject(params, (err, data) => {
            if (err) console.log(err, err.stack);  // error
            else console.log('Deleted media');                 // deleted
        }).promise();
    } catch (error) {
        console.log(error);
    }
}

module.exports = deleteMedia;