"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    className?: string
    showCloseButton?: boolean
}

interface ModalHeaderProps {
    children: React.ReactNode
    className?: string
}

interface ModalContentProps {
    children: React.ReactNode
    className?: string
}

interface ModalTitleProps {
    children: React.ReactNode
    className?: string
}

export function Modal({ 
    isOpen, 
    onClose, 
    children, 
    className,
    showCloseButton = true 
}: ModalProps) {
    // Close modal on escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div 
                className={cn(
                    "relative bg-white rounded-lg shadow-xl max-h-[95vh] w-[99vw] max-w-none flex flex-col overflow-hidden",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
                
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg border hover:bg-gray-100 transition-colors z-10"
                    >
                        <XIcon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
    return (
        <div className={cn("flex-shrink-0 px-6 py-4 border-b bg-gray-50", className)}>
            {children}
        </div>
    )
}

export function ModalContent({ children, className }: ModalContentProps) {
    return (
        <div className={cn("flex-1 flex flex-col overflow-hidden", className)}>
            {children}
        </div>
    )
}

export function ModalTitle({ children, className }: ModalTitleProps) {
    return (
        <h2 className={cn("text-xl font-bold text-gray-900", className)}>
            {children}
        </h2>
    )
}
