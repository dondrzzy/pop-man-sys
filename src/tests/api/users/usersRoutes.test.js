const expect = require('chai').expect;
const request = require('supertest');
var mongoose = require('mongoose')
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  process.env.NODE_ENV = 'testing';
}

const conn = require('../../../config/database');
const app = require('../../../app');

describe('User API routes', () => {

  beforeEach(async () => {
    // clear temporary store before each test runs
    await mockgoose.helper.reset()
    const db = mongoose.connection
    db.modelNames().map(async (model) => {
      await db.models[model].createIndexes();
    });
  });

  const userData = {
    email: "peter@gmail.com",
    password: "#peter@1111"
  };

  const createUser = (data) => {
    return request(app).post('/api/v1/users').send(data);
  };

  const loginUser = async () => {
    await createUser(userData);
    const res = await request(app).post('/api/v1/users/login')
      .send({email: userData.email, password: userData.password})
    return res.body;
  }

  describe('Get All Users', () => {
    it('should return all users',  (done) => {
      request(app)
        .get('/api/v1/users')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.contain.property('users');
          done();
        });
    });
  });

  describe('Register User', () => {
    it('should error if required user parameters are missing', (done) => {
      createUser({})
        .end((err, res) =>  {
          expect(res.status).to.equal(400);
          expect(res.body.errors)
            .to.have.all.keys(
              'email',
              'password'
            );
          done();
        });
    })

    it('should create a new user', (done) => {
      createUser(userData)
        .expect(201)
        .end(done);
    });

    it('should error if phone number already exists', (done) => {
      createUser(userData)
        .end((err, res) => {
          createUser(userData)
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body.error).to.be.equal('Email already exists');
              done();
            });
        });
    });
  });

  describe('Login User', () => {
    it('should check required body params', (done) => {
      request(app)
        .post('/api/v1/users/login')
        .send({})
        .end((err, res) => {
          expect(res.body.errors)
            .to.have.all.keys(
              'email',
              'password'
            );
          done();
        });
    });

    it('should error if email is not registered', (done) => {
      request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'unkown@gmail.com',
          password: '#user@1234'
        })
        .end((err, res) => {
          expect(res.body.error).to.equal('User not found');
          done();
        })
    });

    it('should validate user password', async () => {
      await createUser(userData);
      const res = await request(app).post('/api/v1/users/login')
        .send({email: userData.email, password: 'axaxax'});
      expect(res.body.error).to.equal('Wrong password provided');
    });

    it('should generate vaild token if right credentials are provided',  async () => {
      expect(await loginUser()).to.have.all.keys('token');
    });
  })

});