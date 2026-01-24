import { CheckIcon } from './icons'

export default function ScreenThumbnails({ screens, currentIndex, viewedScreens, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {screens.map((screen, index) => (
        <button
          key={screen.id}
          onClick={() => onSelect(index)}
          className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
            index === currentIndex
              ? 'border-bodhi-blue'
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          {screen.image ? (
            <img
              src={screen.image}
              alt={screen.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-400">{index + 1}</span>
            </div>
          )}

          {viewedScreens.includes(screen.id) && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-bodhi-accent rounded-full flex items-center justify-center">
              <CheckIcon className="w-3 h-3 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
