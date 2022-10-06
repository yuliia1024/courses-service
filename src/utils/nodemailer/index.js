const nodemailer = require('nodemailer');
const { mailerConfig } = require('../../../config');

module.exports = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: mailerConfig.email,
    pass: mailerConfig.password,
  },
});
