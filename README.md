# GeoIP - API

### Install

```bash
git lfs clone https://github.com/timursevimli/geoip-api.git
```

### Usage (API)

```bash
npm start # default running on port 8000 or PORT=8000 node main.js
curl "http://localhost:8000?ip=8.8.8.8" # -> {"country":"US"}
# or
curl "http://localhost:8000" # -> return ip of forwarder or sender of the request
```

### Usage (Module)

```javascript
'use strict';

const { getGeoInfo } = require('geo-api');

console.log(getGeoInfo('8.8.8.8')); //output -> 'US'
```
