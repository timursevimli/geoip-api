'use strict';

const assert = require('node:assert');
const test = require('node:test');
const { createServer } = require('../lib/server.js');
const getGeoInfo = require('../lib');

test('GeoInfo (IPv4)', () => {
  const geo1 = getGeoInfo('8.8.8.8');
  assert.strictEqual(geo1, 'US');

  const geo2 = getGeoInfo('127.0.0.1');
  assert.strictEqual(geo2, '');

  const geo3 = getGeoInfo('123.123.123.123');
  assert.strictEqual(geo3, 'CN');

  const geo4 = getGeoInfo('123.0123.256.-1');
  assert.strictEqual(geo4, '');

  const geo5 = getGeoInfo('some.value');
  assert.strictEqual(geo5, '');
});

test('GeoInfo (IPv6)', () => {
  const geo1 = getGeoInfo('2a02:2168:1ec2:8000:d8e6:2847:7772:b512');
  assert.strictEqual(geo1, 'RU');

  const geo2 = getGeoInfo('2a01:5ec0:1018:2011:59fb:2f88:a46d:b69b');
  assert.strictEqual(geo2, 'IR');

  const geo3 = getGeoInfo('2a02:4780:29:b66a:9857:1105:ab86:6eb7');
  assert.strictEqual(geo3, 'FR');

  const geo4 = getGeoInfo('2001:19f0:7400:1a54:5400:3ff:fee2:36a5');
  assert.strictEqual(geo4, 'GB');
});

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
