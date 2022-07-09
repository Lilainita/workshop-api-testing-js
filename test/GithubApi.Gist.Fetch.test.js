const { StatusCodes } = require('http-status-codes');
const chai = require('chai');
const { expect } = require('chai');
const chaiSubset = require('chai-subset');

require('isomorphic-fetch');

chai.use(chaiSubset);

const path = 'https://api.github.com';
let response;
let rta;
let getGist;

const promise = 'new Promise((resolve, reject) => {resolve("isomorphic-fetch");})';

const gist = {
  description: 'Example of a gist with isomorphic-fetch ',
  public: true,
  files: {
    'testFile.js': {
      content: promise
    }
  }
};

const config = {
  method: 'POST',
  body: JSON.stringify(gist),
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
};

describe('Consuming DELETE Method with isomorphic-fetch', () => {
  before(async () => {
    response = await fetch(`${path}/gists`, config);
    rta = await response.json();
  });

  it('Creating and Verifying Gist', () => {
    expect(response.status).to.equal(StatusCodes.CREATED);
    expect(rta).to.containSubset(gist);
  });

  describe('Get the Gist', () => {
    before(async () => {
      getGist = await fetch(`${rta.url}`, { method: 'GET', headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` } });
    });
    it('Gist found', () => {
      expect(getGist.status).to.equal(StatusCodes.OK);
    });
  });

  describe('Delete the Gist', () => {
    before(async () => {
      getGist = await fetch(`${rta.url}`, { method: 'DELETE', headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` } });
    });
    it('Gist deleted', () => {
      expect(getGist.status).to.equal(StatusCodes.NO_CONTENT);
    });
  });

  describe('Verify Gist', () => {
    before(async () => {
      getGist = await fetch(`${rta.url}`, { method: 'GET', headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` } });
    });
    it('Verify if Gist was Deleted', () => {
      expect(getGist.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });
});
