const AIProvider = require('../AIProvider')
const DemoAIProvider = require('./DemoAIProvider')

class GeminiAIProvider extends AIProvider {
  constructor() {
    super()
    this.apiKey = process.env.AI_API_KEY
    this.modelName = process.env.AI_MODEL || 'gemini-1.5-flash'
    this.demoProvider = new DemoAIProvider()
    this.genAI = null

    if (this.apiKey) {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai')
        this.genAI = new GoogleGenerativeAI(this.apiKey)
      } catch (err) {
        console.warn('[GeminiAIProvider] @google/generative-ai not installed, falling back to demo provider.')
      }
    }
  }

  _getModel() {
    if (!this.genAI) return null
    return this.genAI.getGenerativeModel({ model: this.modelName })
  }

  async _ask(prompt) {
    const model = this._getModel()
    if (!model) return null
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  }

  async analyzeNotice(title = '', text = '') {
    if (!this.genAI) return this.demoProvider.analyzeNotice(title, text)

    const prompt = `You are an AI assistant for DSVV (Dev Sanskriti Vishwavidyalaya) university notice board system.
Analyze the following university notice and return ONLY a valid JSON object (no markdown, no explanation).

Notice Title: "${title}"
Notice Text: "${text}"

Return JSON with these exact keys:
{
  "departmentSuggestion": "<department name>",
  "courseSuggestion": "<course e.g. BCA, MCA, B.Sc IT>",
  "semesterSuggestion": "<semester e.g. 3rd Semester>",
  "categorySuggestion": "<one of: Examination, Timetable, Circular, Holiday, Admission, Event, Workshop, Assignment, Notice>",
  "noticeTypeSuggestion": "<one of: Circular, Schedule, Notice>",
  "prioritySuggestion": "<one of: High, Medium, Low>",
  "targetTypeSuggestion": "<one of: UNIVERSITY, COURSE, SEMESTER>",
  "audienceSuggestion": "<description of target audience>",
  "keywords": ["<keyword1>", "<keyword2>"],
  "confidence": <number 0-100>,
  "model": "${this.modelName}",
  "provider": "gemini",
  "status": "<completed or needs_review>"
}`

    try {
      const raw = await this._ask(prompt)
      const json = raw.replace(/```json|```/g, '').trim()
      return JSON.parse(json)
    } catch (err) {
      console.error('[GeminiAIProvider] analyzeNotice error:', err.message)
      return this.demoProvider.analyzeNotice(title, text)
    }
  }

  async summarizeNotice(title = '', text = '') {
    if (!this.genAI) return this.demoProvider.summarizeNotice(title, text)

    const prompt = `You are an AI assistant for DSVV university notice board. Summarize this notice and return ONLY valid JSON (no markdown).

Title: "${title}"
Text: "${text}"

Return JSON with these exact keys:
{
  "overview": "<one sentence overview>",
  "keyPoints": ["<point1>", "<point2>", "<point3>"],
  "importantDate": "<key date or 'Not specified'>",
  "actionRequired": "<what students should do>",
  "category": "<category>",
  "priority": "<High, Medium, or Low>",
  "provider": "gemini",
  "model": "${this.modelName}",
  "isDemo": false
}`

    try {
      const raw = await this._ask(prompt)
      const json = raw.replace(/```json|```/g, '').trim()
      return JSON.parse(json)
    } catch (err) {
      console.error('[GeminiAIProvider] summarizeNotice error:', err.message)
      return this.demoProvider.summarizeNotice(title, text)
    }
  }

  async extractImportantDate(text = '') {
    return this.demoProvider.extractImportantDate(text)
  }

  async suggestAudience(title = '', text = '') {
    const analysis = await this.analyzeNotice(title, text)
    return {
      targetType: analysis.targetTypeSuggestion,
      audienceDescription: analysis.audienceSuggestion
    }
  }
}

module.exports = GeminiAIProvider
