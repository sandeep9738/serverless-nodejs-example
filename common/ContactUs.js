const emailHelper = require('../helpers/SendEmail');
const misc = require('../helpers/Misc');

exports.handler = async (event) => {
  console.log(JSON.stringify(event));
  const body = JSON.parse(event.body);
  const { name, email, phone, message } = body;

  const HtmlData = `<h1 style="color: #5e9ca0;">User Details</h1>
  <h2 style="color: #2e6c80;">Name: ${name}</h2>
  <h2 style="color: #2e6c80;">Email: ${email}</h2>
  <h2 style="color: #2e6c80;">Phone: ${phone}</h2>
  <h2 style="color: #2e6c80;">Message:</h2>
  <h3> ${message}</h3>`;
  try {
    await emailHelper.sendEmail({
      ToAddresses: process.env.CONTACT_US_TO_ADDRS.split(','),
      SubjectData: 'New Enquiry Details',
      TextData: '',
      HtmlData,
    });
  } catch (err) {
    console.log(err);
    return misc.generalResponse(400, {
      message: 'Bad Request',
    });
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Enquiry details added',
    }),
  };
};
