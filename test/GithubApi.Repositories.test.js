const { StatusCodes } = require('http-status-codes');
const chai = require('chai');
const { expect } = require('chai');
const chaiSubset = require('chai-subset');
const md5 = require('md5');

chai.use(chaiSubset);
const axios = require('axios');

const urlBase = 'https://api.github.com';
const repoName = 'jasmine-json-report';

let fullResponse;
let repo;
let readmeInfo;

describe('Consuming GET Method GitHub API', () => {
  it('Consume GET Service', async () => {
    fullResponse = await axios.get(`${urlBase}/users/aperdomob`);
    expect(fullResponse.status).to.equal(StatusCodes.OK);
    expect(fullResponse.data.name).to.eql('Alejandro Perdomo');
    expect(fullResponse.data.company).to.eql('Perficient Latam');
    expect(fullResponse.data.location).to.eql('Colombia');
  });

  it('Repo List Aperdomob', async () => {
    const repos = await axios.get(`${fullResponse.data.repos_url}`);
    repo = repos.data.find((e) => e.name === repoName);
    expect(repo.full_name).to.eql('aperdomob/jasmine-json-report');
    expect(repo.private).to.eql(false);
    expect(repo.description).to.eql('A Simple Jasmine JSON Report');
  });

  it('Downloading jasmine-json-report Repository', async () => {
    const response = await axios.get(`${repo.url}/zipball/${repo.default_branch}`);
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.headers['content-type']).to.equal('application/zip');
  });

  it('Checking Name, Path and Sha in README file', async () => {
    const readmeFile = await axios.get(`${repo.url}/contents`);
    const nameFile = 'README.md';
    const pathFile = 'README.md';
    const shaFile = '360eee6c223cee31e2a59632a2bb9e710a52cdc0';
    readmeInfo = readmeFile.data.find((e) => e.name === nameFile);
    expect(readmeFile.status).to.equal(StatusCodes.OK);
    expect(readmeInfo).to.containSubset({
      name: nameFile,
      path: pathFile,
      sha: shaFile
    });
  });

  it('Checking MD5 in README file', async () => {
    const response = await axios.get(`${readmeInfo.download_url}`);
    expect(md5(response)).to.equal('3449c9e5e332f1dbb81505cd739fbf3f');
  });
});
