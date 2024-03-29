const generator = require('generate-password');
const { v4: uuid } = require('uuid');
const { isEmpty, isArray } = require('lodash');
const { Op } = require('sequelize');
const nodemailer = require('../utils/nodemailer');
const {
  USER_ROLE,
  STUDENT_COURSES_STATUS,
} = require('../constants');
const { BadRequestError } = require('../error-handler');
const {
  saveStudentUser,
  updateStudentUserById,
  getAllStudentUsersByOptions,
  getCoursesByStudentIdAndOptions,
  createStudentFeedback,
} = require('./db.service');
const { DB_CONTRACT } = require('../db/db.contract');
const { sequelizeInstance } = require('../db');
const {
  createCustomError,
  checkDataFromDB,
  createOrderParameters,
} = require('../utils');
const { declineTokensByAdmin } = require('./token.service');
const { hashPassword } = require('../utils/bcrypt');
const { mailerConfig, passwordGeneratorOptions } = require('../../config');
const {
  createPaginateOptions,
  createDataObjectWithPaginationInfo,
} = require('../utils/pagination');
const { checkUserPermissionToAccessCourseInfo } = require('./courses.service');

const createStudentUser = async req => {
  const transaction = await sequelizeInstance.transaction();
  const id = uuid();
  const password = generator.generate(passwordGeneratorOptions);

  try {
    const hashedPassword = await hashPassword(password);

    await saveStudentUser({
      ...req.body,
      id,
      [DB_CONTRACT.studentUser.hashPassword.property]: hashedPassword,
      [DB_CONTRACT.studentUser.isActive.property]: true,
      [DB_CONTRACT.common.createdBy.property]: req.userId,
      [DB_CONTRACT.studentUser.role.property]: USER_ROLE.student,
    }, transaction);

    await nodemailer.sendMail({
      from: mailerConfig.email,
      to: req.body.email,
      subject: 'Courses service: account created',
      text: `Student account for this email address has been created. Your password is: ${password}`,
    });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

const updateStudentUser = async (id, loggedInUserId, data) => {
  const dataObject = {
    ...data,
    ...(data.password && { [DB_CONTRACT.studentUser.hashPassword.property]: await hashPassword(data.password) }),
    [DB_CONTRACT.common.updatedBy.property]: loggedInUserId,
  };

  const result = await updateStudentUserById(id, dataObject);

  checkDataFromDB(result[0]);
};

const inactiveStudentUser = async (req, id) => {
  if (!id) {
    throw new BadRequestError('ID is not provided');
  }
  const transaction = await sequelizeInstance.transaction();

  try {
    await updateStudentUserById(id, {
      [DB_CONTRACT.studentUser.isActive.property]: false,
      [DB_CONTRACT.common.updatedBy.property]: req.userId,
    }, transaction);

    await declineTokensByAdmin(id);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

const getAllStudentsUser = async (data, studentIds = null) => {
  try {
    const {
      offset,
      limit,
      orderBy,
      orderDirection,
      isActive,
    } = data;

    const order = createOrderParameters(orderBy, orderDirection);

    let options = createPaginateOptions(offset, limit, order);

    if (isActive !== undefined || isArray(studentIds)) {
      options = {
        ...options,
        where: {
          ...(!isEmpty(studentIds) ? { id: studentIds } : { id: { [Op.is]: null } }),
          // transform isActive to boolean
          ...(isActive !== undefined && { [DB_CONTRACT.studentUser.isActive.property]: `${isActive}` === 'true' }),
        },
      };
    }

    const {
      count,
      rows,
    } = await getAllStudentUsersByOptions(options);

    return createDataObjectWithPaginationInfo(offset, limit, count, rows);
  } catch (err) {
    throw createCustomError(err);
  }
};

const addStudentFeedback = async (data, userRole, loggedInUserId) => {
  await checkUserPermissionToAccessCourseInfo(userRole, loggedInUserId, data.courseId);

  const student = getCoursesByStudentIdAndOptions(data.studentId, {
    courseId: data.courseId,
    [DB_CONTRACT.coursesStudent.status.property]: STUDENT_COURSES_STATUS.passed,
  });

  checkDataFromDB(student);

  await createStudentFeedback({
    id: uuid(),
    [DB_CONTRACT.studentFeedback.studentId.property]: data.studentId,
    [DB_CONTRACT.studentFeedback.courseId.property]: data.courseId,
    [DB_CONTRACT.studentFeedback.feedback.property]: data.feedback,
    [DB_CONTRACT.common.createdBy.property]: loggedInUserId,
  });
};

module.exports = {
  createStudentUser,
  updateStudentUser,
  inactiveStudentUser,
  getAllStudentsUser,
  addStudentFeedback,
};
