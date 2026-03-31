const redisClient = require('../config/redis');

const rateLimiter = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const key = `ratelimit:${ip}`;
  const limit = 10;
  const ttl = 60; // 60 seconds

  try {
    const current = await redisClient.incr(key);
    if (current === 1) {
      await redisClient.expire(key, ttl);
    }
    if (current > limit) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }
    next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    next(); // fail open if Redis is down
  }
};

module.exports = rateLimiter;
