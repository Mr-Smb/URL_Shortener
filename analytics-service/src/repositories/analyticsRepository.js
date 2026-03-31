const db = require('../config/database');

const analyticsRepository = {
  async saveEvent({ shortCode, ip, country, city, device, browser, os, clickedAt }) {
    const query = `
      INSERT INTO click_events (short_code, ip, country, city, device, browser, os, clicked_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await db.query(query, [shortCode, ip, country, city, device, browser, os, clickedAt]);
  },

  async getAnalytics(shortCode) {
    const urlQuery = 'SELECT * FROM urls WHERE short_code = $1 OR custom_alias = $1';
    const clickQuery = 'SELECT * FROM click_events WHERE short_code = $1';

    const [urlRes, clicksRes] = await Promise.all([
      db.query(urlQuery, [shortCode]),
      db.query(clickQuery, [shortCode])
    ]);

    if (!urlRes.rows[0]) return null;
    return {
      url: urlRes.rows[0],
      clicks: clicksRes.rows
    };
  }
};

module.exports = analyticsRepository;
