const DemoAIProvider = require('./providers/DemoAIProvider')
const OpenAIProvider = require('./providers/OpenAIProvider')

function getAIProvider() {
  const provider = process.env.AI_PROVIDER || 'demo'
  if (provider === 'openai') {
    return new OpenAIProvider()
  }
  return new DemoAIProvider()
}

module.exports = getAIProvider()
