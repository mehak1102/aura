import axios from 'axios'
import { setStoredToken } from './tokens'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aura_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      setStoredToken(null)
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Request failed'
    const err = new Error(message) as Error & { code?: string }
    if (error.response?.data?.code) err.code = error.response.data.code
    return Promise.reject(err)
  },
)
