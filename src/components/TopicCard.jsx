import { getIcon, CheckIcon } from './icons'

export default function TopicCard({ topic, isRecommended, isCompleted, onClick }) {
  const Icon = getIcon(topic.icon)

  return (
    <button
      onClick={onClick}
      className={`group relative bg-white rounded-2xl p-6 text-left shadow-sm border transition-all duration-200 ${
        isCompleted
          ? 'border-bodhi-accent/50 bg-bodhi-accent/5'
          : 'border-gray-100 hover:shadow-lg hover:border-bodhi-blue'
      }`}
    >
      {isRecommended && !isCompleted && (
        <span className="absolute -top-3 left-4 bg-bodhi-blue text-white text-xs font-medium px-3 py-1 rounded-full">
          Recommended for you
        </span>
      )}

      {isCompleted && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-bodhi-accent rounded-full flex items-center justify-center">
          <CheckIcon className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isCompleted ? 'bg-bodhi-accent/20' : 'bg-bodhi-blue/10'
        }`}>
          <Icon className={`w-6 h-6 ${isCompleted ? 'text-bodhi-accent' : 'text-bodhi-blue'}`} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {topic.name}
          </h3>
          <p className="text-sm text-gray-600">
            {topic.description}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {topic.screens.length} screens to explore
          </p>
        </div>
      </div>
    </button>
  )
}
