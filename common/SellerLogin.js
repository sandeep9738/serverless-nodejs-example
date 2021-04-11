'use strict';

const _ = require('lodash');
const helper = require('../helpers/DynamoDBOps');
const misc = require('../helpers/Misc');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  console.log(JSON.stringify(event));
  const body = JSON.parse(event.body);
  const { email, password } = body;
  let data = await helper.queryWithIndexItem('email', 'email = :data', {
    ':data': email,
  });
  console.log('Seller data ', data);
  if (data.Count === 0) {
    return misc.generalResponse(404, {
      message: 'Seller Not exists',
    });
  }
  data = _.head(data.Items);
  if (!misc.verifyPassword(password, data.password)) {
    return misc.generalResponse(400, {
      message: 'Invalid Credentials',
    });
  }

  const token = jwt.sign(
    { data: `${data.email}`, isSeller: true },
    process.env.JWT_SECRET || '124$67#',
    {
      algorithm: 'HS512',
      expiresIn: '24h',
    }
  );

  const response = _.omit(data, ['pk', 'sk', 'password']);

  return misc.generalResponse(200, {
    message: 'User logged in successfully',
    ...response,
    token,
  });
};
