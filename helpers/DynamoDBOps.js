'use strict';
/* eslint-disable import/no-extraneous-dependencies */
const aws = require('aws-sdk');

const documentClient = new aws.DynamoDB.DocumentClient();

/**
 * To get counter value.
 *
 * @param {string} pk Primary Key of table.
 * @return {Promise<PromiseResult<Item>>}
 */

// Make sure that for any PK value - counterValue is set initially to zero or any number

module.exports.updateAndGetCounterValue = async (pk) => {
  const params = {
    TableName: process.env.APP_TABLE,
    Key: {
      pk,
      sk: 'COUNTER',
    },
    UpdateExpression: 'set counterValue = counterValue + :val',
    ExpressionAttributeValues: {
      ':val': 1,
    },
    ReturnValues: 'UPDATED_NEW',
  };
  const data = await documentClient.update(params).promise();

  return data;
};

/**
 * To get single data based on query of primary and secondary key.
 *
 * @param {string} pk Primary Key of table.
 * @param {string} sk Secondary Key of table.
 * @return {Promise<PromiseResult<Item>>}
 */

module.exports.getSingleData = async (pk, sk) => {
  const params = {
    TableName: process.env.APP_TABLE,
    Key: {
      pk,
      sk,
    },
  };
  const data = await documentClient.get(params).promise();

  return data.Item;
};

/**
 * To get objects data based on query of Indexname & KeyConditionExpression.
 *
 * @param {string} tableName Name of Dynamo DB Table.
 * @param {string} keyExpression is the one with primary key and other condition expression.
 * @param {string} values Values for the condition specified.
 * @return {Promise<PromiseResult<Items>>}
 */
module.exports.queryWithIndexItem = async (indexName, keyExpression, values) => {
  const params = {
    TableName: process.env.APP_TABLE,
    IndexName: indexName,
    KeyConditionExpression: keyExpression,
    ExpressionAttributeValues: values,
  };
  return documentClient.query(params).promise();
};

/**
 * To get objects data based on query of KeyConditionExpression.
 *
 * @param {string} keyExpression is the one with primary key and other condition expression.
 * @param {string} values Values for the condition specified.
 * @return {Promise<PromiseResult<Items>>}
 */
module.exports.queryItem = async (keyExpression, values) => {
  const params = {
    TableName: process.env.APP_TABLE,
    KeyConditionExpression: keyExpression,
    ExpressionAttributeValues: values,
  };
  return documentClient.query(params).promise();
};

/**
 * To get multiple objects data based on query of KeyConditionExpression.
 *
 * @param {string} keyExpression is the one with primary key and other condition expression.
 * @param {string} values Values for the condition specified.
 * @return {Promise<PromiseResult<Items>>}
 */
module.exports.getAllItems = async (keyExpression, values) => {
  const params = {
    TableName: process.env.APP_TABLE,
    KeyConditionExpression: keyExpression,
    ExpressionAttributeValues: values,
  };
  return queryAllItems(params);
};

const queryAllItems = async (params) => {
  let data = await documentClient.query(params).promise();
  let { Items } = data;
  if (data.LastEvaluatedKey) {
    params.ExclusiveStartKey = data.LastEvaluatedKey;
    data = await documentClient.query(params).promise();
    Items = [...Items, ...data.Items];
  }
  return Items;
};

module.exports.add = async (keys) => {
  const params = {
    TableName: process.env.APP_TABLE,
    Item: {
      ...keys,
      createdAt: Date.now(),
    },
  };

  return documentClient.put(params).promise();
};

/**
 * To Update data based on pk, sk.
 *
 * @param {string} pk is the one with primary key.
 * @param {string} sk is the one with secondary key.
 * @param {string} values the one which values going to update.
 * @return {Promise<PromiseResult<result>>}
 */
module.exports.update = async (pk, sk, updateExp, expAttr, values) => {
  const params = {
    TableName: process.env.APP_TABLE,
    Key: {
      pk,
      sk,
    },
    UpdateExpression: updateExp,
    ExpressionAttributeNames: expAttr,
    ExpressionAttributeValues: values,
  };

  return documentClient.update(params).promise();
};
