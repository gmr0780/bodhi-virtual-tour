import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [roles, topics, publishHistory] = await Promise.all([
        api.getRoles(),
        api.getTopics(),
        api.getPublishHistory()
      ])

      // Count screens and hotspots
      let screenCount = 0
      let hotspotCount = 0
      topics.forEach(topic => {
        screenCount += topic.screens?.length || 0
        topic.screens?.forEach(screen => {
          hotspotCount += screen.hotspots?.length || 0
        })
      })

      setStats({
        roles: roles.length,
        topics: topics.length,
        screens: screenCount,
        hotspots: hotspotCount
      })
      setHistory(publishHistory)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handlePublish() {
    setPublishing(true)
    setPublishResult(null)
    try {
      const result = await api.publish()
      setPublishResult({ success: true, ...result })
      loadData() // Refresh history
    } catch (err) {
      setPublishResult({ success: false, error: err.message })
    } finally {
      setPublishing(false)
    }
  }

  async function handleImport() {
    if (!confirm('This will replace all CMS content with data from the GitHub JSON file. Continue?')) {
      return
    }
    setImporting(true)
    setImportResult(null)
    try {
      const result = await api.importFromGitHub()
      setImportResult({ success: true, ...result })
      loadData() // Refresh stats
    } catch (err) {
      setImportResult({ success: false, error: err.message })
    } finally {
      setImporting(false)
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleImport}
            disabled={importing}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {importing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full" />
                Importing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Sync from GitHub
              </>
            )}
          </button>
          <a
            href={import.meta.env.VITE_TOUR_URL || 'https://bodhi-virtual-tour.vercel.app'}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-bodhi-blue text-bodhi-blue px-6 py-2 rounded-lg hover:bg-bodhi-blue hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Tour
          </a>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="bg-bodhi-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {publishing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Publishing...
              </>
            ) : (
              'Publish to Tour'
            )}
          </button>
        </div>
      </div>

      {importResult && (
        <div className={`p-4 rounded-lg ${importResult.success ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'}`}>
          {importResult.success ? (
            <p>
              Imported successfully! {importResult.imported.roles} roles, {importResult.imported.topics} topics, {importResult.imported.screens} screens, {importResult.imported.hotspots} hotspots
            </p>
          ) : (
            <p>Import failed: {importResult.error}</p>
          )}
        </div>
      )}

      {publishResult && (
        <div className={`p-4 rounded-lg ${publishResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {publishResult.success ? (
            <p>
              Published successfully!{' '}
              <a href={publishResult.commitUrl} target="_blank" rel="noopener noreferrer" className="underline">
                View commit
              </a>
            </p>
          ) : (
            <p>Publish failed: {publishResult.error}</p>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-bodhi-blue">{stats?.roles || 0}</div>
          <div className="text-gray-600">Roles</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-bodhi-blue">{stats?.topics || 0}</div>
          <div className="text-gray-600">Topics</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-bodhi-blue">{stats?.screens || 0}</div>
          <div className="text-gray-600">Screens</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-bodhi-blue">{stats?.hotspots || 0}</div>
          <div className="text-gray-600">Hotspots</div>
        </div>
      </div>

      {/* Publish History */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Recent Publishes</h3>
        </div>
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No publishes yet
          </div>
        ) : (
          <div className="divide-y">
            {history.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.user?.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.user?.githubUsername}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(item.publishedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.commitSha.slice(0, 7)}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
