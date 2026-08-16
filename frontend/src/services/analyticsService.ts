import API from './api'

export const getOverviewAnalytics = async () => {
  const response = await API.get('/analytics/overview')
  return response.data
}

export const getNoticeAnalytics = async (id) => {
  const response = await API.get(`/analytics/notices/${id}`)
  return response.data
}
