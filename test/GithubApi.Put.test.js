const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const path = 'https://api.github.com/user/following';
let response;

const auth = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
});

describe('Consuming PUT Service GitHub API', () => {
  it('Following User', async () => {
    response = await auth.put(`${path}/aperdomob`);
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).to.be.eql('');
  });

  it('Check Follow User', async () => {
    response = await auth.get(`${path}`);
    const userFollow = response.data.find((e) => e.login === 'aperdomob');
    expect(response.status).to.equal(StatusCodes.OK);
    expect(userFollow.login).to.equal('aperdomob');
  });

  it('Checking idempotence of the PUT Method', async () => {
    response = await auth.put(`${path}/aperdomob`);
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).to.be.eql('');
  });
});
