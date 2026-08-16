const aiService = require('../services/ai')
const AIAnalysis = require('../models/AIAnalysis')
const AISummary = require('../models/AISummary')
const Notice = require('../models/Notice')

const analyzeNotice = async (req, res, next) => {
  try {
    const { noticeId, title, text } = req.body

    let inputTitle = title || ''
    let inputText = text || ''

    if (noticeId) {
      const notice = await Notice.findById(noticeId)
      if (notice) {
        inputTitle = notice.title
        inputText = notice.extractedText || notice.description
      }
    }

    const analysisResult = await aiService.analyzeNotice(inputTitle, inputText)

    let record
    if (noticeId) {
      record = await AIAnalysis.findOneAndUpdate(
        { noticeId },
        { noticeId, extractedText: inputText, ...analysisResult },
        { upsert: true, new: true }
      )
      await Notice.findByIdAndUpdate(noticeId, { aiAnalysisId: record._id })
    }

    res.json({ success: true, analysis: record || analysisResult })
  } catch (err) {
    next(err)
  }
}

const summarizeNotice = async (req, res, next) => {
  try {
    const { noticeId, title, text } = req.body

    if (noticeId) {
      const existing = await AISummary.findOne({ noticeId })
      if (existing) {
        existing.usageCount += 1
        await existing.save()
        return res.json({ success: true, summary: existing })
      }
    }

    let inputTitle = title || ''
    let inputText = text || ''

    if (noticeId) {
      const notice = await Notice.findById(noticeId)
      if (notice) {
        inputTitle = notice.title
        inputText = notice.extractedText || notice.description
      }
    }

    const summaryResult = await aiService.summarizeNotice(inputTitle, inputText)

    let record
    if (noticeId) {
      record = await AISummary.create({
        noticeId,
        ...summaryResult,
        usageCount: 1
      })
      await Notice.findByIdAndUpdate(noticeId, { aiSummaryId: record._id })
    }

    res.json({ success: true, summary: record || summaryResult })
  } catch (err) {
    next(err)
  }
}

const suggestAudience = async (req, res, next) => {
  try {
    const { title, text } = req.body
    const suggestion = await aiService.suggestAudience(title, text)
    res.json({ success: true, suggestion })
  } catch (err) {
    next(err)
  }
}

module.exports = { analyzeNotice, summarizeNotice, suggestAudience }
