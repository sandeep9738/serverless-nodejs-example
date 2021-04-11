'use strict';

const jwt = require('jsonwebtoken');
const misc = require('../helpers/Misc');
const helper = require('../helpers/DynamoDBOps');

exports.handler = async (event) => {
  console.log(JSON.stringify(event));
  const token = event.authorizationToken;
  if (!token) {
    return misc.generalResponse(401, {
      message: 'Invalid token or not found',
    });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token Data ', tokenData);
    const data = await helper.queryWithIndexItem('email', 'email = :data', {
      ':data': tokenData.data,
    });

    console.log('User Data', data);
    if (data.Count === 0) {
      throw new Error('UnAuthorized');
    }
    return generatePolicy('user', 'Allow', event.methodArn);
  } catch (err) {
    console.log(err);
    return misc.generalResponse(401, {
      message: 'UnAuthorized',
    });
    // return generatePolicy('user', 'Deny', event.methodArn);
  }
};

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};
