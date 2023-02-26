const DB_CONTRACT = {
  common: {
    id: {
      property: 'id',
      column: 'id',
    },
    createdAt: {
      property: 'createdAt',
      column: 'created_at',
    },
    updatedAt: {
      property: 'updatedAt',
      column: 'updated_at',
    },
    createdBy: {
      property: 'createdBy',
      column: 'created_by',
    },
    updatedBy: {
      property: 'updatedBy',
      column: 'updated_by',
    },
  },
  refreshToken: {
    tableName: 'refresh-token',
    userId: {
      property: 'userId',
      column: 'user_id',
    },
    expirationTime: {
      property: 'expirationTime',
      column: 'expiration_time',
    },
    refreshToken: {
      property: 'refreshToken',
      column: 'refresh_token',
    },
    accessToken: {
      property: 'accessToken',
      column: 'access_token',
    },
  },
  adminUser: {
    tableName: 'admin-user',
    firstName: {
      property: 'firstName',
      column: 'first_name',
    },
    lastName: {
      property: 'lastName',
      column: 'last_name',
    },
    email: {
      property: 'email',
      column: 'email',
    },
    role: {
      property: 'role',
      column: 'role',
    },
    isActive: {
      property: 'isActive',
      column: 'is_active',
    },
    hashPassword: {
      property: 'hashPassword',
      column: 'hash_password',
    },
  },
  studentUser: {
    tableName: 'student-user',
    firstName: {
      property: 'firstName',
      column: 'first_name',
    },
    lastName: {
      property: 'lastName',
      column: 'last_name',
    },
    email: {
      property: 'email',
      column: 'email',
    },
    phone: {
      property: 'phone',
      column: 'phone',
    },
    role: {
      property: 'role',
      column: 'role',
    },
    isActive: {
      property: 'isActive',
      column: 'is_active',
    },
    hashPassword: {
      property: 'hashPassword',
      column: 'hash_password',
    },
  },
  instructorUser: {
    tableName: 'instructor-user',
    firstName: {
      property: 'firstName',
      column: 'first_name',
    },
    lastName: {
      property: 'lastName',
      column: 'last_name',
    },
    email: {
      property: 'email',
      column: 'email',
    },
    role: {
      property: 'role',
      column: 'role',
    },
    isActive: {
      property: 'isActive',
      column: 'is_active',
    },
    hashPassword: {
      property: 'hashPassword',
      column: 'hash_password',
    },
    generalInformation: {
      property: 'generalInformation',
      column: 'general_information',
    },
    academicStatus: {
      property: 'academicStatus',
      column: 'academic_status',
    },
  },
  courses: {
    tableName: 'courses',
    title: {
      property: 'title',
      column: 'title',
    },
    description: {
      property: 'description',
      column: 'description',
    },
    generalInformation: {
      property: 'generalInformation',
      column: 'general_information',
    },
  },
  coursesInstructor: {
    tableName: 'courses_instructor',
    compositeIndexName: 'composite_index',
    coursesReferenceName: 'courses_instructor-courses',
    instructorReferenceName: 'courses_instructor-instructor',
    instructorId: {
      property: 'instructorId',
      column: 'instructor_id',
    },
    courseId: {
      property: 'courseId',
      column: 'course_id',
    },
  },
  coursesStudent: {
    tableName: 'courses_student',
    compositeIndexName: 'composite_index',
    coursesReferenceName: 'courses_student-courses',
    studentReferenceName: 'courses_student-student',
    studentId: {
      property: 'studentId',
      column: 'student_id',
    },
    courseId: {
      property: 'courseId',
      column: 'course_id',
    },
    status: {
      property: 'status',
      column: 'status',
    },
  },
  coursesLesson: {
    tableName: 'courses_lesson',
    courseReferenceName: 'courses_lesson-courses',
    courseId: {
      property: 'courseId',
      column: 'course_id',
    },
    lessonNumber: {
      property: 'lessonNumber',
      column: 'lesson_number',
    },
    title: {
      property: 'title',
      column: 'title',
    },
    description: {
      property: 'description',
      column: 'description',
    },
    information: {
      property: 'information',
      column: 'information',
    },
    homeworkTask: {
      property: 'homeworkTask',
      column: 'homework_task',
    },
  },
  homework: {
    tableName: 'homework',
    courseLessonReferenceName: 'homework-route-courses_lesson',
    studentReferenceName: 'homework-route-student',
    compositeIndexName: 'composite_index',
    studentId: {
      property: 'studentId',
      column: 'student_id',
    },
    courseLessonId: {
      property: 'courseLessonId',
      column: 'course_lesson_id',
    },
    filePath: {
      property: 'filePath',
      column: 'file_path',
    },
    mark: {
      property: 'mark',
      column: 'mark',
    },
  },
  studentFeedback: {
    courseLessonReferenceName: 'courses_lesson',
    studentReferenceName: 'homework-route-student',
    compositeIndexName: 'composite_index',
    tableName: 'student_feedback',
    courseId: {
      property: 'courseId',
      column: 'course_id',
    },
    studentId: {
      property: 'studentId',
      column: 'student_id',
    },
    instructorId: {
      property: 'instructorId',
      column: 'instructor_id',
    },
    feedback: {
      property: 'feedback',
      column: 'feedback',
    },
  },
};

module.exports = {
  DB_CONTRACT,
};
