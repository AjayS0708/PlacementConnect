'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'info' | 'warning' | 'error'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800'
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800'
      default:
        return 'bg-gray-50 border-gray-500 text-gray-800'
    }
  }

  return (
    <div
      className={`fixed top-24 right-24 z-[9999] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div
        className={`flex items-center gap-12 px-20 py-16 border-l-4 shadow-lg rounded-lg ${getTypeStyles()}`}
        style={{ minWidth: '300px', maxWidth: '500px' }}
      >
        <div className="flex-1">
          <p className="font-sans text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'info' | 'warning' | 'error' }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${24 + index * 80}px` }}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </>
  )
}
