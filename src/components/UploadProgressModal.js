"use client"

import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function UploadProgressModal({ isOpen, progress, error, success }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in duration-300">
        <div className="flex flex-col items-center gap-6">
          {/* Progress Circle */}
          <div className="relative">
            {!error && !success && (
              <>
                {/* Animated spinner background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-24 w-24 text-[#0A32F8]/20 animate-spin" />
                </div>
                
                {/* Progress circle */}
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#0A32F8"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#0A32F8]">{progress}%</span>
                </div>
              </>
            )}

            {/* Success state */}
            {success && (
              <div className="w-32 h-32 flex items-center justify-center animate-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-100 rounded-full animate-ping" />
                  <CheckCircle className="h-32 w-32 text-green-500 relative animate-in zoom-in duration-300" strokeWidth={2} />
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="w-32 h-32 flex items-center justify-center animate-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-100 rounded-full animate-ping" />
                  <XCircle className="h-32 w-32 text-red-500 relative animate-in zoom-in duration-300" strokeWidth={2} />
                </div>
              </div>
            )}
          </div>

          {/* Status text */}
          <div className="text-center space-y-2">
            {!error && !success && (
              <>
                <h3 className="text-xl font-bold text-slate-900">Uploading...</h3>
                <p className="text-sm text-slate-500">Please wait while we upload your file</p>
              </>
            )}

            {success && (
              <>
                <h3 className="text-xl font-bold text-green-600">Upload Successful! 🎉</h3>
                <p className="text-sm text-slate-600">Your material is pending approval</p>
              </>
            )}

            {error && (
              <>
                <h3 className="text-xl font-bold text-red-600">Upload Failed</h3>
                <p className="text-sm text-slate-600 max-w-xs">{error}</p>
              </>
            )}
          </div>

          {/* Action buttons */}
          {(error || success) && (
            <button
              onClick={() => window.location.reload()}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                success
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {success ? 'Upload Another' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
