const SourceConnector = require('../models/SourceConnector')
const SourceItem = require('../models/SourceItem')
const ingestionService = require('../services/ingestion/ingestionService')

const getConnectors = async (req, res, next) => {
  try {
    const connectors = await SourceConnector.find()
    const autoDetectedItems = await SourceItem.find().sort({ detectedAt: -1 }).limit(20)
    res.json({ success: true, connectors, autoDetectedItems })
  } catch (err) {
    next(err)
  }
}

const checkConnector = async (req, res, next) => {
  try {
    const result = await ingestionService.checkConnector(req.params.id)
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

const updateSourceItem = async (req, res, next) => {
  try {
    const item = await SourceItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, item })
  } catch (err) {
    next(err)
  }
}

module.exports = { getConnectors, checkConnector, updateSourceItem }
