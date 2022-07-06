const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const path = 'https://api.github.com/users';
let response;

describe('Get List Users', () => {
  before(async () => {
    response = await axios.get(`${path}`);
  });
  it('User List', () => {
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.length).to.equal(30);
  });

  describe('Getting only 10 Users', () => {
    before(async () => {
      response = await axios.get(`${path}`, { params: { per_page: 10 } });
    });
    it('Listing 10 Users', () => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.data.length).to.equal(10);
    });
  });

  describe('Getting 100 Users', () => {
    before(async () => {
      response = await axios.get(`${path}`, { params: { per_page: 100 } });
    });
    it('Listing 100 Users', () => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.data.length).to.equal(100);
    });
  });
});
