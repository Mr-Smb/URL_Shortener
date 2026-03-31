const db = require('../config/database');

const urlRepository = {
  async getUrlByShortCode(shortCode) {
    const res = await db.query('SELECT * FROM urls WHERE short_code = $1 OR custom_alias = $1', [shortCode]);
    return res.rows[0];
  }
};

module.exports = urlRepository;
