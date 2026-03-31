require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const metrics = require('./utils/metrics');
const db = require('./config/database');
const analyticsController = require('./controllers/analyticsController');
const analyticsProcessor = require('./services/analyticsProcessor');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.use(metrics.metricsMiddleware);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.promClient.register.contentType);
  res.end(await metrics.promClient.register.metrics());
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/analytics/')) {
    metrics.analyticsEventsTotal.inc();
  }
  next();
});

app.get('/api/analytics/:code', analyticsController.getAnalytics);

app.use((err, req, res, next) => res.status(500).json({ error: 'Internal Error' }));

async function startServer() {
  try {
    await db.query('SELECT 1');
    console.log('✅ PostgreSQL ready');
    
    // Start Redis subscriptions
    await analyticsProcessor.startConsuming();

    app.listen(PORT, () => {
      console.log(`🚀 Analytics Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();
