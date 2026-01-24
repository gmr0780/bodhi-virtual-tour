import Header from './Header'

export default function Layout({ children, completedTopics = [] }) {
  return (
    <div className="min-h-screen bg-bodhi-light">
      <Header completedTopics={completedTopics} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
