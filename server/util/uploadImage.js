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
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only MP4, MOV and WMV is allowed!"), false);
    }
};

const uploadFile = (file) => {
    const picId = shortid.generate();
    let uploadPic = multer({
        fileFilter,
        storage: multerS3({
            s3: s3,
            bucket: 'seeds-platform',
            acl: 'public-read',
            key: function (req, file, cb) {
            cb(null, picId + file.originalname)
            }
        })
    });
    return uploadPic.single('image')
}

module.exports = uploadFile;