const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: process.env.REDIS_DB || 0
});

client.on('error', (err) => console.error('Redis Publisher Client Error:', err));

// Duplicate client specifically for subscriptions
const subscriberClient = client.duplicate();
subscriberClient.on('error', (err) => console.error('Redis Subscriber Client Error:', err));

module.exports = { client, subscriberClient };
