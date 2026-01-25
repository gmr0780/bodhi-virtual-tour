import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import RoleCard from '../components/RoleCard'
import { useTourData } from '../hooks/useTourData'

export default function RoleSelection() {
  const navigate = useNavigate()
  const { tourData, loading } = useTourData()

  const handleRoleSelect = (roleId) => {
    navigate(`/intro/${roleId}`)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-bodhi-blue border-t-transparent rounded-full" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Bodhi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how Bodhi's smart building platform can transform your property operations. Select your role to get a personalized tour.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tourData.roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onClick={() => handleRoleSelect(role.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
