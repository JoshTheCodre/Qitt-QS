export function MotivationBanner({ totalUploads = 0, totalLikes = 0 }) {
  // Adaptive motivational messages based on upload count
  const getMotivationalMessage = () => {
    if (totalUploads === 0) {
      return {
        title: "Ready to Make an Impact?",
        subtitle: "Start by uploading your first study material and help fellow students succeed!"
      }
    } else if (totalUploads < 5) {
      return {
        title: "Great Start, Keep Going!",
        subtitle: "You're building something amazing. Every upload helps someone learn!"
      }
    } else if (totalUploads < 10) {
      return {
        title: "You're On Fire! 🔥",
        subtitle: "Keep sharing your knowledge. Your contributions are making a difference!"
      }
    } else if (totalUploads < 20) {
      return {
        title: "Hey Champ, You're Doing Amazing!",
        subtitle: "Keep Sharing Amazing Content With Your Fellow Students"
      }
    } else if (totalUploads < 30) {
      return {
        title: "Wow! You're A Knowledge Champion! 🏆",
        subtitle: "Your dedication to helping others is truly inspiring!"
      }
    } else if (totalUploads < 50) {
      return {
        title: "Incredible Work, Superstar! ⭐",
        subtitle: "You've become a pillar of this learning community!"
      }
    } else if (totalUploads < 100) {
      return {
        title: "Legend Status Unlocked! 👑",
        subtitle: "Your impact on student success is immeasurable. Keep soaring!"
      }
    } else {
      return {
        title: "Ultimate Learning Hero! 🌟",
        subtitle: "You're transforming education! Your legacy will help thousands!"
      }
    }
  }

  const message = getMotivationalMessage()

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl overflow-hidden p-6 md:p-8">
      {/* Decorative stars */}
      <div className="absolute top-2 left-4 text-2xl md:text-3xl">⭐</div>
      <div className="absolute top-4 right-20 text-xl md:text-2xl">🔴</div>
      <div className="absolute bottom-2 right-4 text-2xl md:text-3xl">💚</div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            {message.title}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-blue-100">{message.subtitle}</p>
        </div>

        {/* Stats section */}
        <div className="flex gap-6 md:gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{totalUploads}</div>
            <div className="text-xs md:text-sm text-blue-100 mt-1">Total Uploads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{totalLikes}</div>
            <div className="text-xs md:text-sm text-blue-100 mt-1">Total Likes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
