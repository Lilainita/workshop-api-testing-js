const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const path = 'https://github.com/aperdomob/redirect-test';
const newURL = 'https://github.com/aperdomob/new-redirect-test';
let response;

const auth = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
});

describe('Consume HEAD Method', () => {
  before(async () => {
    response = await auth.head(`${path}`);
  });
  it('Check redirect URL', () => {
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.headers).to.have.property('content-type');
    expect(response.request.res.responseUrl).to.eql(newURL);
    expect(response.data).to.equal('');
  });

  describe('Verify Redirect', () => {
    before(async () => {
      response = await axios.get(`${path}`);
    });
    it('Get Redirect', () => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.headers).to.have.property('content-type');
      expect(response.request.res.responseUrl).to.eql(newURL);
      expect(response.data).to.not.be.equal('');
    });
  });
});
