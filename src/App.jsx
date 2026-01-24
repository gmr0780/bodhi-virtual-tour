import { Routes, Route } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection'
import VideoIntro from './pages/VideoIntro'
import TopicSelection from './pages/TopicSelection'
import Explorer from './pages/Explorer'
import Editor from './pages/Editor'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/intro/:roleId" element={<VideoIntro />} />
      <Route path="/topics/:roleId" element={<TopicSelection />} />
      <Route path="/explore/:roleId/:topicId" element={<Explorer />} />
      <Route path="/editor" element={<Editor />} />
    </Routes>
  )
}

export default App
