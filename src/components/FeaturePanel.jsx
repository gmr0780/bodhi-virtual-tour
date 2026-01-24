import { SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from './icons'

export default function FeaturePanel({
  hotspot,
  isGuided,
  guidedIndex,
  totalHotspots,
  onNext,
  onPrev,
  onExitGuided
}) {
  if (!hotspot) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div>
          <p className="text-gray-500 mb-2">Click a hotspot to learn more</p>
          <p className="text-sm text-gray-400">Or use "Guide Me" for a step-by-step walkthrough</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex-1">
        {hotspot.aiPowered && (
          <div className="flex items-center gap-2 text-bodhi-accent mb-3">
            <SparklesIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Bodhi AI</span>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {hotspot.title}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {hotspot.description}
        </p>
      </div>

      {isGuided && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              Step {guidedIndex + 1} of {totalHotspots}
            </span>
            <button
              onClick={onExitGuided}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Exit guide
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={guidedIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={onNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-bodhi-blue text-white rounded-lg hover:bg-blue-700"
            >
              {guidedIndex === totalHotspots - 1 ? 'Finish' : 'Next'}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
