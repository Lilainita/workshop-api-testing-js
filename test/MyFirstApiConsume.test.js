const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

describe('First Api Tests', () => {
  const query = {
    name: 'John',
    age: '31',
    city: 'New York'
  };

  it('Consume GET Service', async () => {
    const response = await axios.get('https://httpbin.org/ip');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const response = await axios.get('https://httpbin.org/get', { query });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.config.query).to.eql(query);
  });

  it('Consume HEAD Service', async () => {
    const response = await axios.head('https://httpbin.org/headers');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.headers).to.have.property('content-type');
    expect(response.data).to.eql('');
  });

  it('Consume PATCH Service', async () => {
    const response = await axios.patch('https://httpbin.org/patch', query);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.data).to.eql(JSON.stringify(query));
    expect(response.data.json).to.eql(query);
  });

  it('Consume PUT Service', async () => {
    const response = await axios.put('https://httpbin.org/put', query);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.data).to.eql(JSON.stringify(query));
  });

  it('Consume DELETE Service', async () => {
    const response = await axios.delete('https://httpbin.org/delete');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.data).to.eql('');
  });

  it('Consume POST Service ', async () => {
    const body = {
      comments: 'Send it fast!',
      custemail: 'lily@myemail.com',
      custname: 'Lily',
      custtel: '311452',
      delivery: '19:30',
      size: 'large',
      topping: [
        'bacon',
        'cheese',
        'onion',
        'mushroom'
      ]
    };

    const response = await axios.post('https://httpbin.org/post', body);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.json).to.eql(body);
  });
});
