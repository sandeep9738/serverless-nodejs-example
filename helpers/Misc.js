const bcrypt = require('bcrypt');

module.exports.verifyPassword = function (inputPassword, dbPassword) {
  return bcrypt.compareSync(inputPassword, dbPassword);
};

module.exports.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

module.exports.generalResponse = (statusCode, response) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(response),
  };
};
