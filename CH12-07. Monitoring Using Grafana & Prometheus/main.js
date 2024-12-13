const { randomInt } = require('crypto');
const express = require('express');
const app = express();
const port = 3000;

const client = require('prom-client');
const registry = new client.Registry();

const counter = new client.Counter({
  name: "http_request_count",
  help: "Total request count",
  labelNames: ['method', 'status', 'path']
})

const responseTime = new client.Histogram({
  name: 'http_response_time',
  help: 'Response time in milliseconds',
  labelNames: ['method', 'status', 'path'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});

registry.registerMetric(counter);
registry.registerMetric(responseTime);
client.collectDefaultMetrics({ register: registry });

app.use((req, res, next) => {
  const method = req.method;
  const path = req.path;
  const end = responseTime.startTimer();

  res.on('finish', () => {
    const status = res.statusCode;

    counter.inc({
      method: method,
      status: status,
      path: path
    })
    end({
      method: method,
      status: status,
      path: path
    })
  });
  next();
});

app.get('/', async (req, res) => {
  await fetch('https://google.com');
  res.send('Hello World!');
})

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
