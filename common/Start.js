exports.handler = async _event => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Welcome Ecom Solutions',
    }),
  };
};
