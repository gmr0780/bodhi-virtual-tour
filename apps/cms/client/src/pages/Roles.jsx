import { useState, useEffect } from 'react'
import { api } from '../lib/api'

const iconMap = {
  building: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  wrench: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  server: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
}

function RoleIcon({ name }) {
  return iconMap[name] || <span className="text-lg">{name}</span>
}

function RoleForm({ role, topics, onSave, onCancel }) {
  const [name, setName] = useState(role?.name || '')
  const [description, setDescription] = useState(role?.description || '')
  const [icon, setIcon] = useState(role?.icon || '')
  const [videoUrl, setVideoUrl] = useState(role?.videoUrl || '')
  const [recommendedTopics, setRecommendedTopics] = useState(role?.recommendedTopics || [])
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ name, description, icon, videoUrl, recommendedTopics })
    } finally {
      setSaving(false)
    }
  }

  function toggleTopic(topicId) {
    setRecommendedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bodhi-blue focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bodhi-blue focus:border-transparent"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji or URL)</label>
        <input
          type="text"
          value={icon}
          onChange={e => setIcon(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bodhi-blue focus:border-transparent"
          placeholder="e.g. hotel or https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
        <input
          type="text"
          value={videoUrl}
          onChange={e => setVideoUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bodhi-blue focus:border-transparent"
          placeholder="YouTube or Vimeo URL"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Topics</label>
        <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
          {topics.map(topic => (
            <label key={topic.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={recommendedTopics.includes(topic.id)}
                onChange={() => toggleTopic(topic.id)}
                className="rounded text-bodhi-blue focus:ring-bodhi-blue"
              />
              <span className="text-sm">{topic.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-bodhi-blue text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function Roles() {
  const [roles, setRoles] = useState([])
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null, 'new', or role object
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [rolesData, topicsData] = await Promise.all([
        api.getRoles(),
        api.getTopics()
      ])
      setRoles(rolesData)
      setTopics(topicsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(data) {
    try {
      if (editing === 'new') {
        await api.createRole(data)
      } else {
        await api.updateRole(editing.id, data)
      }
      setEditing(null)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(role) {
    if (!confirm(`Delete role "${role.name}"?`)) return
    try {
      await api.deleteRole(role.id)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-bodhi-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Roles</h2>
        <button
          onClick={() => setEditing('new')}
          className="bg-bodhi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Role
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editing === 'new' ? 'Add Role' : 'Edit Role'}
            </h3>
            <RoleForm
              role={editing === 'new' ? null : editing}
              topics={topics}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {roles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
          No roles yet. Click "Add Role" to create one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <div key={role.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-bodhi-blue/10 rounded-lg flex items-center justify-center text-bodhi-blue flex-shrink-0">
                  <RoleIcon name={role.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{role.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm text-gray-400">
                  {role.recommendedTopics?.length || 0} topics
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(role)}
                    className="p-2 text-gray-400 hover:text-bodhi-blue hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(role)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
