// import dotenv 
require('dotenv').config();
// import AWS SDK
const AWS = require('aws-sdk');

// Amazon SES configuration
const SESConfig = {
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION
};

var params = {
    Source: 'zenproduc01@gmail.com',
    Destination: {
        ToAddresses: [
            'kenneth.granados@gmail.com'
        ]
    },
    ReplyToAddresses: [
        'zenproduc01@gmail.com',
    ],
    Message: {
        Body: {
            Html: {
                Charset: "UTF-8",
                Data: 'IT IS <strong>WORKING</strong>!'
            }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'Node + SES Example'
        }
    }
};

new AWS.SES(SESConfig).sendEmail(params).promise().then((res) => {
    console.log(res);
});