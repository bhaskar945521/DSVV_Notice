const SourceConnector = require('../../models/SourceConnector')
const SourceItem = require('../../models/SourceItem')
const AIAnalysis = require('../../models/AIAnalysis')
const aiService = require('../ai')

class IngestionService {
  async checkConnector(connectorId) {
    const connector = await SourceConnector.findById(connectorId)
    if (!connector) throw new Error('Source connector not found')

    // Simulated ingestion check for authorized DSVV source
    const sampleDetections = [
      {
        title: 'BCA 7th Semester Examination Schedule & Practical Guidelines',
        excerpt: 'The examination timetable for BCA 7th Semester has been revised. Theory exams commence from 20th August 2026.',
        sourceUrl: `${connector.url}/notices/bca-7th-sem-exam-2026`,
        extractedText: 'DSVV Official Examination Notice: BCA 7th Semester Examination schedule revised. Practical examinations start 18th August 2026. Theory examinations commence 22nd August 2026 in Lab 3.'
      },
      {
        title: 'University Holiday Circular — Independence Day Celebration Schedule',
        excerpt: 'The university will remain closed on 15th August 2026 for Independence Day celebrations. Attendance mandatory for morning flag hoisting.',
        sourceUrl: `${connector.url}/circulars/independence-day-2026`,
        extractedText: 'University Academic Circular: Independence Day flag hoisting ceremony will start at 7:30 AM at Central Ground. All students and staff invited.'
      }
    ]

    const createdItems = []
    for (const itemData of sampleDetections) {
      const existing = await SourceItem.findOne({ title: itemData.title })
      if (existing) continue

      const item = await SourceItem.create({
        connectorId: connector._id,
        title: itemData.title,
        excerpt: itemData.excerpt,
        sourceUrl: itemData.sourceUrl,
        extractedText: itemData.extractedText,
        status: 'new'
      })

      // Run AI Analysis automatically on detected item
      const aiResult = await aiService.analyzeNotice(item.title, item.extractedText)
      const aiRecord = await AIAnalysis.create({
        noticeId: item._id, // placeholder ref
        extractedText: item.extractedText,
        ...aiResult
      })

      item.aiAnalysisId = aiRecord._id
      await item.save()

      createdItems.push(item)
    }

    connector.lastCheckedAt = new Date()
    connector.lastItemsFound = createdItems.length
    connector.status = 'connected'
    await connector.save()

    return { connector, newItems: createdItems }
  }
}

module.exports = new IngestionService()
