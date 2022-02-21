const aws = require('aws-sdk');

const s3 = new aws.S3({
    accessKeyId:process.env.keyID,
    secretAccessKey:process.env.secretAccessKey
});

module.exports = s3;