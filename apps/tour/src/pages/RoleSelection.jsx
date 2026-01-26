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
        {/* Hero section with gradient accent */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-bodhi-blue/10 to-bodhi-blue-light/10 text-bodhi-blue px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-bodhi-blue rounded-full animate-pulse"></span>
            Interactive Product Tour
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-bodhi-dark mb-4">
            Welcome to <span className="bg-gradient-to-r from-bodhi-blue to-bodhi-blue-light bg-clip-text text-transparent">Bodhi</span>
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

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by leading hospitality brands</p>
          <div className="flex justify-center items-center gap-8 opacity-50">
            <span className="text-lg font-semibold text-gray-400">Montage</span>
            <span className="text-lg font-semibold text-gray-400">Four Seasons</span>
            <span className="text-lg font-semibold text-gray-400">IHG</span>
            <span className="text-lg font-semibold text-gray-400">Hyatt</span>
          </div>
        </div>
      </div>
    </Layout>
  )
}
