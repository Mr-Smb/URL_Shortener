const urlService = require('../services/urlService');
const { validateUrl } = require('../utils/urlValidator');
const { generateQRCode } = require('../utils/qrGenerator');
const metrics = require('../utils/metrics');

const urlController = {
  async shortenUrl(req, res, next) {
    try {
      const { url, customAlias, expiry } = req.body;

      const validation = validateUrl(url);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }

      if (customAlias && !/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
        return res.status(400).json({ error: 'Custom alias contains invalid characters' });
      }

      const savedUrl = await urlService.createShortUrl({ url, customAlias, expiry });
      
      const shortUrl = `${process.env.BASE_URL || 'http://localhost'}/${savedUrl.short_code}`;
      const qrCode = await generateQRCode(shortUrl);
      
      metrics.urlCreatedTotal.inc();

      res.status(201).json({
        shortUrl,
        originalUrl: savedUrl.original_url,
        shortCode: savedUrl.short_code,
        customAlias: savedUrl.custom_alias,
        expiryTime: savedUrl.expiry_time,
        createdAt: savedUrl.created_at,
        qrCode
      });

    } catch (error) {
      if (error.message === 'Custom alias already exists') {
        return res.status(409).json({ error: error.message });
      }
      console.error('Error in shortenUrl:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = urlController;
