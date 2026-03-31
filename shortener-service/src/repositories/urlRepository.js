const db = require('../config/database');

const urlRepository = {
  async getUrlByShortCode(shortCode) {
    const res = await db.query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);
    return res.rows[0];
  },

  async getUrlByCustomAlias(customAlias) {
    const res = await db.query('SELECT * FROM urls WHERE custom_alias = $1', [customAlias]);
    return res.rows[0];
  },

  async saveUrl(shortCode, originalUrl, customAlias, expiryTime) {
    const query = `
      INSERT INTO urls (short_code, original_url, custom_alias, expiry_time) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const res = await db.query(query, [shortCode, originalUrl, customAlias, expiryTime]);
    return res.rows[0];
  }
};

module.exports = urlRepository;
