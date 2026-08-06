import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Cookie-only browser auth — do not attach Bearer from localStorage (XSS).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aura_token')
    }
    return Promise.reject(error)
  },
)
