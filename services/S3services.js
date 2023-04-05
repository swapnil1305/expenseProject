const AWS = require('aws-sdk');


const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expensetrack1';
    const IAM_USER_KEY = 'AKIA3Z26O42LT6F6WC65';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
       
    })

        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }
        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if(err){
                    console.log('Something went wrong', err)
                    reject(err);
                }else {
                    console.log('success', s3response);
                   resolve(s3response.Location);
                }
                })
        })
    }

    module.exports = {
        uploadToS3
    }