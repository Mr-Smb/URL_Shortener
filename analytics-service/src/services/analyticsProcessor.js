const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const analyticsRepository = require('../repositories/analyticsRepository');
const { subscriberClient } = require('../config/redis');

const analyticsProcessor = {
  async startConsuming() {
    await subscriberClient.connect();
    
    await subscriberClient.subscribe('analytics_events', async (message) => {
      try {
        const payload = JSON.parse(message);
        
        let ip = payload.ipAddress;
        // Basic localhost ipv6 -> ipv4 handling
        if (ip === '::1' || ip === '::ffff:127.0.0.1') ip = '127.0.0.1';

        const geo = geoip.lookup(ip);
        const parser = new UAParser(payload.userAgent);
        const result = parser.getResult();

        const eventData = {
          shortCode: payload.shortCode,
          ip: ip,
          country: geo ? geo.country : 'Unknown',
          city: geo ? geo.city : 'Unknown',
          device: result.device.type || 'desktop',
          browser: result.browser.name || 'Unknown',
          os: result.os.name || 'Unknown',
          clickedAt: payload.timestamp
        };

        await analyticsRepository.saveEvent(eventData);

      } catch (err) {
        console.error('Event Consumer Error:', err);
      }
    });

    console.log('✅ Listening for events on analytics_events');
  }
};

module.exports = analyticsProcessor;
