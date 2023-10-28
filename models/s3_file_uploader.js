require('dotenv').config();
const AWS = require('aws-sdk');
const { json } = require('express');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
});

function uploadFileToS3(file, fileName, ext){
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: fileName, // 儲存在 S3 上的檔案名稱
            Body: file, // 檔案
            ContentType: ext // 副檔名
        };
        s3.upload(params, (err, data) => {
            if(err){
                errorMessage = err + err.stack;
                callback({'error': true, 'message': errorMessage});
            }else{
                callback({'ok': true});
            };
        });
    })
};

exports.uploadFileToS3 = uploadFileToS3;