'use strict';

const { isIPv4 } = require('node:net');
const { getDataSync } = require('./data.js');

const ARANGE = '2';
const BRANGE = '3';
const COUNTRYCODE = '4';
const INDEXES = [ARANGE, BRANGE, COUNTRYCODE];

const getDataset = (data) => {
  const dataset = [];
  for (const line of data) {
    const cols = line.split(',');
    const newCols = [];
    for (const [i, col] of Object.entries(cols)) {
      if (!INDEXES.includes(i)) continue;
      const str = col.replaceAll('"', '');
      newCols.push(str);
    }
    dataset.push(newCols);
  }
  return dataset;
};

const comparator = (a, b, el) => {
  if (el >= a && el <= b) return 0;
  const mid = (a + b) / 2;
  return el < mid ? 1 : -1;
};

const binarySearch = (arr, item) => {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const guess = arr[mid];
    const [a, b, res] = guess;
    const comparison = comparator(parseInt(a, 10), parseInt(b, 10), item);
    if (comparison === 0) return res;
    if (comparison > 0) high = mid - 1;
    else low = mid + 1;
  }
  return '';
};

const ipv4ToNum = (ip) => {
  const octets = ip.split('.').map(Number);
  const total = octets.reduce((acc, octet) => (acc << 8) | octet, 0) >>> 0;
  return total;
};

const ipv6ToNum = (ip) => {
  const ipv4MappedRegex = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/;
  const match = ip.match(ipv4MappedRegex);
  if (match) return ipv4ToNum(match[1]);
  const groups = ip.split(':');
  const groupsToNum = groups.map((group) => parseInt(group, 16));
  const total = groupsToNum.reduce((acc, value) => acc * 0x10000 + value, 0);
  return total;
};

const data = getDataSync('geoip_data.csv');
const dataset = getDataset(data);

const checkers = {
  ipv4: [ipv4ToNum, (ip) => binarySearch(dataset, ip)],
  ipv6: [ipv6ToNum, (ip) => binarySearch(dataset, ip)],
};

const getGeoInfo = (ip) => {
  const type = isIPv4(ip) ? 'ipv4' : 'ipv6';
  const checker = checkers[type];
  const [converter, finder] = checker;
  const num = converter(ip);
  const result = finder(num);
  return result;
};

module.exports = { getGeoInfo };
