const analyticsService = require('../services/analytics/analyticsService')

const getOverview = async (req, res, next) => {
  try {
    const stats = await analyticsService.getOverviewStats()
    res.json({ success: true, stats })
  } catch (err) {
    next(err)
  }
}

const getNoticeAnalytics = async (req, res, next) => {
  try {
    const stats = await analyticsService.getNoticeStats(req.params.id)
    if (!stats) return res.status(404).json({ success: false, message: 'Notice not found' })
    res.json({ success: true, stats })
  } catch (err) {
    next(err)
  }
}

module.exports = { getOverview, getNoticeAnalytics }
