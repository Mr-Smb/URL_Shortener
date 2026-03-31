const analyticsRepository = require('../repositories/analyticsRepository');

const analyticsController = {
  async getAnalytics(req, res) {
    try {
      const { code } = req.params;
      const data = await analyticsRepository.getAnalytics(code);
      if (!data) return res.status(404).json({ error: 'Data not found for code' });

      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error while fetching analytics' });
    }
  }
};

module.exports = analyticsController;
