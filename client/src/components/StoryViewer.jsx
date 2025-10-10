 import { BadgeCheck, X, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const StoryViewer = ({ stories, currentIndex, setCurrentIndex, setViewStory }) => {
  const [progress, setProgress] = useState(0)
  const viewStory = stories[currentIndex]

  useEffect(() => {
    if (!viewStory) return

    let timer, progressInterval

    // Reset progress when a new story loads
    setProgress(0)

    if (viewStory.media_type !== "video") {
      const duration = 10000 // 10 seconds
      const stepTime = 100
      let elapsed = 0

      progressInterval = setInterval(() => {
        elapsed += stepTime
        setProgress((elapsed / duration) * 100)
      }, stepTime)

      // auto-next after 10 seconds
      timer = setTimeout(() => {
        handleNext()
      }, duration)
    }

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [viewStory])

  const handleClose = () => {
    setViewStory(null)
  }

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setViewStory(null) // close viewer at end
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (!viewStory) return null

  const renderContent = () => {
    switch (viewStory.media_type) {
      case "image":
        return (
          <img
            src={viewStory.media_url}
            alt=""
            className="max-w-full max-h-screen object-contain"
          />
        )
      case "video":
        return (
          <video
            controls
            autoPlay
            onEnded={handleNext}
            className="max-h-screen"
            src={viewStory.media_url}
          />
        )
      case "text":
        return (
          <div
            className="w-full h-full flex items-center justify-center p-8 
                       text-white text-2xl text-center"
          >
            {viewStory.content}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="fixed inset-0 h-screen bg-black bg-opacity-90 z-[110] flex items-center justify-center"
      style={{
        backgroundColor:
          viewStory.media_type === "text"
            ? viewStory.background_color || "#000000"
            : "#000000",
      }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* User Info */}
      <div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
        <img
          src={viewStory.user?.profile_picture}
          className="size-8 sm:size-9 rounded-full object-cover border border-white"
          alt=""
        />
        <div className="text-white font-medium flex items-center gap-1.5">
          <span>{viewStory.user?.full_name}</span>
          <BadgeCheck size={18} />
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
      >
        <X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
      </button>

      {/* Prev Button */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-8 text-white p-2 rounded-full 
                     bg-black/40 hover:bg-black/60 transition"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Next Button */}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-8 text-white p-2 rounded-full 
                     bg-black/40 hover:bg-black/60 transition"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Story Content */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  )
}

export default StoryViewer
