"use client"

import { useState, useEffect } from "react"
import { Clock, FileText, CheckCircle, XCircle, Eye } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useLibraryStore } from "@/store/libraryStore"
import { useRouter } from "next/navigation"

export function PendingUploads() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { userUploads, loading, fetchUserUploads } = useLibraryStore()

  useEffect(() => {
    if (user?.uid) {
      fetchUserUploads(user.uid)
    }
  }, [user?.uid, fetchUserUploads])

  // Combine pending and approved uploads, but prioritize pending
  const allUploads = [
    ...(userUploads.pending || []),
    ...(userUploads.approved || [])
  ].slice(0, 5) // Show only first 5

  const handleViewMaterial = (materialId) => {
    router.push(`/material/${materialId}`)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Uploads</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-slate-100 rounded-lg"></div>
          <div className="h-16 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (allUploads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#0A32F8]" />
          Recent Uploads
        </h3>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No uploads yet</p>
          <button
            onClick={() => router.push('/upload')}
            className="mt-4 px-4 py-2 bg-[#0A32F8] text-white rounded-full text-sm font-medium hover:bg-[#0829d1] transition"
          >
            Upload Your First Material
          </button>
        </div>
      </div>
    )
  }

  const pendingCount = userUploads.pending?.length || 0

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#0A32F8]" />
          Recent Uploads
        </h3>
        {pendingCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
            {pendingCount} Pending
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {allUploads.map((upload) => {
          const isPending = upload.status === 'pending' || !upload.isApproved
          const isApproved = upload.status === 'approved' || upload.isApproved
          
          return (
            <div 
              key={upload.id}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
              onClick={() => isApproved && handleViewMaterial(upload.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isPending ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <FileText className={`h-5 w-5 ${
                    isPending ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">
                    {upload.courseCode || 'Untitled'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {upload.description || 'No description'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(upload.uploadedAt || upload.metadata?.uploadedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {isPending && (
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </span>
                )}
                {isApproved && (
                  <>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Approved
                    </span>
                    <Eye className="h-4 w-4 text-slate-400 group-hover:text-[#0A32F8] transition" />
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {allUploads.length >= 5 && (
        <button
          onClick={() => router.push('/library?tab=uploads')}
          className="w-full mt-4 py-2 text-[#0A32F8] hover:bg-blue-50 rounded-lg text-sm font-medium transition"
        >
          View All Uploads
        </button>
      )}
    </div>
  )
}
