const app = require('../app');
const request = require('supertest');
const expect = require('chai').expect;


describe('GET /playstore', () => {
  it('should return an array of apps', () => {
    return request(app)
      .get('/playstore')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const storeapp = res.body[0];
        expect(storeapp).to.include.all.keys('App', 'Rating', 'Genres');
      });
  });

  it('should be 400 if sort is incorrect', () => {
    return request(app)
      .get('/playstore')
      .query({ sort: 'MISTAKE' })
      .expect(400, 'Sort must be one of rating or app');
  });
  it('should sort by App name', () => {
    return request(app)
      .get('/playstore')
      .query({ sort: 'app' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].App < res.body[i + 1].App;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it.skip('should sort by Rating', () => {
    return request(app)
      .get('/playstore')
      .query({ sort: 'rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating < res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
})

