const chai = require('chai');
const chaiHttp = require('chai-http');
const { startServer } = require('../../src/server');
const {
  HTTP_STATUS,
  USER_ROLE,
  HEADER_PARAMS,
} = require('../../src/constants');
const { generateTokens } = require('../../src/services/token.service');

chai.use(chaiHttp);
const expect = chai.expect;

const adminIdMock = 'a05fb7a6-ef20-4240-ac40-0e33325458b2';

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
          .end((err, res) => {
            expect(err).to.be.null;
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
          .end((err, res) => {
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
          .end((err, res) => {
            expect(err).to.be.null;
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
          .end((err, res) => {
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
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res)
              .to
              .have
              .property('status')
              .equal(HTTP_STATUS.ok.code);
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
          .end((err, res) => {
            expect(err).to.be.null;
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
});
