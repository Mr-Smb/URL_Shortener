const promClient = require('prom-client');
promClient.collectDefaultMetrics();

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDurationSeconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

const urlCreatedTotal = new promClient.Counter({
  name: 'url_created_total',
  help: 'Total number of shortened URLs created'
});

const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    if (route !== '/metrics' && route !== '/health') {
      httpRequestsTotal.inc({
        method: req.method,
        route: route,
        status: res.statusCode
      });
      end({
        method: req.method,
        route: route,
        status: res.statusCode
      });
    }
  });
  next();
};

module.exports = {
  promClient,
  metricsMiddleware,
  urlCreatedTotal
};
