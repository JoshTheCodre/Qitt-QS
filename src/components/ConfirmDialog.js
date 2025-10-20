"use client"

import { CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "./ui/button"

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, type = "confirm" }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {type === "confirm" ? (
            <div className="w-16 h-16 rounded-full bg-[#0A32F8]/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#0A32F8]" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-600">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-300 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 bg-[#0A32F8] hover:bg-[#0A32F8]/90 text-white shadow-md hover:shadow-lg"
          >
            {type === "confirm" ? "Confirm" : "OK"}
          </Button>
        </div>
      </div>
    </div>
  )
}
