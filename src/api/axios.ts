import axios from 'axios'

export const apiClient = axios.create({
  // base URL left empty because different services may be used; callers can use full URLs
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

const savedToken = typeof window !== 'undefined' ? localStorage.getItem('aero_token') : null
if (savedToken) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
}

// attach token helper
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

export default apiClient
