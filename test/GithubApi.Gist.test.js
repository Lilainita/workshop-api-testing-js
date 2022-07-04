const { StatusCodes } = require('http-status-codes');
const chai = require('chai');
const { expect } = require('chai');
const chaiSubset = require('chai-subset');
const axios = require('axios');

chai.use(chaiSubset);

const path = 'https://api.github.com';
let response;
let getGist;
let error;

const promise = 'new Promise((resolve, reject) => {resolve("foo");})';

const gist = {
  description: 'Example of a gist',
  public: true,
  files: {
    'testFile.js': {
      content: promise
    }
  }
};

const auth = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
});

describe('Consuming DELETE Method', () => {
  before(async () => {
    response = await auth.post(`${path}/gists`, gist);
  });
  it('Creating and Verifying Gist', () => {
    expect(response.status).to.equal(StatusCodes.CREATED);
    expect(response.data.description).to.equal(gist.description);
    expect(response.data.public).to.equal(true);
    expect(response.data).to.containSubset(gist);
  });

  describe('Get the Gist', () => {
    before(async () => {
      getGist = await auth.get(`${response.data.url}`);
    });
    it('Gist found', () => {
      expect(getGist.status).to.equal(StatusCodes.OK);
    });
  });

  describe('Delete the Gist', () => {
    before(async () => {
      getGist = await auth.delete(`${response.data.url}`);
    });
    it('Gist deleted', () => {
      expect(getGist.status).to.equal(StatusCodes.NO_CONTENT);
    });
  });

  describe('Verify Gist', () => {
    before(async () => {
      try {
        await auth.get(`${response.data.url}`);
      } catch (e) {
        error = e;
      }
    });
    it('Verify if Gist was Deleted', () => {
      expect(error.response.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });
});
