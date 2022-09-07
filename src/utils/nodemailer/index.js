const nodemailer = require('nodemailer');
const { mailer } = require('../../../config');

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailer.email,
    pass: mailer.password,
  },
});
