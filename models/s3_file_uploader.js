require('dotenv').config();
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
});

function uploadFileToS3(file, fileName, ext){
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: fileName, // 儲存在 S3 上的檔案名稱
        Body: file, // 檔案
        ContentType: ext // 副檔名
    };
    s3.upload(params, function(err, data) {
        if(err){
            errorMessage = err + err.stack;
            return {'error': true, 'message': errorMessage};
        }else{
            return {'ok': true};
        };
    });
};

exports.uploadFileToS3 = uploadFileToS3;