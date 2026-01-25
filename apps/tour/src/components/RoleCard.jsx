import { getIcon, ChevronRightIcon } from './icons'

export default function RoleCard({ role, onClick }) {
  const Icon = getIcon(role.icon)

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl p-8 text-left shadow-sm border border-gray-100 hover:shadow-xl hover:border-bodhi-blue/30 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-bodhi-blue/5 to-bodhi-blue-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 bg-gradient-to-br from-bodhi-blue/10 to-bodhi-blue-light/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-bodhi-blue" />
          </div>
          <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-bodhi-blue group-hover:translate-x-1 transition-all" />
        </div>

        <h3 className="text-xl font-semibold text-bodhi-dark mb-2 group-hover:text-bodhi-blue transition-colors">
          {role.name}
        </h3>
        <p className="text-gray-600">
          {role.description}
        </p>
      </div>
    </button>
  )
}
