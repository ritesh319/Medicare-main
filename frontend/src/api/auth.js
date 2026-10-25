import axios from 'axios'

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

const unwrap = (res) => res.data?.data ?? res.data

export const authApi = {
  login:    (payload) => authClient.post('/auth/login',    payload).then(unwrap),
  register: (payload) => authClient.post('/auth/register', payload).then(unwrap),
  registerDoctor: (formData) => authClient.post('/auth/register-doctor', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap),
  refresh:  (token)   => authClient.post('/auth/refresh',  {}, {
    headers: { 'Refresh-Token': token }
  }).then(unwrap),
}
