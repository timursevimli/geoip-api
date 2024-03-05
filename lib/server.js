'use strict';

const http = require('node:http');
const { getGeoInfo } = require('./geo.js');

module.exports = {
  createServer: (port = 8000) =>
    http
      .createServer((req, res) => {
        const { searchParams } = new URL(req.url, 'http://localhost');
        const targetIp =
          searchParams.get('ip') || req.headers['x-forwarded-for'];
        const headers = { 'Content-Type': 'application/json' };
        try {
          const geo = getGeoInfo(targetIp || req.socket.remoteAddress);
          if (geo === '') throw new Error();
          const result = JSON.stringify({ country: geo });
          res.writeHead(200, {
            ...headers,
            'Content-Length': Buffer.byteLength(result),
          });
          res.end(result);
        } catch {
          const result = JSON.stringify({ message: 'Data not found' });
          res.writeHead(404, {
            ...headers,
            'Content-Length': Buffer.byteLength(result),
          });
          res.end(result);
        }
      })
      .listen(port),
};
