import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

function TopicForm({ topic, onSave, onCancel }) {
  const [name, setName] = useState(topic?.name || '')
  const [description, setDescription] = useState(topic?.description || '')
  const [icon, setIcon] = useState(topic?.icon || '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ name, description, icon })
    } finally {
      setSaving(false)
    }
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji or name)</label>
        <input
          type="text"
          value={icon}
          onChange={e => setIcon(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bodhi-blue focus:border-transparent"
          placeholder="e.g. bolt, leaf, users"
        />
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

export default function Topics() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await api.getTopics()
      setTopics(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(data) {
    try {
      if (editing === 'new') {
        await api.createTopic(data)
      } else {
        await api.updateTopic(editing.id, data)
      }
      setEditing(null)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(topic) {
    if (!confirm(`Delete topic "${topic.name}" and all its screens?`)) return
    try {
      await api.deleteTopic(topic.id)
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
        <h2 className="text-2xl font-bold text-gray-900">Topics</h2>
        <button
          onClick={() => setEditing('new')}
          className="bg-bodhi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Topic
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
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editing === 'new' ? 'Add Topic' : 'Edit Topic'}
            </h3>
            <TopicForm
              topic={editing === 'new' ? null : editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border">
        {topics.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No topics yet. Click "Add Topic" to create one.
          </div>
        ) : (
          <div className="divide-y">
            {topics.map((topic) => (
              <div key={topic.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{topic.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">{topic.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{topic.description}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/topics/${topic.id}/screens`}
                      className="text-bodhi-blue hover:text-blue-700 px-3 py-1"
                    >
                      Screens ({topic.screens?.length || 0})
                    </Link>
                    <button
                      onClick={() => setEditing(topic)}
                      className="text-bodhi-blue hover:text-blue-700 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(topic)}
                      className="text-red-600 hover:text-red-700 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
