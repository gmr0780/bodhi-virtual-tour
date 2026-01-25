import { useState, useEffect } from 'react'
import { api } from '../lib/api'

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

      <div className="bg-white rounded-xl shadow-sm border">
        {roles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No roles yet. Click "Add Role" to create one.
          </div>
        ) : (
          <div className="divide-y">
            {roles.map((role) => (
              <div key={role.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{role.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">{role.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{role.description}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(role)}
                    className="text-bodhi-blue hover:text-blue-700 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(role)}
                    className="text-red-600 hover:text-red-700 px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
