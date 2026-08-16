class AIProvider {
  async analyzeNotice(title, text) {
    throw new Error('Method analyzeNotice() must be implemented')
  }

  async summarizeNotice(title, text) {
    throw new Error('Method summarizeNotice() must be implemented')
  }

  async extractImportantDate(text) {
    throw new Error('Method extractImportantDate() must be implemented')
  }

  async suggestAudience(title, text) {
    throw new Error('Method suggestAudience() must be implemented')
  }
}

module.exports = AIProvider
