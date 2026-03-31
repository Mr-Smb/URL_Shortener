require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const metrics = require('./utils/metrics');
global.cacheHitsTotal = new metrics.promClient.Counter({
  name: 'url_redirect_cache_hits_total',
  help: 'Total number of cache hits'
});

const redisClient = require('./config/redis');
const db = require('./config/database');
const redirectController = require('./controllers/redirectController');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.use(metrics.metricsMiddleware);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.promClient.register.contentType);
  res.end(await metrics.promClient.register.metrics());
});

app.get('/:shortCode', redirectController.handleRedirect);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

async function startServer() {
  try {
    await db.query('SELECT 1');
    console.log('✅ PostgreSQL ready');
    await redisClient.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 URL Redirect Service on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();
