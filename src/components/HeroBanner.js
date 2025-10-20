export function HeroBanner() {
  return (
    <div className="relative h-32 md:h-44 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl md:rounded-2xl overflow-hidden mb-6 md:mb-8 mx-4 lg:mx-0">
      {/* Decorative wave patterns */}
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d="M0,100 C300,150 600,50 900,100 L900,200 L0,200 Z" fill="currentColor" className="text-blue-500" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d="M0,120 C400,80 800,160 1200,120 L1200,200 L0,200 Z" fill="currentColor" className="text-blue-400" />
        </svg>
      </div>
      
      {/* Motivational Text */}
      <div className="relative h-full flex items-center justify-center px-4">
        <p className="text-white text-xl md:text-3xl font-serif italic tracking-wide animate-pulse" style={{ 
          fontFamily: "'Playfair Display', 'Georgia', serif",
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          animation: 'fadeInUp 1.5s ease-out'
        }}>
          Keep it real, you can do it
        </p>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
