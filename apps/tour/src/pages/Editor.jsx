import { useState, useRef, useCallback } from 'react'
import { useTourData } from '../hooks/useTourData'

export default function Editor() {
  const { tourData: initialData, loading } = useTourData()
  const [modifiedData, setModifiedData] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedScreen, setSelectedScreen] = useState(0)
  const [draggingHotspot, setDraggingHotspot] = useState(null)
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [editingHotspot, setEditingHotspot] = useState(null)
  const [liveCoords, setLiveCoords] = useState(null)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const containerRef = useRef(null)

  // Initialize data when loaded
  if (!modifiedData && initialData && !loading) {
    setModifiedData(JSON.parse(JSON.stringify(initialData)))
    setSelectedTopic(initialData.topics[0]?.id || '')
  }

  if (loading || !modifiedData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const currentTopic = modifiedData.topics.find(t => t.id === selectedTopic)
  const currentScreen = currentTopic?.screens[selectedScreen]

  const handleMouseDown = useCallback((e, hotspotId) => {
    e.preventDefault()
    setDraggingHotspot(hotspotId)
    const hotspot = currentScreen?.hotspots.find(h => h.id === hotspotId)
    if (hotspot) {
      setLiveCoords({ x: hotspot.x, y: hotspot.y })
    }
  }, [currentScreen])

  const handleMouseMove = useCallback((e) => {
    if (!draggingHotspot || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))

    const roundedX = Math.round(x * 10) / 10
    const roundedY = Math.round(y * 10) / 10

    setLiveCoords({ x: roundedX, y: roundedY })

    setModifiedData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      const topic = newData.topics.find(t => t.id === selectedTopic)
      const screen = topic?.screens[selectedScreen]
      const hotspot = screen?.hotspots.find(h => h.id === draggingHotspot)
      if (hotspot) {
        hotspot.x = roundedX
        hotspot.y = roundedY
      }
      return newData
    })
  }, [draggingHotspot, selectedTopic, selectedScreen])

  const handleMouseUp = useCallback(() => {
    setDraggingHotspot(null)
    setLiveCoords(null)
  }, [])

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(modifiedData, null, 2))
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleReset = () => {
    setModifiedData(JSON.parse(JSON.stringify(initialData)))
    setSelectedHotspot(null)
    setEditingHotspot(null)
  }

  const handleAddHotspot = useCallback((e) => {
    if (!containerRef.current || draggingHotspot) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10

    const newHotspot = {
      id: `hotspot-${Date.now()}`,
      x,
      y,
      title: 'New Hotspot',
      description: 'Click to edit description',
      aiPowered: false
    }

    setModifiedData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      const topic = newData.topics.find(t => t.id === selectedTopic)
      const screen = topic?.screens[selectedScreen]
      if (screen) {
        screen.hotspots.push(newHotspot)
      }
      return newData
    })

    setEditingHotspot(newHotspot)
  }, [selectedTopic, selectedScreen, draggingHotspot])

  const handleDeleteHotspot = useCallback((hotspotId) => {
    if (!confirm('Delete this hotspot?')) return

    setModifiedData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      const topic = newData.topics.find(t => t.id === selectedTopic)
      const screen = topic?.screens[selectedScreen]
      if (screen) {
        screen.hotspots = screen.hotspots.filter(h => h.id !== hotspotId)
      }
      return newData
    })

    setSelectedHotspot(null)
    setEditingHotspot(null)
  }, [selectedTopic, selectedScreen])

  const handleUpdateHotspot = useCallback((hotspotId, updates) => {
    setModifiedData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      const topic = newData.topics.find(t => t.id === selectedTopic)
      const screen = topic?.screens[selectedScreen]
      const hotspot = screen?.hotspots.find(h => h.id === hotspotId)
      if (hotspot) {
        Object.assign(hotspot, updates)
      }
      return newData
    })
  }, [selectedTopic, selectedScreen])

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId)
    setSelectedScreen(0)
  }

  return (
    <div
      className="min-h-screen bg-gray-100 p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Hotspot Editor</h1>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleCopyJSON}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  copyFeedback
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copyFeedback ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
          </div>

          {/* Selectors */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => handleTopicChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 min-w-[200px]"
              >
                {modifiedData.topics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Screen</label>
              <select
                value={selectedScreen}
                onChange={(e) => setSelectedScreen(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 min-w-[200px]"
              >
                {currentTopic?.screens.map((screen, index) => (
                  <option key={screen.id} value={index}>{screen.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Screenshot with hotspots */}
            <div className="flex-1">
              <div
                ref={containerRef}
                className="relative aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden cursor-crosshair select-none"
                onDoubleClick={handleAddHotspot}
              >
                {currentScreen?.image ? (
                  <img
                    src={currentScreen.image}
                    alt={currentScreen.title}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}

                {/* Hotspots */}
                {currentScreen?.hotspots.map((hotspot, index) => (
                  <div
                    key={hotspot.id}
                    onMouseDown={(e) => handleMouseDown(e, hotspot.id)}
                    onClick={(e) => { e.stopPropagation(); setSelectedHotspot(hotspot.id) }}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing ${
                      draggingHotspot === hotspot.id || selectedHotspot === hotspot.id ? 'z-50' : 'z-10'
                    }`}
                  >
                    <div className={`relative flex items-center justify-center ${
                      draggingHotspot === hotspot.id || selectedHotspot === hotspot.id ? 'scale-125' : 'hover:scale-110'
                    } transition-transform`}>
                      {/* Pulse animation for selected/dragging */}
                      {(draggingHotspot === hotspot.id || selectedHotspot === hotspot.id) && (
                        <div className="absolute w-12 h-12 rounded-full bg-blue-400 animate-ping" />
                      )}

                      {/* Main dot */}
                      <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                        draggingHotspot === hotspot.id || selectedHotspot === hotspot.id
                          ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                          : hotspot.aiPowered
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-500 hover:bg-purple-200'
                            : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Live coordinates display */}
                {liveCoords && (
                  <div className="absolute top-2 left-2 bg-black/80 text-white px-3 py-1 rounded text-sm font-mono">
                    x: {liveCoords.x.toFixed(1)}%, y: {liveCoords.y.toFixed(1)}%
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Drag hotspots to reposition them. Coordinates are saved automatically.
              </p>
            </div>

            {/* Hotspot list & editor */}
            <div className="lg:w-96">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Hotspots ({currentScreen?.hotspots?.length || 0})</h3>
              </div>

              {/* Edit form */}
              {editingHotspot && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-3">Edit Hotspot</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingHotspot.title}
                        onChange={(e) => {
                          const newTitle = e.target.value
                          setEditingHotspot(prev => ({ ...prev, title: newTitle }))
                          handleUpdateHotspot(editingHotspot.id, { title: newTitle })
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editingHotspot.description}
                        onChange={(e) => {
                          const newDesc = e.target.value
                          setEditingHotspot(prev => ({ ...prev, description: newDesc }))
                          handleUpdateHotspot(editingHotspot.id, { description: newDesc })
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingHotspot.aiPowered || false}
                        onChange={(e) => {
                          const newValue = e.target.checked
                          setEditingHotspot(prev => ({ ...prev, aiPowered: newValue }))
                          handleUpdateHotspot(editingHotspot.id, { aiPowered: newValue })
                        }}
                        className="rounded text-purple-600"
                      />
                      <span className="text-sm text-gray-700">AI Powered feature</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingHotspot(null)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => handleDeleteHotspot(editingHotspot.id)}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg text-sm hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {currentScreen?.hotspots.map((hotspot, index) => (
                  <div
                    key={hotspot.id}
                    onClick={() => {
                      setSelectedHotspot(hotspot.id)
                      setEditingHotspot(hotspot)
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedHotspot === hotspot.id || editingHotspot?.id === hotspot.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 ${
                        hotspot.aiPowered ? 'bg-purple-600' : 'bg-blue-600'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {hotspot.title}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          x: {hotspot.x}, y: {hotspot.y}
                        </p>
                        {hotspot.aiPowered && (
                          <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            AI Powered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {(!currentScreen?.hotspots || currentScreen.hotspots.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hotspots yet. Double-click on the image to add one.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li><strong>Add:</strong> Double-click on the image to add a new hotspot</li>
            <li><strong>Move:</strong> Drag any hotspot to reposition it</li>
            <li><strong>Edit:</strong> Click a hotspot to edit its title, description, and AI flag</li>
            <li><strong>Delete:</strong> Select a hotspot and click Delete in the edit panel</li>
            <li><strong>Save:</strong> Click "Copy JSON" to copy data, then paste in your tourData.json</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
