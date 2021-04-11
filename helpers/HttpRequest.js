'use strict';

const axios = require('axios');
const https = require('https');

module.exports = async (url, method, headers, params, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!headers) {
      headers = {
        'content-type': 'application/json',
      };
    }

    const options = {
      method,
      headers,
      params,
      data,
      url,
      // TODO: Need to delete statement after sandbox server added SSL certificate
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };

    return await axios(options);
  } catch (error) {
    throw error;
  }
};
