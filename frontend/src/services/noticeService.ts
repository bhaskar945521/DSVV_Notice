import API from './api'

export const getNotices = async (params = {}) => {
  const response = await API.get('/notices', { params })
  return response.data
}

export const getNotice = async (id) => {
  const response = await API.get(`/notices/${id}`)
  return response.data
}

export const createNotice = async (data) => {
  const response = await API.post('/notices', data)
  return response.data
}

export const updateNotice = async (id, data) => {
  const response = await API.patch(`/notices/${id}`, data)
  return response.data
}

export const deleteNotice = async (id) => {
  const response = await API.delete(`/notices/${id}`)
  return response.data
}

export const uploadNoticeFile = async (id, file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await API.post(`/notices/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const submitNotice = async (id, comment) => {
  const response = await API.post(`/notices/${id}/submit`, { comment })
  return response.data
}

export const approveNotice = async (id, comment) => {
  const response = await API.post(`/notices/${id}/approve`, { comment })
  return response.data
}

export const rejectNotice = async (id, reason, comment) => {
  const response = await API.post(`/notices/${id}/reject`, { reason, comment })
  return response.data
}

export const requestChanges = async (id, comment) => {
  const response = await API.post(`/notices/${id}/request-changes`, { comment })
  return response.data
}

export const getApprovalHistory = async (id) => {
  const response = await API.get(`/notices/${id}/approval-history`)
  return response.data
}

export const saveNotice = async (id) => {
  const response = await API.post(`/notices/${id}/save`)
  return response.data
}

export const getSavedNotices = async () => {
  const response = await API.get('/notices/saved')
  return response.data
}

export const trackNoticeEvent = async (id, action) => {
  const response = await API.post(`/notices/${id}/track`, { action })
  return response.data
}

export const setNoticeTargets = async (id, targetData) => {
  const response = await API.post(`/notices/${id}/targets`, targetData)
  return response.data
}
