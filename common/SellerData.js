'use strict';

const _ = require('lodash');
const helper = require('../helpers/DynamoDBOps');
const misc = require('../helpers/Misc');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  console.log(JSON.stringify(event));

  switch (event.httpMethod) {
    case 'GET':
      return getSeller(event);
    case 'POST':
      return createSeller(event);
    // case 'PATCH':
    //   return patchSeller(event);
    default:
      break;
  }
  return misc.generalResponse(400, {
    message: 'Bad Request',
  });
};

const getSeller = async (event) => {
  const { sellerId } = event.pathParameters;
  const data = await helper.getSingleData(`SELLER#${sellerId}`, 'SELLER#PROFILE');
  const response = _.omit(data, ['pk', 'sk', 'password']);

  return misc.generalResponse(200, response);
};

const createSeller = async (event) => {
  const body = JSON.parse(event.body);
  const { fullname, phone, email } = body;

  const data = await helper.queryWithIndexItem('email', 'email = :data', {
    ':data': email,
  });

  if (data.Count !== 0) {
    return misc.generalResponse(400, {
      message: 'Seller Already exists',
    });
  }

  const {
    Attributes: { counterValue },
  } = await helper.updateAndGetCounterValue('SELLER');
  console.log('Seller Counter Value :', counterValue);

  const password = misc.hashPassword(body.password);

  await helper.add({
    pk: `SELLER#${counterValue}`,
    sk: 'SELLER#PROFILE',
    email,
    fullname,
    phone,
    password,
  });

  const token = jwt.sign(
    { data: `${email}`, isSeller: true },
    process.env.JWT_SECRET || '1234$67#',
    {
      algorithm: 'HS512',
      expiresIn: '24h',
    }
  );

  return misc.generalResponse(200, {
    message: 'Seller created successfully',
    fullname,
    email,
    token,
  });
};
// const patchSeller = async (event) => {

// };
