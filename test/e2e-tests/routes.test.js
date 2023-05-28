const chai = require('chai');
const chaiHttp = require('chai-http');
const { startServer } = require('../../src/server');
const {
  HTTP_STATUS,
  USER_ROLE,
  HEADER_PARAMS,
  STUDENT_COURSES_STATUS,
} = require('../../src/constants');
const { generateTokens } = require('../../src/services/token.service');

chai.use(chaiHttp);
const expect = chai.expect;

const adminIdMock = 'a05fb7a6-ef20-4240-ac40-0e33325458b2';
let instructors;

describe('Server E2E Tests', () => {
  let server;

  before(done => {
    process.env.NODE_ENV = 'e2e-test';
    startServer();
    setTimeout(() => {
      server = chai.request('localhost:3000/api/courses');
      done();
    }, 4000);
  });

  after(() => {
    process.exit(0);
  });

  describe('Unauthorized API', () => {
    describe('POST /api/courses/login', () => {
      it('should return a successful response', done => {
        const reqMock = {
          email: 'admin@courses.com',
          password: 'Proto3Som1!',
        };

        server
          .post('/public/login')
          .send(reqMock)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.ok.code);
            done();
          });
      });

      it('should return a Unauthorized error response', done => {
        const reqMock = {
          email: 'admin@courses.com',
          password: 'SomePW12!',
        };

        server
          .post('/public/login')
          .send(reqMock)
          .end((error, res) => {
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.unauthorized.code);
            done();
          });
      });
    });

    describe('POST /api/courses/registration', () => {
      it('should return a successful response of registered instructor', done => {
        const reqMock = {
          role: USER_ROLE.instructor,
          firstName: 'test',
          lastName: 'instructor',
          email: 'instructor.test@email.com',
          password: 'instructor1test1PW!',
        };

        server
          .post('/public/registration')
          .send(reqMock)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.ok.code);
            done();
          });
      });

      it('should return a successful response of registered student', done => {
        const reqMock = {
          role: USER_ROLE.student,
          firstName: 'test',
          lastName: 'student',
          email: 'student.test@email.com',
          password: 'student1test1PW!',
        };

        server
          .post('/public/registration')
          .send(reqMock)
          .end((error, res) => {
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.ok.code);
            done();
          });
      });
    });
  });

  describe('Authorized API', () => {
    let accessToken;

    before(async () => {
      const tokens = await generateTokens({
        userId: adminIdMock,
        role: USER_ROLE.admin,
      });

      accessToken = `Bearer ${tokens.accessToken}`;
    });

    describe('POST /api/courses/student', () => {
      it('should return a successful response of creation student by Admin', done => {
        const reqMock = {
          firstName: 'test',
          lastName: 'student',
          email: 'student@kvhrw.com',
        };

        server
          .post('/public/student')
          .set(HEADER_PARAMS.authorization, accessToken)
          .send(reqMock)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.ok.code);
            done();
          });
      });
    });

    describe('POST /api/courses/student/filtered', () => {
      it('should return a successful response of getting student', done => {
        const reqMock = {
          offset: 0,
          limit: 3,
          orderBy: 'email',
          orderDirection: 'asc',
          isActive: true,
        };

        server
          .post('/public/student/filtered')
          .set(HEADER_PARAMS.authorization, accessToken)
          .send(reqMock)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res)
              .to
              .have
              .property('body');
            done();
          });
      });

      it('should return a validation error response of getting student', done => {
        const reqMock = {
          offset: 0,
          limit: 3,
          orderBy: 'email',
          orderDirection: 'asc',
          isActive: true,
          courseStatus: STUDENT_COURSES_STATUS.inProgress,
        };

        server
          .post('/public/student/filtered')
          .set(HEADER_PARAMS.authorization, accessToken)
          .send(reqMock)
          .end((error, res) => {
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.badRequest.code);
            expect(res.body.error.message)
              .is
              .equal('"courseStatus" is not allowed');
            done();
          });
      });
    });

    describe('POST /api/courses/instructor', () => {
      it('should return a successful response of creation instructor by Admin', done => {
        const reqMock = {
          firstName: 'test',
          lastName: 'instructor',
          email: 'instructor@kvhrw.com',
        };

        server
          .post('/public/instructor')
          .set(HEADER_PARAMS.authorization, accessToken)
          .send(reqMock)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.ok.code);
            done();
          });
      });
    });

    describe('POST /api/courses/instructor/filtered', () => {
      it('should return a successful response of getting instructors', done => {
        const reqMock = {
          offset: 0,
          limit: 3,
          orderBy: 'email',
          orderDirection: 'asc',
        };

        server
          .post('/public/instructor/filtered')
          .set(HEADER_PARAMS.authorization, accessToken)
          .send(reqMock)
          .end((error, res) => {
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.ok.code);
            expect(res)
              .to
              .have
              .property('body');
            expect(res.body.result.records.length)
              .to
              .be
              .equal(2);

            instructors = res.body.result.records;
            done();
          });
      });
    });

    describe('POST /api/public/course', () => {
      it('should return a successful response of creating courses', done => {
        const reqMock = {
          title: 'kompuktorni clases',
          description: 'learn kompuktory',
          instructorIds: instructors.map(item => item.id),
          generalInformation: [
            'all information about kompuktory',
          ],
          lessons: [
            {
              title: 'kompuktory 1',
              description: 'learn firs kompuktor',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 2',
              description: 'learn second kompuktor',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 3',
              description: 'learn kompuktor of 3 gen',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 4',
              description: 'learn kompuktor of 4 gen',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 5',
              description: 'learn kompuktor of 5 gen',
              information: [
                'information about kompuktory',
              ],
            },
          ],
        };

        server
          .post('/public/course')
          .set(HEADER_PARAMS.authorization, accessToken)
          .send(reqMock)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.ok.code);
            expect(res)
              .to
              .have
              .property('body');
            expect(res.body.success)
              .to
              .be
              .equal(true);
            done();
          });
      });

      it('should return a validation error response of creating courses', done => {
        const reqMock = {
          title: 'kompuktorni clases',
          description: 'learn kompuktory',
          instructorIds: instructors.map(item => item.id),
          generalInformation: [
            'all information about kompuktory',
          ],
          lessons: [
            {
              title: 'kompuktory',
              description: 'learn firs kompuktor',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 2',
              description: 'learn second kompuktor',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 3',
              description: 'learn kompuktor of 3 gen',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 4',
              description: 'learn kompuktor of 4 gen',
              information: [
                'information about kompuktory',
              ],
            },
          ],
        };

        server
          .post('/public/course')
          .set(HEADER_PARAMS.authorization, accessToken)
          .send(reqMock)
          .end((error, res) => {
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.badRequest.code);
            expect(res)
              .to
              .have
              .property('body');
            expect(res.body.success)
              .to
              .be
              .equal(false);
            expect(res.body.error.message)
              .is
              .equal('"lessons" must contain at least 5 items');
            done();
          });
      });

      it('should return a validation error response of creating courses', done => {
        const reqMock = {
          title: 'kompuktorni clases',
          description: 'learn kompuktory',
          instructorIds: [],
          generalInformation: [
            'all information about kompuktory',
          ],
          lessons: [
            {
              title: 'kompuktory',
              description: 'learn firs kompuktor',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 2',
              description: 'learn second kompuktor',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 3',
              description: 'learn kompuktor of 3 gen',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 4',
              description: 'learn kompuktor of 4 gen',
              information: [
                'information about kompuktory',
              ],
            },
            {
              title: 'kompuktory 5',
              description: 'learn kompuktor of 5 gen',
              information: [
                'information about kompuktory',
              ],
            },
          ],
        };

        server
          .post('/public/course')
          .set(HEADER_PARAMS.authorization, accessToken)
          .send(reqMock)
          .end((error, res) => {
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.badRequest.code);
            expect(res)
              .to
              .have
              .property('body');
            expect(res.body.success)
              .to
              .be
              .equal(false);
            expect(res.body.error.message)
              .is
              .equal('"instructorIds" must contain at least 1 items');
            done();
          });
      });
    });
  });
});
