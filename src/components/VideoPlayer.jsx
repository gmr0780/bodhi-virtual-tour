import { useState } from 'react'
import { PlayIcon } from './icons'

export default function VideoPlayer({ videoUrl, onComplete, placeholderText }) {
  const [isPlaying, setIsPlaying] = useState(false)

  // If no video URL, show placeholder
  if (!videoUrl) {
    return (
      <div className="relative aspect-video bg-bodhi-dark rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <PlayIcon className="w-10 h-10 text-white/50" />
          </div>
          <p className="text-lg text-white/70 mb-2">{placeholderText || 'Video Coming Soon'}</p>
          <p className="text-sm text-white/50">Your personalized intro video will appear here</p>
          <button
            onClick={onComplete}
            className="mt-8 bg-bodhi-accent text-bodhi-dark px-6 py-3 rounded-lg font-medium hover:bg-bodhi-accent/90 transition-colors"
          >
            Skip to Tour
          </button>
        </div>
      </div>
    )
  }

  // Determine if it's YouTube or Vimeo
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const isVimeo = videoUrl.includes('vimeo.com')

  const getEmbedUrl = () => {
    if (isYouTube) {
      const videoId = videoUrl.includes('youtu.be')
        ? videoUrl.split('/').pop()
        : new URL(videoUrl).searchParams.get('v')
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    }
    if (isVimeo) {
      const videoId = videoUrl.split('/').pop()
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    return videoUrl
  }

  if (!isPlaying) {
    return (
      <div className="relative aspect-video bg-bodhi-dark rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <PlayIcon className="w-10 h-10 text-white ml-1" />
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-bodhi-dark rounded-2xl overflow-hidden">
      <iframe
        src={getEmbedUrl()}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
      <button
        onClick={onComplete}
        className="absolute bottom-4 right-4 bg-bodhi-accent text-bodhi-dark px-4 py-2 rounded-lg font-medium hover:bg-bodhi-accent/90 transition-colors"
      >
        Continue to Tour
      </button>
    </div>
  )
}
