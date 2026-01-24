import { getIcon, ChevronRightIcon } from './icons'

export default function RoleCard({ role, onClick }) {
  const Icon = getIcon(role.icon)

  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl p-8 text-left shadow-sm border border-gray-100 hover:shadow-lg hover:border-bodhi-blue transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="w-14 h-14 bg-bodhi-blue/10 rounded-xl flex items-center justify-center mb-6">
          <Icon className="w-7 h-7 text-bodhi-blue" />
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-bodhi-blue group-hover:translate-x-1 transition-all" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {role.name}
      </h3>
      <p className="text-gray-600">
        {role.description}
      </p>
    </button>
  )
}
