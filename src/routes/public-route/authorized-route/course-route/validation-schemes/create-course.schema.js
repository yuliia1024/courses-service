const Joi = require('joi');
const { updateCourseInfoSchema } = require('./update-course.schema');
const { createLessonSchema } = require('../../course-lessons-route/validation-schemes/create-lesson.schema');
const { COURSE_LESSONS_MIN_COUNT } = require('../../../../../constants');

const createCourseSchema = updateCourseInfoSchema.concat(Joi.object({
  instructors: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .required(),
  lessons: Joi.array()
    .items(createLessonSchema)
    .min(COURSE_LESSONS_MIN_COUNT)
    .required(),
}));

module.exports = {
  createCourseSchema,
};
