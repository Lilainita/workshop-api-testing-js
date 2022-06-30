const { StatusCodes } = require('http-status-codes');
const chai = require('chai');
const { expect } = require('chai');
const chaiSubset = require('chai-subset');
const md5 = require('md5');

chai.use(chaiSubset);
const axios = require('axios');

const urlBase = 'https://api.github.com';
const repoName = 'jasmine-json-report';

describe('Consuming GET Method GitHub API', () => {
  it('Consume GET Service', async () => {
    const response = await axios.get(`${urlBase}/users/aperdomob`);
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.name).to.eql('Alejandro Perdomo');
    expect(response.data.company).to.eql('Perficient Latam');
    expect(response.data.location).to.eql('Colombia');
  });

  it('Repo List Aperdomob', async () => {
    const repos = await axios.get(`${urlBase}/users/aperdomob/repos`);
    const repo = repos.data.find((e) => e.name === repoName);
    expect(repos.data[12].name).to.eql(repo.name);
    expect(repo.full_name).to.eql('aperdomob/jasmine-json-report');
    expect(repo.private).to.eql(false);
    expect(repo.description).to.eql('A Simple Jasmine JSON Report');
  });

  it('Downloading jasmine-json-report Repository', async () => {
    const response = await axios.get(`${urlBase}/repos/aperdomob/${repoName}/zipball/master`);
    expect(response.status).to.equal(StatusCodes.OK);
  });

  it('Checking Name, Path and Sha in README file', async () => {
    const response = await axios.get(`${urlBase}/repos/aperdomob/${repoName}/contents`);
    const nameFile = 'README.md';
    const pathFile = 'README.md';
    const shaFile = '360eee6c223cee31e2a59632a2bb9e710a52cdc0';

    const readmeFile = response.data.find((e) => e.name === nameFile);
    expect(response.status).to.equal(StatusCodes.OK);
    expect(readmeFile).to.containSubset({
      name: nameFile,
      path: pathFile,
      sha: shaFile
    });
  });

  it('Checking MD5 in README file', async () => {
    const response = await axios.get('https://raw.githubusercontent.com/aperdomob/jasmine-json-report/master/README.md');
    expect(md5(response)).to.equal('3449c9e5e332f1dbb81505cd739fbf3f');
  });
});
