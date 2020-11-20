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

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "video/mp4" || file.mimetype === 'video/mov' || file.mimetype === 'video/wmv') {
        cb(null, true);
    } else {
        console.log('Upload mimetype error: this file type is not permitted');
        cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};

const uploadFile = (file) => {
    const picId = shortid.generate();
    let uploadVideo = multer({
        fileFilter,
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