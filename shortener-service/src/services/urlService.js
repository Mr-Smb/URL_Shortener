const crypto = require('crypto');
const urlRepository = require('../repositories/urlRepository');
const redisClient = require('../config/redis');

const generateShortCode = () => {
  return crypto.randomBytes(4).toString('base64url').substring(0, 6);
};

const parseExpiry = (expiryStr) => {
  if (!expiryStr) return null;
  const match = expiryStr.match(/^(\\d+)(h|d)$/);
  if (!match) return null;
  const value = parseInt(match[1]);
  const unit = match[2];
  
  const date = new Date();
  if (unit === 'h') {
    date.setHours(date.getHours() + value);
  } else if (unit === 'd') {
    date.setDate(date.getDate() + value);
  }
  return date;
};

const urlService = {
  async createShortUrl({ url, customAlias, expiry }) {
    if (customAlias) {
      const existing = await urlRepository.getUrlByCustomAlias(customAlias);
      if (existing) {
        throw new Error('Custom alias already exists');
      }
    }

    let shortCode = customAlias;
    if (!shortCode) {
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        attempts++;
        if (attempts > 10) throw new Error('Could not generate unique short code');
      } while (await urlRepository.getUrlByShortCode(shortCode));
    }

    const expiryTime = parseExpiry(expiry);
    const savedUrl = await urlRepository.saveUrl(shortCode, url, customAlias || null, expiryTime);

    // Cache the mapping, if it expires natively via Redis, we can set TTL matching expiry
    if (expiryTime) {
      const ttl = Math.max(1, Math.floor((expiryTime.getTime() - Date.now()) / 1000));
      await redisClient.setEx(`url:${shortCode}`, ttl, url);
    } else {
      await redisClient.setEx(`url:${shortCode}`, 3600, url); // Default cache 1h
    }

    return savedUrl;
  }
};

module.exports = urlService;
