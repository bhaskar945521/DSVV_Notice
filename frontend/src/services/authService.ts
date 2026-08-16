import API from './api'

export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password })
  return response.data
}

export const getMe = async () => {
  const response = await API.get('/auth/me')
  return response.data
}

export const logout = async () => {
  try {
    await API.post('/auth/logout')
  } catch (e) {
    // Ignore errors
  }
}
