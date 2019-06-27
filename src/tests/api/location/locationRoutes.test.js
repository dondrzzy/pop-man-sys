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

describe('Location API routes', () => {

  beforeEach(async () => {
    // clear temporary store before each test runs
    await mockgoose.helper.reset()
    const db = mongoose.connection
    db.modelNames().map(async (model) => {
      await db.models[model].createIndexes();
    });
  });
  const locationA = {
    name: "Some location",
    male: "20",
    female: '20',
  }

  const locationB = {
    name: "Other location",
    male: "10",
    female: '10',
  }

  const userData = {
    email: "peter@gmail.com",
    password: "#peter@1111"
  };

  const createUser = (data) => {
    return request(app).post('/api/v1/users').send(data);
  }

  const loginUser = async () => {
    await createUser(userData);
    const res = await request(app).post('/api/v1/users/login')
      .send({email: userData.email, password: userData.password})
    return res.body;
  }

  const createLocation = async (body, token) => {
    return await request(app).post('/api/v1/locations')
      .send(body)
      .set('token-x', token)
  }

  const getLocations = async (token) => {
    return await request(app).get('/api/v1/locations')
      .set('token-x', token)
  }

  const getLocation = async (id, token) => {
    return await request(app).get('/api/v1/locations/'+id)
      .set('token-x', token)
  }

  const deleteLocation = async (id, token) => {
    return await request(app).delete('/api/v1/locations/'+id)
      .set('token-x', token)
  }

  

  describe('Get locations', () => {
    it('should error if not authenticated', async () => {
      const res = await request(app).get('/api/v1/locations');
      expect(res.body.error).to.equal('No token provided');
    });

    it('should return locations if authenticated', async () => {
      // create user
      await createUser(userData);
      
      // login default parker user to send message to john
      let loginRes = await loginUser();

      // get locations
      const res = await getLocations(loginRes.token);
      expect(res.body).to.be.have.keys('locations');
    });
  });

  describe('Get locations', () => {
    it('should error if not authenticated', async () => {
      const res = await request(app).get('/api/v1/locations');
      expect(res.body.error).to.equal('No token provided');
    });

    it('should return locations if authenticated', async () => {
      // create user
      await createUser(userData);
      let loginRes = await loginUser();

      // create location
      await createLocation(locationA, loginRes.token);

      // get locations
      const res = await getLocations(loginRes.token);
      expect(res.body).to.be.have.keys('locations');
      expect(res.body.locations.length).to.be.greaterThan(0);
    });
  });

  describe('Get Location', () => {

    it('should return a location if authenticated', async () => {
      // create user
      await createUser(userData);
      let loginRes = await loginUser();

      // create location
      await createLocation(locationA, loginRes.token);

      // get locations
      const locationsRes = await getLocations(loginRes.token);
      const locationRes = await getLocation(locationsRes.body.locations[0]._id, loginRes.token);
      expect(locationRes.body.location.name).to.equal(locationA.name);
    });
  });

  describe('Delete Location', () => {
    it('should error if location not found', async () => {
      // create user
      await createUser(userData);
      let loginRes = await loginUser();

      // create location
      await createLocation(locationA, loginRes.token);
      // get locations
      let locationsRes = await getLocations(loginRes.token);
      // create another location
      await createLocation({
        name: "Some other location",
        male: "20",
        female: '20',
        parentId: locationsRes.body.locations[0]._id
      }, loginRes.token);

      locationsRes = await getLocations(loginRes.token);
      const delRes = await deleteLocation(locationsRes.body.locations[1]._id, loginRes.token);
    })
  });

  describe('Create Location', () => {
    it('should error if required params are not passed', async () => {
      // create user
      await createUser(userData);
      let loginRes = await loginUser();

      // create location
      const res = await createLocation({}, loginRes.token);
      expect(res.body.errors).to.have.keys(
        'name',
        'male',
        'female'
      );
    })
  })

});
