import API from './api'

export const analyzeNotice = async (noticeId, title, text) => {
  const response = await API.post('/ai/analyze-notice', { noticeId, title, text })
  return response.data
}

export const summarizeNotice = async (noticeId, title, text) => {
  const response = await API.post('/ai/summarize-notice', { noticeId, title, text })
  return response.data
}

export const suggestAudience = async (title, text) => {
  const response = await API.post('/ai/suggest-audience', { title, text })
  return response.data
}
