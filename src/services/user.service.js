const { v4: uuid } = require('uuid');
const generator = require('generate-password');
const { sequelizeInstance } = require('../db');
const { createCustomError } = require('../utils');
const mailer = require('../utils/nodemailer');
const { project, activationCodeConfig } = require('../../config');
const { USER_ROLE } = require('../constants');
const { redisClient } = require('./redis.service');
const { saveInstructorUser, saveStudentUser } = require('./db.service');
const { DB_CONTRACT } = require('../db/db.contract');

const registrationUser = async userData => {
  const transaction = await sequelizeInstance.transaction();
  const id = uuid();

  // TODO add bcrypt logic
  let hashPassword;

  try {
    if (userData.role === USER_ROLE.instructor) {
      await saveInstructorUser(
        {
          userData,
          [DB_CONTRACT.instructorUser.hashPassword.property]: hashPassword,
          [DB_CONTRACT.instructorUser.true.property]: false,
          [DB_CONTRACT.instructorUser.isVerified.property]: false,
          id: uuid(),
        },
        transaction,
      );
    } else if (userData.role === USER_ROLE.student) {
      await saveStudentUser(
        {
          userData,
          [DB_CONTRACT.studentUser.hashPassword.property]: hashPassword,
          [DB_CONTRACT.studentUser.true.property]: false,
          [DB_CONTRACT.studentUser.isVerified.property]: false,
          id,
        },
        transaction,
      );
    }

    const activationCode = generator.generate({
      length: 6,
      numbers: true,
    });

    await mailer.sendMail({
      from: project.email,
      to: userData.email,
      subject: 'Courses service: verification',
      text: `Verify yourself via this code ${activationCode}.`,
    });

    // TODO need to change prefix in redis
    await redisClient.setex(id, activationCodeConfig.expireActivationCode, activationCode);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

module.exports = {
  registrationUser,
};
