const nodemailer = require('nodemailer');
const { mailerConfig } = require('../../../config');

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailerConfig.email,
    pass: mailerConfig.password,
  },
});
