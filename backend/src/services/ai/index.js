const DemoAIProvider = require('./providers/DemoAIProvider')
const OpenAIProvider = require('./providers/OpenAIProvider')
const GeminiAIProvider = require('./providers/GeminiAIProvider')

function getAIProvider() {
  const provider = process.env.AI_PROVIDER || 'demo'
  if (provider === 'openai') {
    return new OpenAIProvider()
  }
  if (provider === 'gemini') {
    return new GeminiAIProvider()
  }
  return new DemoAIProvider()
}

module.exports = getAIProvider()
