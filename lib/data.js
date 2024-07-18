'use strict';

const fs = require('node:fs');
const path = require('node:path');

const getDataSync = (fileName) => {
  const filePath = path.join(__dirname, '../data', fileName);
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n').filter((line) => !!line);
  return lines;
};

module.exports = { getDataSync };
