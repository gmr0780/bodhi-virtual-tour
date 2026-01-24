import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import VideoPlayer from '../components/VideoPlayer'
import tourData from '../data/tourData.json'

export default function VideoIntro() {
  const { roleId } = useParams()
  const navigate = useNavigate()

  const role = tourData.roles.find(r => r.id === roleId)

  if (!role) {
    navigate('/')
    return null
  }

  const handleVideoComplete = () => {
    navigate(`/topics/${roleId}`)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <p className="text-bodhi-blue font-medium mb-2">Welcome, {role.name}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Here's what Bodhi can do for you
          </h1>
        </div>

        <VideoPlayer
          videoUrl={role.videoUrl}
          onComplete={handleVideoComplete}
          placeholderText={`${role.name} Introduction`}
        />

        <div className="mt-8 text-center">
          <button
            onClick={handleVideoComplete}
            className="text-gray-500 hover:text-gray-700 underline"
          >
            Skip video
          </button>
        </div>
      </div>
    </Layout>
  )
}
