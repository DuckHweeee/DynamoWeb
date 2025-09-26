"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import { useImportExcel } from '@/hooks/useImportExcel'

interface ImportDialogProps {
    isOpen: boolean
    onClose: () => void
    onImportSuccess?: (Type: String) => void
    endpoint?: string
    title?: string
    description?: string
}

export function ImportDialog({
    isOpen,
    onClose,
    onImportSuccess,
    endpoint = "machine/upload",
    title = "Import dữ liệu từ Excel",
    description = "Chọn file Excel để import dữ liệu máy móc"
}: ImportDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { importExcel, loading, error } = useImportExcel(endpoint)

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ]

        const isExcelFile = allowedTypes.includes(file.type) ||
            file.name.toLowerCase().endsWith('.xlsx') ||
            file.name.toLowerCase().endsWith('.xls')

        if (!isExcelFile) {
            alert("Vui lòng chọn file Excel (.xlsx hoặc .xls)")
            return
        }

        setSelectedFile(file)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragActive(false)

        const file = event.dataTransfer.files[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        if (event.type === "dragenter" || event.type === "dragover") {
            setDragActive(true)
        } else if (event.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        try {
            const result = await importExcel(selectedFile)
            console.log("Import successful:", result)

            if (onImportSuccess) {
                onImportSuccess("")
            }

            handleClose()
        } catch (error) {
            console.error("Import error:", error)
        }
    }

    const handleClose = () => {
        setSelectedFile(null)
        setDragActive(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        onClose()
    }

    const removeFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {!selectedFile ? (
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${dragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                            onDrop={handleDrop}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-sm text-gray-600 mb-2">
                                Kéo thả file Excel vào đây hoặc click để chọn file
                            </p>
                            <p className="text-xs text-gray-500">
                                Hỗ trợ định dạng .xlsx và .xls
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                                    <div>
                                        <p className="font-medium text-sm">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeFile}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || loading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading ? "Đang import..." : "Import"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}