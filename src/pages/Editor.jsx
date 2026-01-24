import { useState, useRef, useCallback } from 'react'
import tourData from '../data/tourData.json'

export default function Editor() {
  const [modifiedData, setModifiedData] = useState(JSON.parse(JSON.stringify(tourData)))
  const [selectedTopic, setSelectedTopic] = useState(tourData.topics[0]?.id || '')
  const [selectedScreen, setSelectedScreen] = useState(0)
  const [draggingHotspot, setDraggingHotspot] = useState(null)
  const [liveCoords, setLiveCoords] = useState(null)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const containerRef = useRef(null)

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
    setModifiedData(JSON.parse(JSON.stringify(tourData)))
  }

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
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing ${
                      draggingHotspot === hotspot.id ? 'z-50' : 'z-10'
                    }`}
                  >
                    <div className={`relative flex items-center justify-center ${
                      draggingHotspot === hotspot.id ? 'scale-125' : 'hover:scale-110'
                    } transition-transform`}>
                      {/* Pulse animation for dragging */}
                      {draggingHotspot === hotspot.id && (
                        <div className="absolute w-12 h-12 rounded-full bg-blue-400 animate-ping" />
                      )}

                      {/* Main dot */}
                      <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                        draggingHotspot === hotspot.id
                          ? 'bg-blue-600 text-white ring-4 ring-blue-300'
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

            {/* Hotspot list */}
            <div className="lg:w-80">
              <h3 className="font-semibold text-gray-900 mb-3">Hotspots</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {currentScreen?.hotspots.map((hotspot, index) => (
                  <div
                    key={hotspot.id}
                    className={`p-3 rounded-lg border ${
                      draggingHotspot === hotspot.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
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
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Select a topic and screen from the dropdowns above</li>
            <li>Click and drag any hotspot to reposition it</li>
            <li>Watch the live coordinates update as you drag</li>
            <li>Click "Copy JSON" to copy the updated tour data to your clipboard</li>
            <li>Paste the JSON into your tourData.json file to save changes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
