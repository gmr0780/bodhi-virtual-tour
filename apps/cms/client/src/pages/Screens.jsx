import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

const TOUR_URL = import.meta.env.VITE_TOUR_URL || 'https://bodhi-virtual-tour.vercel.app'

function getImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${TOUR_URL}${path}`
}

function HotspotEditor({ screen, onUpdate }) {
  const containerRef = useRef(null)
  const [hotspots, setHotspots] = useState(screen.hotspots || [])
  const [selected, setSelected] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [editing, setEditing] = useState(null)

  async function handleAddHotspot(e) {
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    try {
      const newHotspot = await api.createHotspot({
        screenId: screen.id,
        x,
        y,
        title: 'New Hotspot',
        description: 'Click to edit'
      })
      setHotspots([...hotspots, newHotspot])
      setEditing(newHotspot)
    } catch (err) {
      console.error('Failed to add hotspot:', err)
    }
  }

  async function handleDrag(e, hotspot) {
    if (!dragging) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))

    setHotspots(prev => prev.map(h =>
      h.id === hotspot.id ? { ...h, x, y } : h
    ))
  }

  async function handleDragEnd(hotspot) {
    const updated = hotspots.find(h => h.id === hotspot.id)
    if (updated) {
      try {
        await api.updateHotspot(hotspot.id, { x: updated.x, y: updated.y })
      } catch (err) {
        console.error('Failed to update position:', err)
      }
    }
    setDragging(null)
  }

  async function handleSaveHotspot(data) {
    try {
      await api.updateHotspot(editing.id, data)
      setHotspots(prev => prev.map(h =>
        h.id === editing.id ? { ...h, ...data } : h
      ))
      setEditing(null)
    } catch (err) {
      console.error('Failed to update hotspot:', err)
    }
  }

  async function handleDeleteHotspot(hotspot) {
    if (!confirm('Delete this hotspot?')) return
    try {
      await api.deleteHotspot(hotspot.id)
      setHotspots(prev => prev.filter(h => h.id !== hotspot.id))
      setSelected(null)
    } catch (err) {
      console.error('Failed to delete hotspot:', err)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Double-click on the image to add a hotspot. Drag to reposition.
      </p>
      <div
        ref={containerRef}
        className="relative bg-gray-200 rounded-lg overflow-hidden cursor-crosshair"
        style={{ aspectRatio: '16/9' }}
        onDoubleClick={handleAddHotspot}
        onMouseMove={e => dragging && handleDrag(e, dragging)}
        onMouseUp={() => dragging && handleDragEnd(dragging)}
        onMouseLeave={() => dragging && handleDragEnd(dragging)}
      >
        {screen.imagePath ? (
          <img
            src={getImageUrl(screen.imagePath)}
            alt={screen.title}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image uploaded
          </div>
        )}

        {hotspots.map(hotspot => (
          <div
            key={hotspot.id}
            className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center cursor-move
              ${selected?.id === hotspot.id ? 'bg-bodhi-blue scale-125' : 'bg-bodhi-accent'}
              ${hotspot.aiPowered ? 'ring-2 ring-yellow-400' : ''}
            `}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            onClick={e => { e.stopPropagation(); setSelected(hotspot) }}
            onMouseDown={e => { e.stopPropagation(); setDragging(hotspot) }}
          >
            <span className="text-white text-xs font-bold">+</span>
          </div>
        ))}
      </div>

      {selected && !editing && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{selected.title}</div>
              <div className="text-sm text-gray-500">{selected.description}</div>
              {selected.aiPowered && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded mt-1 inline-block">
                  AI Powered
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(selected)}
                className="text-bodhi-blue hover:text-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteHotspot(selected)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <input
            type="text"
            value={editing.title}
            onChange={e => setEditing({ ...editing, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Title"
          />
          <textarea
            value={editing.description}
            onChange={e => setEditing({ ...editing, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            rows={2}
            placeholder="Description"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editing.aiPowered || false}
              onChange={e => setEditing({ ...editing, aiPowered: e.target.checked })}
              className="rounded text-bodhi-blue"
            />
            <span className="text-sm">AI Powered feature</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveHotspot(editing)}
              className="flex-1 bg-bodhi-blue text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Screens() {
  const { topicId } = useParams()
  const [topic, setTopic] = useState(null)
  const [screens, setScreens] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedScreen, setSelectedScreen] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [topicId])

  async function loadData() {
    try {
      const topicData = await api.getTopics()
      const found = topicData.find(t => t.id === topicId)
      setTopic(found)
      setScreens(found?.screens || [])
      if (found?.screens?.length > 0 && !selectedScreen) {
        setSelectedScreen(found.screens[0])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddScreen() {
    const title = prompt('Screen title:')
    if (!title) return
    try {
      const screen = await api.createScreen({ topicId, title })
      setScreens([...screens, screen])
      setSelectedScreen(screen)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteScreen(screen) {
    if (!confirm(`Delete screen "${screen.title}"?`)) return
    try {
      await api.deleteScreen(screen.id)
      const remaining = screens.filter(s => s.id !== screen.id)
      setScreens(remaining)
      if (selectedScreen?.id === screen.id) {
        setSelectedScreen(remaining[0] || null)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !selectedScreen) return

    setUploading(true)
    try {
      const filename = `${selectedScreen.id}-${Date.now()}.png`
      const result = await api.uploadScreenshot(file, filename)
      await api.updateScreen(selectedScreen.id, { imagePath: result.path })
      setSelectedScreen({ ...selectedScreen, imagePath: result.path })
      setScreens(prev => prev.map(s =>
        s.id === selectedScreen.id ? { ...s, imagePath: result.path } : s
      ))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
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
      <div className="flex items-center gap-4">
        <Link to="/topics" className="text-gray-500 hover:text-gray-700">&larr; Topics</Link>
        <h2 className="text-2xl font-bold text-gray-900">
          {topic?.name} - Screens
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Screen List */}
        <div className="col-span-3 space-y-2">
          <button
            onClick={handleAddScreen}
            className="w-full bg-bodhi-blue text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Add Screen
          </button>
          <div className="bg-white rounded-xl shadow-sm border divide-y max-h-96 overflow-y-auto">
            {screens.map(screen => (
              <div
                key={screen.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedScreen?.id === screen.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedScreen(screen)}
              >
                <div className="font-medium text-sm truncate">{screen.title}</div>
                <div className="text-xs text-gray-500">
                  {screen.hotspots?.length || 0} hotspots
                </div>
              </div>
            ))}
            {screens.length === 0 && (
              <div className="p-4 text-sm text-gray-500 text-center">
                No screens yet
              </div>
            )}
          </div>
        </div>

        {/* Screen Editor */}
        <div className="col-span-9">
          {selectedScreen ? (
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{selectedScreen.title}</h3>
                <div className="flex gap-2">
                  <label className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <button
                    onClick={() => handleDeleteScreen(selectedScreen)}
                    className="text-red-600 hover:text-red-700 px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <HotspotEditor
                screen={selectedScreen}
                onUpdate={() => loadData()}
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
              Select a screen or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
