const bcrypt = require('bcrypt');
const { hash } = require('../../../config');

// eslint-disable-next-line require-await
const hashPassword = async password => bcrypt.hash(password, hash.passwordHashRounds);

// eslint-disable-next-line require-await
const comparePassword = async (password, hashPasswordDB) => bcrypt.compare(password, hashPasswordDB);

module.exports = {
  hashPassword,
  comparePassword,
};
