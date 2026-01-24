import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import RoleCard from '../components/RoleCard'
import tourData from '../data/tourData.json'

export default function RoleSelection() {
  const navigate = useNavigate()

  const handleRoleSelect = (roleId) => {
    navigate(`/intro/${roleId}`)
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
