import { useState, useEffect } from 'react'
import Hotspot from './Hotspot'
import FeaturePanel from './FeaturePanel'

export default function ScreenshotView({ screen, onAllHotspotsViewed, isFirstScreen, onIntroComplete }) {
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [viewedHotspots, setViewedHotspots] = useState([])
  const [isGuided, setIsGuided] = useState(false)
  const [guidedIndex, setGuidedIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showIntro, setShowIntro] = useState(isFirstScreen)

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Auto-start guided mode after intro
  const handleStartExploring = () => {
    setShowIntro(false)
    onIntroComplete?.()
    setTimeout(() => {
      setIsGuided(true)
      setGuidedIndex(0)
      if (screen.hotspots.length > 0) {
        handleHotspotClick(screen.hotspots[0], 0)
      }
    }, 300)
  }

  // Skip intro handler
  const handleSkipIntro = () => {
    setShowIntro(false)
    onIntroComplete?.()
  }

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

  // Intro overlay for first screen
  if (showIntro) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-bodhi-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-bodhi-blue rounded-full animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {screen.title}
          </h2>
          <p className="text-gray-600 mb-6">
            This screen has {screen.hotspots.length} interactive features to explore.
            We'll guide you through each one.
          </p>
          <button
            onClick={handleStartExploring}
            className="bg-bodhi-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Exploring
          </button>
          <button
            onClick={handleSkipIntro}
            className="block mx-auto mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Skip intro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col lg:flex-row gap-6 h-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Screenshot area */}
      <div className="flex-1 lg:w-3/5">
        <div className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden shadow-lg">
          {screen.image ? (
            <img
              src={screen.image}
              alt={screen.title}
              className="w-full h-full object-cover transition-transform duration-700"
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
      <div className="lg:w-2/5 bg-white rounded-xl border border-gray-100 shadow-sm min-h-[300px] transition-all duration-300">
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
