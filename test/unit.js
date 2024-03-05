'use strict';

const assert = require('node:assert');
const test = require('node:test');
const { createServer } = require('../lib/server.js');

test('GET', async (t) => {
  const server = createServer(0);

  t.after(() => {
    server.close();
  });

  server.on('error', () => {
    assert.fail();
  });

  try {
    const url = `http://localhost:${server.address().port}`;
    const res = await fetch(url);
    const data = await res.json();

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.headers.get('content-type'), 'application/json');
    assert.strictEqual(data.message, 'Data not found');
  } catch (err) {
    assert.fail();
  }
});

test('GET (query)', async (t) => {
  const server = createServer(0);

  t.after(() => {
    server.close();
  });

  server.on('error', () => {
    assert.fail();
  });

  try {
    const url = `http://localhost:${server.address().port}?`;
    const params = new URLSearchParams({ ip: '8.8.8.8' });
    const res = await fetch(url + params);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'application/json');
    assert.strictEqual(data.country, 'US');
  } catch (err) {
    assert.fail();
  }
});
