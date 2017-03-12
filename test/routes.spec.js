process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var server = require('../app');
var knex = require('../db/knex');

chai.use(chaiHttp);

before(function() {
  return knex.migrate.rollback()
  .then(function() {
    return knex.migrate.latest();
  });
});

after(function() {
  return knex.migrate.rollback();
});

describe('POST /config', function() {
  it('should respond with 201', function() {
    return chai.request(server)
    .post('/config')
    .send({
      client: 'ios',
      version: '267',
      key: 'ads_endpoint',
      value: '/devads'
    })
    .then(function(res) {
      expect(res).to.have.status(201);
    });
  });
});

describe('GET /config/{client}/{version}', function() {
  it('should return all fields when ETag is missing', function() {
    return chai.request(server)
    .get('/config/ios/267')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.have.header('ETag', 'w/"1"');
      expect(res.body).to.deep.equal({ ads_endpoint: '/devads' });
    });
  });
  
  it('should respond with 304 when there are no fields', function() {
    return chai.request(server)
    .get('/config/ios/266')
    .then(function(res) {
      expect(res).to.have.status(304);
    });
  });
  
  it('should respond with 304 when there are no fields', function() {
    return chai.request(server)
    .get('/config/ios/268')
    .then(function(res) {
      expect(res).to.have.status(304);
    });
  });
  
  it('should respond with 304 when there are no changed fields', function() {
    return chai.request(server)
    .get('/config/ios/267')
    .set({
      'If-None-Match': 'W/"1"'
    })
    .then(function(res) {
      expect(res).to.have.status(304);
    });
  });
  
  it('should respond with 304 when there are no fields', function() {
    return chai.request(server)
    .get('/config/android/267')
    .then(function(res) {
      expect(res).to.have.status(304);
    });
  });
});

describe('POST /config', function() {
  it('should respond with 201', function() {
    return chai.request(server)
    .post('/config')
    .send({
      client: 'ios',
      version: '267',
      key: 'background_color',
      value: '#000'
    })
    .then(function(res) {
      expect(res).to.have.status(201);
    });
  });
});

describe('GET /config/{client}/{version}', function() {
  it('should return all fields when ETag is missing', function() {
    return chai.request(server)
    .get('/config/ios/267')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.have.header('ETag', 'w/"2"');
      expect(res.body).to.deep.equal({
        ads_endpoint: '/devads',
        background_color: '#000'
      });
    });
  });
  
  it('should return all changed fields since last ETag', function() {
    return chai.request(server)
    .get('/config/ios/267')
    .set({
      'If-None-Match': 'W/"1"'
    })
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.have.header('ETag', 'w/"2"');
      expect(res.body).to.deep.equal({
        background_color: '#000'
      });
    });
  });
  
  it('should respond with 304 when there are no changed fields', function() {
    return chai.request(server)
    .get('/config/ios/267')
    .set({
      'If-None-Match': 'W/"2"'
    })
    .then(function(res) {
      expect(res).to.have.status(304);
    });
  });
});
