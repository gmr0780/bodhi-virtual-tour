import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export default function Settings() {
  const [settings, setSettings] = useState({
    cta: { text: '', url: '' },
    allowedUsers: []
  })
  const [newUser, setNewUser] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const data = await api.getSettings()
      setSettings({
        cta: data.cta || { text: 'Book a Demo', url: 'https://www.gobodhi.com/contact' },
        allowedUsers: data.allowedUsers || []
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveCta(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      await api.updateSetting('cta', settings.cta)
      setSuccess('CTA settings saved!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddUser(e) {
    e.preventDefault()
    if (!newUser.trim()) return

    const updated = [...settings.allowedUsers, newUser.trim()]
    try {
      await api.updateSetting('allowedUsers', updated)
      setSettings({ ...settings, allowedUsers: updated })
      setNewUser('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleRemoveUser(username) {
    const updated = settings.allowedUsers.filter(u => u !== username)
    try {
      await api.updateSetting('allowedUsers', updated)
      setSettings({ ...settings, allowedUsers: updated })
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
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg">
          {success}
          <button onClick={() => setSuccess(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* CTA Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Call-to-Action Button</h3>
        <form onSubmit={handleSaveCta} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={settings.cta.text}
              onChange={e => setSettings({
                ...settings,
                cta: { ...settings.cta, text: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bodhi-blue focus:border-transparent"
              placeholder="e.g. Book a Demo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
            <input
              type="url"
              value={settings.cta.url}
              onChange={e => setSettings({
                ...settings,
                cta: { ...settings.cta, url: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bodhi-blue focus:border-transparent"
              placeholder="https://www.gobodhi.com/contact"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-bodhi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save CTA Settings'}
          </button>
        </form>
      </div>

      {/* Allowed Users */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Allowed Users</h3>
        <p className="text-sm text-gray-500 mb-4">
          Only these GitHub usernames can access the CMS. Leave empty to allow anyone with GitHub.
        </p>

        <form onSubmit={handleAddUser} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newUser}
            onChange={e => setNewUser(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bodhi-blue focus:border-transparent"
            placeholder="GitHub username"
          />
          <button
            type="submit"
            className="bg-bodhi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </form>

        {settings.allowedUsers.length === 0 ? (
          <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
            No restrictions - any GitHub user can access the CMS
          </div>
        ) : (
          <div className="space-y-2">
            {settings.allowedUsers.map(username => (
              <div
                key={username}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-mono text-sm">{username}</span>
                <button
                  onClick={() => handleRemoveUser(username)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
