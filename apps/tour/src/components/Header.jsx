import { Link } from 'react-router-dom'
import { useTourData } from '../hooks/useTourData'

export default function Header({ completedTopics = [] }) {
  const { tourData } = useTourData()
  const totalTopics = tourData?.topics?.length || 1
  const progress = (completedTopics.length / totalTopics) * 100

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/bodhi-logo.svg" alt="Bodhi" className="h-8" />
            <span className="text-sm font-medium text-gray-500 border-l border-gray-300 pl-3">Virtual Tour</span>
          </Link>

          <div className="flex items-center gap-6">
            {completedTopics.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-bodhi-blue to-bodhi-blue-light transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {completedTopics.length}/{totalTopics}
                </span>
              </div>
            )}

            <a
              href={tourData?.cta?.url || 'https://www.gobodhi.com/contact'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-bodhi-blue to-bodhi-blue-light text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
            >
              {tourData?.cta?.text || 'Book a Demo'}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
