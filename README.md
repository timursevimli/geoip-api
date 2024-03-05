# GeoIP - API

### Install

```bash
git lfs clone https://github.com/timursevimli/geoip-api.git
```

### Usage

```bash
npm start # or node PORT=8000 main.js
curl "http://localhost:8000?ip=8.8.8.8" # -> {"country":"US"}
# or
curl "http://localhost:8000" # -> return ip of forwarder or sender of the request
```
