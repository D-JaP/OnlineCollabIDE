const request = require('supertest');
const assert = require('assert');
const app = require('../server');
const { randomInt } = require('crypto');
const timeOut = (secs) => new Promise((res) => setTimeout(res, secs * 1000));

describe('Backend API',  function() {
    beforeEach(async () => {
        await timeOut(1);
    });
    
    it('login', function(done) {
    request(app)
      .post('/api/v1/login')
      .send({ email: 'raquaza1708@gmail.com', password: '123123' })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.body.token, 'Expected token to be present');
        done();
      });
    });

    it('registration', function(done) {
        request(app)
          .post('/api/v1/registration')
          .send({ email: "test"+ randomInt(10000)+ "@gmail.com", password: '123123' })
          .expect(201)
          .end(function(err, res) {
            if (err) return done(err);
            assert(res.body.message, 'Expected message to be present');
            done();
          });
    });
    
    it('add Prj to user', function(done) {
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDMyMDIzMTA2ODQyY2M3ZTA1MDBhNDgiLCJpYXQiOjE2ODEwNTcyNjZ9.4gs7A8l9gYcQnOSTNA58NFZx5TniLTZ1BqBW8EVzwds"
        request(app)
          .post('/api/v1/user/add')
          .set('Authorization', 'Bearer ' + token)
          .send({ id: '8e7c89c8-c034-40ff-b54a-11d0d08c76c5', email: 'raquaza1708@gmail.com' })
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            assert(res.body.message, 'Expected message to be present');
            done();
          });
    });

    it('get Prj from user', function(done) {
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDMyMDIzMTA2ODQyY2M3ZTA1MDBhNDgiLCJpYXQiOjE2ODEwNTcyNjZ9.4gs7A8l9gYcQnOSTNA58NFZx5TniLTZ1BqBW8EVzwds"
        request(app)
          .get('/api/v1/user')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            assert(res.body, 'Expected token to be present');
            done();
          });
    });

    it('auth', function(done) {
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDMyMDIzMTA2ODQyY2M3ZTA1MDBhNDgiLCJpYXQiOjE2ODEwNTcyNjZ9.4gs7A8l9gYcQnOSTNA58NFZx5TniLTZ1BqBW8EVzwds"
        request(app)
          .post('/api/v1/auth')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            assert(res.body.status, 'Expected status to be present');
            done();
          });
    });

});
