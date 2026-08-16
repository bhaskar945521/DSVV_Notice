import API from './api'

export const getDepartments = async () => {
  const response = await API.get('/departments')
  return response.data
}

export const getCourses = async (departmentId) => {
  const response = await API.get('/courses', { params: { departmentId } })
  return response.data
}

export const getSemesters = async (courseId) => {
  const response = await API.get('/semesters', { params: { courseId } })
  return response.data
}

export const getSections = async (semesterId) => {
  const response = await API.get('/sections', { params: { semesterId } })
  return response.data
}

export const getSourceConnectors = async () => {
  const response = await API.get('/sources')
  return response.data
}

export const checkSourceConnector = async (id) => {
  const response = await API.post(`/sources/${id}/check`)
  return response.data
}

export const getAuditLogs = async () => {
  const response = await API.get('/audit-logs')
  return response.data
}

export const getAnnouncements = async () => {
  const response = await API.get('/announcements')
  return response.data
}
