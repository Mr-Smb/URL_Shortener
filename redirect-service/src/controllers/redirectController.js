const redirectService = require('../services/redirectService');
const metrics = require('../utils/metrics');
const geoip = require('geoip-lite');
const parser = require('ua-parser-js');

const redirectController = {
  async handleRedirect(req, res, next) {
    try {
      const { shortCode } = req.params;
      
      const originalUrl = await redirectService.getUrl(shortCode);
      
      if (!originalUrl) {
        return res.status(404).json({ error: 'Short URL not found' });
      }

      // Fire async event non-blocking
      redirectService.publishAnalytics(shortCode, req);

      // Extract metrics
      metrics.urlRedirectCount.inc();
      metrics.clicksByShortId.inc({ shortId: shortCode });

      const ip = req.ip || req.connection.remoteAddress || '';
      let country = 'Unknown';
      if (ip) {
        const geo = geoip.lookup(ip);
        if (geo) country = geo.country;
      }
      metrics.clicksByCountry.inc({ country });

      const ua = parser(req.headers['user-agent']);
      const device = ua.device.type || 'desktop';
      const browser = ua.browser.name || 'Unknown';
      metrics.clicksByDevice.inc({ device });
      metrics.clicksByBrowser.inc({ browser });

      res.redirect(302, originalUrl);
    } catch (error) {
      if (error.status === 410) {
        return res.status(410).json({ error: 'URL has expired (Gone)' });
      }
      console.error('Redirect Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = redirectController;
