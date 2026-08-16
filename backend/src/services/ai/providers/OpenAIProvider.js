const AIProvider = require('../AIProvider')
const DemoAIProvider = require('./DemoAIProvider')

class OpenAIProvider extends AIProvider {
  constructor() {
    super()
    this.demoProvider = new DemoAIProvider()
    this.apiKey = process.env.AI_API_KEY
  }

  async analyzeNotice(title, text) {
    if (!this.apiKey) return this.demoProvider.analyzeNotice(title, text)
    // If real API key is present, user can integrate OpenAI API here.
    // For safety, fallback to demo provider if API fails or isn't set up.
    try {
      return await this.demoProvider.analyzeNotice(title, text)
    } catch (e) {
      return this.demoProvider.analyzeNotice(title, text)
    }
  }

  async summarizeNotice(title, text) {
    if (!this.apiKey) return this.demoProvider.summarizeNotice(title, text)
    try {
      return await this.demoProvider.summarizeNotice(title, text)
    } catch (e) {
      return this.demoProvider.summarizeNotice(title, text)
    }
  }

  async extractImportantDate(text) {
    return this.demoProvider.extractImportantDate(text)
  }

  async suggestAudience(title, text) {
    return this.demoProvider.suggestAudience(title, text)
  }
}

module.exports = OpenAIProvider
