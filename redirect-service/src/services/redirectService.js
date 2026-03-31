const redisClient = require('../config/redis');
const urlRepository = require('../repositories/urlRepository');

const redirectService = {
  async getUrl(shortCode) {
    // 1. Check cache
    const cacheKey = `url:${shortCode}`;
    const cachedUrl = await redisClient.get(cacheKey);
    let originalUrl = cachedUrl;
    
    if (cachedUrl && global.cacheHitsTotal) {
      global.cacheHitsTotal.inc();
    }

    // 2. Fallback to DB
    if (!originalUrl) {
      const urlData = await urlRepository.getUrlByShortCode(shortCode);
      if (!urlData) return null;

      // Check Expiry (if expired in DB)
      if (urlData.expiry_time && new Date(urlData.expiry_time) < new Date()) {
        const error = new Error('URL has expired');
        error.status = 410;
        throw error;
      }
      
      originalUrl = urlData.original_url;

      // Update cache
      let ttl = 3600;
      if (urlData.expiry_time) {
        ttl = Math.max(1, Math.floor((new Date(urlData.expiry_time).getTime() - Date.now()) / 1000));
      }
      await redisClient.setEx(cacheKey, ttl, originalUrl);
    }
    return originalUrl;
  },

  async publishAnalytics(shortCode, req) {
    try {
      const eventData = {
        shortCode,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress,
        timestamp: new Date().toISOString()
      };
      // Async Pub/Sub
      await redisClient.publish('analytics_events', JSON.stringify(eventData));
    } catch (err) {
      console.error('Failed to dispatch analytics event', err);
    }
  }
};

module.exports = redirectService;
