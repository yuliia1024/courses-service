const { DB_REFERENTIAL_ACTIONS } = require('../constants');
const { DB_CONTRACT } = require('./db.contract');

const coursesInstructorAssociate = (coursesInstructorModel, instructorModel, coursesModel) => {
  coursesInstructorModel.belongsTo(coursesModel, {
    foreignKey: {
      name: [DB_CONTRACT.coursesInstructor.courseId.property],
    },
    onUpdate: DB_REFERENTIAL_ACTIONS.CASCADE,
    onDelete: DB_REFERENTIAL_ACTIONS.CASCADE,
    constraints: true,
    as: DB_CONTRACT.coursesInstructor.coursesReferenceName,
  });
  coursesInstructorModel.belongsTo(instructorModel, {
    foreignKey: {
      name: [DB_CONTRACT.coursesInstructor.instructorId.property],
    },
    onUpdate: DB_REFERENTIAL_ACTIONS.CASCADE,
    onDelete: DB_REFERENTIAL_ACTIONS.CASCADE,
    constraints: true,
    as: DB_CONTRACT.coursesInstructor.instructorReferenceName,
  });
};

const coursesLessonAssociate = (coursesLessonModel, coursesModel) => {
  coursesLessonModel.belongsTo(coursesModel, {
    foreignKey: {
      name: [DB_CONTRACT.coursesLesson.courseId.property],
    },
    onUpdate: DB_REFERENTIAL_ACTIONS.CASCADE,
    onDelete: DB_REFERENTIAL_ACTIONS.CASCADE,
    constraints: true,
    as: DB_CONTRACT.coursesLesson.courseReferenceName,
  });
};

const coursesStudentAssociate = (coursesStudentModel, studentModel, coursesModel) => {
  coursesStudentModel.belongsTo(coursesModel, {
    foreignKey: {
      name: [DB_CONTRACT.coursesStudent.courseId.property],
    },
    onUpdate: DB_REFERENTIAL_ACTIONS.CASCADE,
    onDelete: DB_REFERENTIAL_ACTIONS.CASCADE,
    constraints: true,
    as: DB_CONTRACT.coursesStudent.coursesReferenceName,
  });
  coursesStudentModel.belongsTo(studentModel, {
    foreignKey: {
      name: [DB_CONTRACT.coursesStudent.studentId.property],
    },
    onUpdate: DB_REFERENTIAL_ACTIONS.CASCADE,
    onDelete: DB_REFERENTIAL_ACTIONS.CASCADE,
    constraints: true,
    as: DB_CONTRACT.coursesStudent.studentReferenceName,
  });
};

module.exports = {
  coursesInstructorAssociate,
  coursesLessonAssociate,
  coursesStudentAssociate,
};
