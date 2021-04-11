'use strict';

const _ = require('lodash');
const helper = require('../helpers/DynamoDBOps');
const misc = require('../helpers/Misc');

exports.handler = async (event) => {
  console.log(JSON.stringify(event));

  const { sellerId, userId } = event.pathParameters;

  const sellerData = await helper.getSingleData(`SELLER#${sellerId}`, 'SELLER#PROFILE');
  if (_.isEmpty(sellerData)) {
    return misc.generalResponse(400, {
      message: 'Seller does not exists',
    });
  }

  if (!userId) {
    const data = await helper.queryWithIndexItem('sk_data', 'sk = :data', {
      ':data': `SELLER#${sellerId}#USER#PROFILE`,
    });
    const response = _.map(data.Items, (item) => {
      return _.omit(item, ['pk', 'sk', 'password']);
    });
    return misc.generalResponse(200, response);
  }
  const data = await helper.getSingleData(`USER#${userId}`, `SELLER#${sellerId}#USER#PROFILE`);
  const response = _.omit(data, ['pk', 'sk', 'password']);

  return misc.generalResponse(200, response);
};
