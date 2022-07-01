const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const path = 'https://api.github.com/user/following';
let response;
let userFollow;

const auth = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
});

describe('Consuming PUT Service GitHub API', () => {
  before(async () => {
    response = await auth.put(`${path}/aperdomob`);
  });
  it('Following User', async () => {
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).to.be.eql('');
  });

  describe('Check Follow User', () => {
    before(async () => {
      response = await auth.get(`${path}`);
      userFollow = response.data.find((e) => e.login === 'aperdomob');
    });
    it('Following Users List', async () => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(userFollow.login).to.equal('aperdomob');
    });
  });

  describe('Checking idempotence of the PUT Method', () => {
    before(async () => {
      response = await auth.put(`${path}/aperdomob`);
    });
    it('Following same User', async () => {
      expect(response.status).to.equal(StatusCodes.NO_CONTENT);
      expect(response.data).to.be.eql('');
    });
  });

  describe('Check if still Following the User', () => {
    before(async () => {
      response = await auth.get(`${path}`);
      userFollow = response.data.find((e) => e.login === 'aperdomob');
    });
    it('Following Users List', async () => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(userFollow.login).to.equal('aperdomob');
    });
  });
});
