const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: process.env.REDIS_DB || 0
});

client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('✅ Redis connected successfully'));

module.exports = client;
