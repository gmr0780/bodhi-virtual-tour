import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import TopicCard from '../components/TopicCard'
import { useTourData } from '../hooks/useTourData'

export default function TopicSelection() {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const { tourData, loading } = useTourData()
  const [completedTopics, setCompletedTopics] = useState([])

  const role = tourData?.roles?.find(r => r.id === roleId)

  useEffect(() => {
    // Load completed topics from localStorage
    const saved = localStorage.getItem('bodhi-tour-completed')
    if (saved) {
      setCompletedTopics(JSON.parse(saved))
    }
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-bodhi-blue border-t-transparent rounded-full" />
        </div>
      </Layout>
    )
  }

  if (!role) {
    navigate('/')
    return null
  }

  const handleTopicSelect = (topicId) => {
    navigate(`/explore/${roleId}/${topicId}`)
  }

  const handleResetProgress = () => {
    localStorage.removeItem('bodhi-tour-completed')
    setCompletedTopics([])
  }

  // Sort topics by recommended order for this role
  const sortedTopics = [...tourData.topics].sort((a, b) => {
    const aIndex = role.recommendedTopics.indexOf(a.id)
    const bIndex = role.recommendedTopics.indexOf(b.id)
    return aIndex - bIndex
  })

  return (
    <Layout completedTopics={completedTopics}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <p className="text-bodhi-blue font-medium">
              {completedTopics.length > 0
                ? `${completedTopics.length} of ${tourData.topics.length} topics explored`
                : 'Choose a topic to explore'
              }
            </p>
            {completedTopics.length > 0 && (
              <button
                type="button"
                onClick={handleResetProgress}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Reset
              </button>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What would you like to explore?
          </h1>
          <p className="text-gray-600">
            Topics are ordered based on what's most relevant for your role. Explore any topic in any order.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {sortedTopics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isRecommended={index === 0 && !completedTopics.includes(topic.id)}
              isCompleted={completedTopics.includes(topic.id)}
              onClick={() => handleTopicSelect(topic.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
