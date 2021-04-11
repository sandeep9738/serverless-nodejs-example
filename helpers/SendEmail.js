'use strict';
/* eslint-disable import/no-extraneous-dependencies */
const aws = require('aws-sdk');

const ses = new aws.SES({ region: 'ap-south-1' });

module.exports.sendEmail = async ({ ToAddresses, HtmlData, SubjectData, TextData }) => {
  const params = {
    Destination: {
      ToAddresses,
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: HtmlData,
        },
        Text: {
          Charset: 'UTF-8',
          Data: TextData,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: SubjectData,
      },
    },
    Source: process.env.SES_FROM,
  };

  return ses.sendEmail(params).promise();
};
