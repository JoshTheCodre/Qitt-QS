"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Upload, Zap } from "lucide-react"
import { departments, levels, materialTypes } from "@/lib/data"
import { useUploadStore } from "@/store/uploadStore"
import { useAuthStore } from "@/store/authStore"
import { ConfirmDialog } from "./ConfirmDialog"
import { UploadProgressModal } from "./UploadProgressModal"
import toast from "react-hot-toast"

export function FileUploadForm() {
  const { user } = useAuthStore()
  const { 
    uploadData, 
    updateField, 
    setFile, 
    addTag, 
    removeTag, 
    setTags,
    uploadToFirebase, 
    uploadProgress, 
    isUploading,
    resetAll
  } = useUploadStore()

  const [tagInput, setTagInput] = useState("")
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      setFile(file)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setFile(file)
    }
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !uploadData.tags.includes(trimmedTag)) {
      addTag(trimmedTag)
      setTagInput("")
    }
  }

  const handleTagInputChange = (e) => {
    const value = e.target.value
    if (value.includes(',')) {
      const newTags = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag && !uploadData.tags.includes(tag))
      
      if (newTags.length > 0) {
        setTags([...uploadData.tags, ...newTags])
      }
      setTagInput('')
    } else {
      setTagInput(value)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const validateForm = () => {
    if (!selectedFile) return toast.error("Please select a file to upload"), false
    if (!uploadData.courseCode) return toast.error("Please enter a course code"), false
    if (!uploadData.type) return toast.error("Please select a material type"), false
    if (!uploadData.department) return toast.error("Please select a department"), false
    if (!uploadData.level) return toast.error("Please select a level"), false
    if (!uploadData.description) return toast.error("Please add a description"), false
    if (!termsAccepted) return toast.error("Please accept the terms & conditions"), false
    return true
  }

  const handleUploadClick = () => {
    if (validateForm()) {
      setShowConfirmDialog(true)
    }
  }

  const handleConfirmUpload = async () => {
    setShowConfirmDialog(false)
    setUploadError(null)
    setUploadSuccess(false)
    
    try {
      const result = await uploadToFirebase(user.uid)
      
      if (result.success) {
        setUploadSuccess(true)
        setTimeout(() => {
          resetAll()
          setSelectedFile(null)
          setTagInput("")
          setTermsAccepted(false)
          setUploadSuccess(false)
        }, 3000)
      } else {
        setUploadError(result.error || "Upload failed. Please try again.")
      }
    } catch (error) {
      setUploadError(error.message || "An unexpected error occurred")
    }
  }

  return (
    <>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmUpload}
        title="Confirm Upload"
        message="Are you sure you want to upload this material? It will be reviewed before being published."
        type="confirm"
      />

      <UploadProgressModal
        isOpen={isUploading || uploadSuccess || !!uploadError}
        progress={uploadProgress}
        error={uploadError}
        success={uploadSuccess}
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-8">
          <div className="space-y-4 sm:space-y-6">
            {/* File Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 border-2 border-dashed shadow-sm ${
                isDragActive
                  ? "border-[#0A32F8] bg-[#0A32F8]/5 shadow-md"
                  : "border-[#0A32F8]/30 bg-gradient-to-br from-[#0A32F8]/5 to-white hover:border-[#0A32F8] hover:shadow-md"
              }`}
            >
              <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-[#0A32F8]/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#0A32F8]" />
                </div>
              </div>

              <h3 className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 mb-1 sm:mb-1 lg:mb-2">Drag & drop your file</h3>
              <p className="text-slate-500 text-xs sm:text-xs lg:text-sm mb-2 sm:mb-3 lg:mb-4">or</p>

              <div className="relative inline-block">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                  accept=".pdf,.doc,.docx,.pptx,.xlsx"
                />
                <label htmlFor="file-input">
                  <Button
                    asChild
                    className="bg-[#0A32F8] hover:bg-[#0A32F8]/90 text-white font-semibold transition-all text-xs sm:text-sm py-1.5 px-4 sm:py-2 sm:px-6 shadow-md hover:shadow-lg"
                  >
                    <span>Browse files</span>
                  </Button>
                </label>
              </div>

              <p className="text-slate-500 text-xs sm:text-xs lg:text-sm mt-2 sm:mt-3 lg:mt-4">PDF, DOC, DOCX, PPTX, XLSX • Max 25MB</p>
              {selectedFile && (
                <div className="mt-2 sm:mt-3 lg:mt-4 p-2 sm:p-2 lg:p-3 bg-[#0A32F8]/10 rounded-lg border border-[#0A32F8]/20 flex items-center justify-center gap-2 shadow-sm">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-[#0A32F8] flex-shrink-0" />
                  <p className="text-[#0A32F8] text-xs sm:text-xs lg:text-sm font-semibold truncate">{selectedFile.name}</p>
                </div>
              )}
            </div>

            {/* Course Code & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-900 font-bold mb-2 text-sm">
                  Course code <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. CSC 301"
                  value={uploadData.courseCode}
                  onChange={(e) => updateField('courseCode', e.target.value)}
                  className="w-full border-slate-200 rounded-lg focus:border-[#0A32F8] focus:ring-[#0A32F8] bg-white shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-bold mb-2 text-sm">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadData.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A32F8] focus:border-transparent bg-white shadow-sm"
                >
                  <option value="">Select type</option>
                  {materialTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department & Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-900 font-bold mb-2 text-sm">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadData.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A32F8] focus:border-transparent bg-white shadow-sm"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-900 font-bold mb-2 text-sm">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadData.level}
                  onChange={(e) => updateField('level', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A32F8] focus:border-transparent bg-white shadow-sm"
                >
                  <option value="">Select level</option>
                  {levels.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-900 font-bold mb-2 text-sm">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Add title, description and other details about the material..."
                value={uploadData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A32F8] focus:border-transparent resize-none bg-white shadow-sm"
                rows={4}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-slate-900 font-bold mb-2 text-sm">Tags</label>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-lg bg-white min-h-12 shadow-sm focus-within:ring-2 focus-within:ring-[#0A32F8] focus-within:border-transparent transition-all">
                {uploadData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-[#0A32F8]/10 text-[#0A32F8] px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-[#0A32F8]/20 font-semibold shadow-sm"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-[#0A32F8]/70 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={uploadData.tags.length === 0 ? "Add tags..." : ""}
                  className="flex-1 outline-none text-sm min-w-24 bg-transparent"
                />
              </div>
              <p className="text-slate-500 text-xs mt-2">Separate tags with commas (e.g. CS2001, 2024, Lecture Notes)</p>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-3">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
                className="border-slate-300 data-[state=checked]:bg-[#0A32F8] data-[state=checked]:border-[#0A32F8]" 
              />
              <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                I accept the{" "}
                <a href="#" className="text-[#0A32F8] hover:text-[#0A32F8]/80 font-semibold transition-colors">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full bg-[#0A32F8] hover:bg-[#0A32F8]/90 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload material
            </Button>

            {/* Points Banner */}
            {/* <div className="p-3 sm:p-4 bg-gradient-to-r from-[#0A32F8]/10 to-[#0A32F8]/5 rounded-lg border border-[#0A32F8]/20 flex items-center justify-center gap-2 shadow-sm">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0A32F8]/20 flex items-center justify-center">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#0A32F8]" fill="#0A32F8" />
              </div>
              <p className="text-[#0A32F8] text-xs sm:text-sm font-bold">Earn 20+ points for every approved upload</p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}
