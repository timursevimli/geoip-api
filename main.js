'use strict';

const { createServer } = require('./lib/server.js');

const server = createServer(parseInt(process.env.PORT, 10) || 8000);
server.on('error', () => {});
server.on('listening', () => {
  console.log(`Server listening at http://localhost:${server.address().port}`);
});
