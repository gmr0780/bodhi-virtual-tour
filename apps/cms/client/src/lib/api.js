const API_URL = '/api'

async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return res.json()
}

export const api = {
  // Auth
  getMe: () => fetchAPI('/auth/me'),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),

  // Roles
  getRoles: () => fetchAPI('/roles'),
  createRole: (data) => fetchAPI('/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateRole: (id, data) => fetchAPI(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRole: (id) => fetchAPI(`/roles/${id}`, { method: 'DELETE' }),

  // Topics
  getTopics: () => fetchAPI('/topics'),
  createTopic: (data) => fetchAPI('/topics', { method: 'POST', body: JSON.stringify(data) }),
  updateTopic: (id, data) => fetchAPI(`/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTopic: (id) => fetchAPI(`/topics/${id}`, { method: 'DELETE' }),

  // Screens
  getScreens: (topicId) => fetchAPI(`/screens/topic/${topicId}`),
  createScreen: (data) => fetchAPI('/screens', { method: 'POST', body: JSON.stringify(data) }),
  updateScreen: (id, data) => fetchAPI(`/screens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteScreen: (id) => fetchAPI(`/screens/${id}`, { method: 'DELETE' }),

  // Hotspots
  getHotspots: (screenId) => fetchAPI(`/hotspots/screen/${screenId}`),
  createHotspot: (data) => fetchAPI('/hotspots', { method: 'POST', body: JSON.stringify(data) }),
  updateHotspot: (id, data) => fetchAPI(`/hotspots/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHotspot: (id) => fetchAPI(`/hotspots/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => fetchAPI('/settings'),
  updateSetting: (key, value) => fetchAPI(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),

  // Publish
  preview: () => fetchAPI('/publish/preview'),
  publish: () => fetchAPI('/publish', { method: 'POST' }),
  getPublishHistory: () => fetchAPI('/publish/history'),

  // Upload
  uploadScreenshot: async (file, filename) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('filename', filename)

    const res = await fetch(`${API_URL}/upload/screenshot`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    if (!res.ok) throw new Error('Upload failed')
    return res.json()
  }
}
