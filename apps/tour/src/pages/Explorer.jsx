import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ScreenshotView from '../components/ScreenshotView'
import ScreenThumbnails from '../components/ScreenThumbnails'
import { ChevronLeftIcon, ChevronRightIcon, getIcon } from '../components/icons'
import { useTourData } from '../hooks/useTourData'

export default function Explorer() {
  const { roleId, topicId } = useParams()
  const navigate = useNavigate()
  const { tourData, loading } = useTourData()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)
  const [viewedScreens, setViewedScreens] = useState([])
  const [completedTopics, setCompletedTopics] = useState([])
  const [showCompletion, setShowCompletion] = useState(false)

  const role = tourData?.roles?.find(r => r.id === roleId)
  const topic = tourData?.topics?.find(t => t.id === topicId)

  useEffect(() => {
    const saved = localStorage.getItem('bodhi-tour-completed')
    if (saved) {
      setCompletedTopics(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (topic && !viewedScreens.includes(topic.screens[currentScreenIndex]?.id)) {
      setViewedScreens(prev => [...prev, topic.screens[currentScreenIndex]?.id])
    }
  }, [currentScreenIndex, topic])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-bodhi-blue border-t-transparent rounded-full" />
        </div>
      </Layout>
    )
  }

  if (!role || !topic) {
    navigate('/')
    return null
  }

  const currentScreen = topic.screens[currentScreenIndex]
  const TopicIcon = getIcon(topic.icon)

  const markTopicComplete = () => {
    if (!completedTopics.includes(topicId)) {
      const newCompleted = [...completedTopics, topicId]
      setCompletedTopics(newCompleted)
      localStorage.setItem('bodhi-tour-completed', JSON.stringify(newCompleted))
    }
    setShowCompletion(true)
  }

  const handleAllHotspotsViewed = () => {
    // Check if this is the last screen and all screens have been viewed
    if (viewedScreens.length === topic.screens.length - 1 ||
        (viewedScreens.length === topic.screens.length && currentScreenIndex === topic.screens.length - 1)) {
      markTopicComplete()
    }
  }

  const nextScreen = () => {
    if (currentScreenIndex < topic.screens.length - 1) {
      setCurrentScreenIndex(prev => prev + 1)
    } else {
      markTopicComplete()
    }
  }

  const prevScreen = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(prev => prev - 1)
    }
  }

  const getNextTopic = () => {
    const currentIndex = role.recommendedTopics.indexOf(topicId)
    const remainingTopics = role.recommendedTopics
      .slice(currentIndex + 1)
      .filter(id => !completedTopics.includes(id))

    if (remainingTopics.length > 0) {
      return tourData.topics.find(t => t.id === remainingTopics[0])
    }
    return null
  }

  const nextTopic = getNextTopic()

  if (showCompletion) {
    return (
      <Layout completedTopics={completedTopics}>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-bodhi-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <TopicIcon className="w-8 h-8 text-bodhi-accent" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You've explored {topic.name}
          </h1>

          <p className="text-gray-600 mb-8">
            {completedTopics.length} of {tourData.topics.length} topics completed
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {nextTopic && (
              <Link
                to={`/explore/${roleId}/${nextTopic.id}`}
                onClick={() => setShowCompletion(false)}
                className="bg-bodhi-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Next: {nextTopic.name}
              </Link>
            )}

            <Link
              to={`/topics/${roleId}`}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View All Topics
            </Link>

            <a
              href={tourData.cta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bodhi-accent text-bodhi-dark px-6 py-3 rounded-lg font-medium hover:bg-bodhi-accent/90 transition-colors"
            >
              {tourData.cta.text}
            </a>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout completedTopics={completedTopics}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-bodhi-blue">Home</Link>
          <span>/</span>
          <Link to={`/topics/${roleId}`} className="hover:text-bodhi-blue">Topics</Link>
          <span>/</span>
          <span className="text-gray-900">{topic.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bodhi-blue/10 rounded-lg flex items-center justify-center">
              <TopicIcon className="w-5 h-5 text-bodhi-blue" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentScreen.title}</h1>
              <p className="text-sm text-gray-500">
                Screen {currentScreenIndex + 1} of {topic.screens.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevScreen}
              disabled={currentScreenIndex === 0}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextScreen}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Screenshot View */}
        <ScreenshotView
          key={currentScreen.id}
          screen={currentScreen}
          onAllHotspotsViewed={handleAllHotspotsViewed}
        />

        {/* Thumbnails */}
        <div className="mt-6">
          <ScreenThumbnails
            screens={topic.screens}
            currentIndex={currentScreenIndex}
            viewedScreens={viewedScreens}
            onSelect={setCurrentScreenIndex}
          />
        </div>
      </div>
    </Layout>
  )
}
