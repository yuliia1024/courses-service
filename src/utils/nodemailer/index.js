const nodemailer = require('nodemailer');
const { project } = require('../../../config');

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: project.email,
    pass: project.password,
  },
});
