'use strict';

const _ = require('lodash');
const helper = require('../helpers/DynamoDBOps');
const misc = require('../helpers/Misc');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  console.log(JSON.stringify(event));
  const body = JSON.parse(event.body);
  const { sellerId } = event.pathParameters;
  const { fullname, phone, email } = body;
  let password = body.password;

  const sellerData = await helper.getSingleData(`SELLER#${sellerId}`, 'SELLER#PROFILE');
  if (_.isEmpty(sellerData)) {
    return misc.generalResponse(400, {
      message: 'Seller does not exists',
    });
  }
  const data = await helper.queryWithIndexItem('email', 'email = :data', {
    ':data': email,
  });

  if (data.Count !== 0) {
    return misc.generalResponse(400, {
      message: 'User Already exists',
    });
  }
  password = misc.hashPassword(password);
  const {
    Attributes: { counterValue },
  } = await helper.updateAndGetCounterValue('USER');
  console.log('User Counter Value :', counterValue);

  await helper.add({
    pk: `USER#${counterValue}`,
    sk: `SELLER#${sellerId}#USER#PROFILE`,
    email,
    fullname,
    phone,
    password,
  });

  const token = jwt.sign({ data: `${email}` }, process.env.JWT_SECRET || '124$67#', {
    algorithm: 'HS512',
    expiresIn: '24h',
  });

  return misc.generalResponse(200, {
    message: 'User created successfully',
    fullname,
    email,
    token,
  });
};
