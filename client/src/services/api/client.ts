import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

function apiMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Request failed'
  }
  const data = error.response?.data as { message?: string } | undefined
  return data?.message || error.message || 'Request failed'
}

// Cookie-only browser auth — do not attach Bearer from localStorage (XSS).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aura_token')
    }
    const err = new Error(apiMessage(error)) as Error & {
      status?: number
      code?: string
    }
    err.status = error.response?.status
    if (error.response?.data?.code) err.code = error.response.data.code
    return Promise.reject(err)
  },
)
