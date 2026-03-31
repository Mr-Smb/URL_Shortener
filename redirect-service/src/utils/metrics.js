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

const urlRedirectCount = new promClient.Counter({
  name: 'url_redirect_count',
  help: 'Total number of URL redirects'
});

const clicksByCountry = new promClient.Counter({
  name: 'clicks_by_country',
  help: 'Total clicks grouped by country',
  labelNames: ['country']
});

const clicksByDevice = new promClient.Counter({
  name: 'clicks_by_device',
  help: 'Total clicks grouped by device',
  labelNames: ['device']
});

const clicksByBrowser = new promClient.Counter({
  name: 'clicks_by_browser',
  help: 'Total clicks grouped by browser',
  labelNames: ['browser']
});

const clicksByShortId = new promClient.Counter({
  name: 'clicks_by_shortId',
  help: 'Total clicks grouped by shortId',
  labelNames: ['shortId']
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
  urlRedirectCount,
  clicksByCountry,
  clicksByDevice,
  clicksByBrowser,
  clicksByShortId
};
