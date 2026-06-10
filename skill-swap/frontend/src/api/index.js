import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    const msg = error.response?.data?.error || '请求失败，请稍后重试'
    return Promise.reject(new Error(msg))
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`)
}

export const skillAPI = {
  getSkills: (params) => api.get('/skills', { params }),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
  getCategories: (params) => api.get('/skill-categories', { params })
}

export const categoryAPI = {
  getCategories: (params) => api.get('/skill-categories', { params }),
  createCategory: (data) => api.post('/skill-categories', data),
  updateCategory: (id, data) => api.put(`/skill-categories/${id}`, data),
  toggleCategory: (id) => api.put(`/skill-categories/${id}/toggle`),
  deleteCategory: (id) => api.delete(`/skill-categories/${id}`),
  createDirection: (catId, data) => api.post(`/skill-categories/${catId}/directions`, data),
  updateDirection: (catId, dirId, data) => api.put(`/skill-categories/${catId}/directions/${dirId}`, data),
  toggleDirection: (catId, dirId) => api.put(`/skill-categories/${catId}/directions/${dirId}/toggle`),
  deleteDirection: (catId, dirId) => api.delete(`/skill-categories/${catId}/directions/${dirId}`)
}

export const matchAPI = {
  getMatches: (params) => api.get('/matches', { params })
}

export const messageAPI = {
  getConversations: () => api.get('/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (data) => api.post('/messages', data)
}

export const exchangeAPI = {
  getExchanges: () => api.get('/exchanges'),
  createExchange: (data) => api.post('/exchanges', data),
  confirmExchange: (id) => api.put(`/exchanges/${id}/confirm`)
}

export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getReviews: (userId) => api.get(`/reviews/${userId}`)
}

export const statsAPI = {
  getPopularSkills: () => api.get('/stats/popular-skills'),
  getSuccessRate: () => api.get('/stats/success-rate')
}

export const skillTreeAPI = {
  updateSkillTree: (data) => api.put('/skill-tree', data)
}

export default api
