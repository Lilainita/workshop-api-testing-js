const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const path = 'https://api.github.com';
let response;
let repositories;
let repo;
let issue;
const myIssue = {
  title: 'Found a bug'
};

const auth = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
});

describe('Consuming POST and PATCH Methods', () => {
  before(async () => {
    response = await auth.get(`${path}/user`);
  });
  it('Check if Repo is Public', () => {
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.public_repos).to.be.above(0);
  });

  describe('List of Repositories', () => {
    before(async () => {
      repositories = await auth.get(`${response.data.repos_url}`);
    });
    it('Check if chosen Repo Exist', () => {
      repo = repositories.data.find((e) => e.name === 'workshop-api-testing-js');
      expect(repositories.status).to.equal(StatusCodes.OK);
      expect(repo).not.to.equal(undefined);
      expect(repo.name).to.equal('workshop-api-testing-js');
    });
  });

  describe('Create an Issue', () => {
    before(async () => {
      issue = await auth.post(`${path}/repos/Lilainita/${repo.name}/issues`, myIssue);
    });
    it('Checking the Issue', () => {
      expect(issue.status).to.equal(StatusCodes.CREATED);
      expect(issue.data.title).to.equal(myIssue.title);
      expect(issue.data.body).to.equal(null);
    });
  });

  describe('Modifying the Issue', () => {
    before(async () => {
      issue = await auth.patch(`${issue.data.url}`, { body: 'I\'m having a problem with this.' });
    });
    it('Adding Body to the Issue', () => {
      expect(issue.status).to.equal(StatusCodes.OK);
      expect(issue.data.title).to.equal(myIssue.title);
      expect(issue.data.body).to.equal('I\'m having a problem with this.');
    });
  });
});
