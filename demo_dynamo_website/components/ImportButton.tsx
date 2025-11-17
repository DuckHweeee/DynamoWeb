"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { ImportDialog } from "./ImportDialog"

interface ImportButtonProps {
    endpoint: string
    title?: string
    description?: string
    onImportSuccess?: () => void
    className?: string
    variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    children?: React.ReactNode
}

export function ImportButton({
    endpoint,
    title = "Import dữ liệu từ Excel",
    description = "Chọn file Excel để import dữ liệu",
    onImportSuccess,
    className = "px-4 py-6 bg-green-600 hover:bg-green-700 cursor-pointer text-white hover:text-white",
    variant = "outline",
    size = "lg",
    children
}: ImportButtonProps) {
    const [showImportDialog, setShowImportDialog] = useState(false)

    const handleImportSuccess = () => {
        setShowImportDialog(false)
        if (onImportSuccess) {
            onImportSuccess()
        }
    }

    return (
        <>
            <Button
                variant={variant}
                size={size}
                className={className}
                onClick={() => setShowImportDialog(true)}
            >
                {children || (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Excel
                    </>
                )}
            </Button>

            <ImportDialog
                isOpen={showImportDialog}
                onClose={() => setShowImportDialog(false)}
                onImportSuccess={handleImportSuccess}
                endpoint={endpoint}
                title={title}
                description={description}
            />
        </>
    )
}

export default ImportButton;