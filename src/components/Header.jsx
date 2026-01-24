import { Link } from 'react-router-dom'
import tourData from '../data/tourData.json'

export default function Header({ completedTopics = [] }) {
  const progress = (completedTopics.length / tourData.topics.length) * 100

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-bodhi-blue">Bodhi</span>
            <span className="text-sm text-gray-500">Virtual Tour</span>
          </Link>

          <div className="flex items-center gap-6">
            {completedTopics.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-bodhi-accent transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {completedTopics.length}/{tourData.topics.length}
                </span>
              </div>
            )}

            <a
              href={tourData.cta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bodhi-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {tourData.cta.text}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
