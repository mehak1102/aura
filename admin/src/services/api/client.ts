import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
})

// Cookie-only browser auth — do not attach Bearer from localStorage (XSS).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aura_admin_token')
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
