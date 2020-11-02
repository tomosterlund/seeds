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

const uploadFile = (file) => {
    const picId = shortid.generate();
    let uploadVideo = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'seeds-platform',
            acl: 'public-read',
            key: function (req, file, cb) {
            cb(null, 'VIDEO' + picId + file.originalname)
            }
        })
    });
    return uploadVideo.single('video')
}

module.exports = uploadFile;