import { SparklesIcon } from './icons'

export default function Hotspot({ hotspot, index, isActive, onClick, isGuided, isGuidedActive }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Feature ${index + 1}: ${hotspot.title || 'Interactive hotspot'}`}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
        isGuided && !isGuidedActive ? 'opacity-30' : ''
      }`}
    >
      <div className={`relative flex items-center justify-center ${
        isActive
          ? 'scale-110'
          : 'hover:scale-110'
      }`}>
        {/* Pulse animation */}
        <div className={`absolute w-10 h-10 rounded-full ${
          isActive ? 'bg-bodhi-blue' : 'bg-bodhi-blue/50'
        } animate-ping`} />

        {/* Main dot */}
        <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isActive
            ? 'bg-bodhi-blue text-white'
            : 'bg-white text-bodhi-blue border-2 border-bodhi-blue'
        }`}>
          {hotspot.aiPowered ? (
            <SparklesIcon className="w-4 h-4" />
          ) : (
            index + 1
          )}
        </div>
      </div>
    </button>
  )
}
