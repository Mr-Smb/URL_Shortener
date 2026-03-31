require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const metrics = require('./utils/metrics');
const redisClient = require('./config/redis');
const db = require('./config/database');
const urlController = require('./controllers/urlController');
const rateLimiter = require('./middlewares/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => res.status(200).json({ status: 'OK', service: 'URL Shortener' }));

app.use(metrics.metricsMiddleware);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.promClient.register.contentType);
  res.end(await metrics.promClient.register.metrics());
});

// Apply rate limiter specifically to shortening endpoint
app.post('/api/shorten', rateLimiter, urlController.shortenUrl);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

async function startServer() {
  try {
    // ensure DB works
    await db.query('SELECT 1');
    console.log('✅ PostgreSQL ready');
    await redisClient.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 URL Shortener Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();
