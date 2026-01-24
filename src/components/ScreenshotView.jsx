import { useState } from 'react'
import Hotspot from './Hotspot'
import FeaturePanel from './FeaturePanel'

export default function ScreenshotView({ screen, onAllHotspotsViewed }) {
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [viewedHotspots, setViewedHotspots] = useState([])
  const [isGuided, setIsGuided] = useState(false)
  const [guidedIndex, setGuidedIndex] = useState(0)

  const handleHotspotClick = (hotspot, index) => {
    setActiveHotspot(hotspot)

    if (!viewedHotspots.includes(hotspot.id)) {
      const newViewed = [...viewedHotspots, hotspot.id]
      setViewedHotspots(newViewed)

      if (newViewed.length === screen.hotspots.length) {
        onAllHotspotsViewed?.()
      }
    }

    if (isGuided) {
      setGuidedIndex(index)
    }
  }

  const startGuided = () => {
    setIsGuided(true)
    setGuidedIndex(0)
    handleHotspotClick(screen.hotspots[0], 0)
  }

  const exitGuided = () => {
    setIsGuided(false)
  }

  const nextGuided = () => {
    if (guidedIndex < screen.hotspots.length - 1) {
      const nextIndex = guidedIndex + 1
      setGuidedIndex(nextIndex)
      handleHotspotClick(screen.hotspots[nextIndex], nextIndex)
    } else {
      exitGuided()
    }
  }

  const prevGuided = () => {
    if (guidedIndex > 0) {
      const prevIndex = guidedIndex - 1
      setGuidedIndex(prevIndex)
      handleHotspotClick(screen.hotspots[prevIndex], prevIndex)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Screenshot area */}
      <div className="flex-1 lg:w-3/5">
        <div className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden">
          {screen.image ? (
            <img
              src={screen.image}
              alt={screen.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <p className="text-gray-400 mb-2">Screenshot Placeholder</p>
                <p className="text-sm text-gray-300">{screen.title}</p>
              </div>
            </div>
          )}

          {/* Hotspots */}
          {screen.hotspots.map((hotspot, index) => (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              index={index}
              isActive={activeHotspot?.id === hotspot.id}
              onClick={() => handleHotspotClick(hotspot, index)}
              isGuided={isGuided}
              isGuidedActive={isGuided && guidedIndex === index}
            />
          ))}
        </div>

        {/* Guide Me button */}
        {!isGuided && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {viewedHotspots.length} of {screen.hotspots.length} features explored
            </p>
            <button
              onClick={startGuided}
              className="text-bodhi-blue hover:underline text-sm font-medium"
            >
              Guide Me →
            </button>
          </div>
        )}
      </div>

      {/* Feature panel */}
      <div className="lg:w-2/5 bg-white rounded-xl border border-gray-100 min-h-[300px]">
        <FeaturePanel
          hotspot={activeHotspot}
          isGuided={isGuided}
          guidedIndex={guidedIndex}
          totalHotspots={screen.hotspots.length}
          onNext={nextGuided}
          onPrev={prevGuided}
          onExitGuided={exitGuided}
        />
      </div>
    </div>
  )
}
