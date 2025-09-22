"use client"

import React, { useState } from "react"
import { StaffTable } from "./components/StaffTable"
import { StaffProcessHistoryTable } from "./components/StaffProcessHistoryTable"
import { Toaster } from "@/components/ui/sonner"

export default function HistoryOperatorPage() {
    const [selectedStaff, setSelectedStaff] = useState<{
        id: string
        name: string
    } | null>(null)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)

    const handleViewHistory = (id: string, name: string) => {
        console.log("handleViewHistory called with:", { id, name })
        console.log("ID type:", typeof id, "ID value:", id)
        setSelectedStaff({ id, name })
        setIsHistoryOpen(true)
    }

    const handleCloseHistory = () => {
        setIsHistoryOpen(false)
        setSelectedStaff(null)
    }
    console.log("Selected Staff:", selectedStaff)

    return (
        // <div className="h-screen flex flex-col p-4 bg-gray-50">
        <div className="m-2 py-3 bg-white rounded-[10px] shadow h-screen">
            <Toaster />

            {/* Main Content */}
            <StaffTable onViewHistory={handleViewHistory} />

            {/* Staff Process History Popup */}
            {selectedStaff && (
                <StaffProcessHistoryTable
                    isOpen={isHistoryOpen}
                    onClose={handleCloseHistory}
                    staffId={selectedStaff.id}
                    staffName={selectedStaff.name}
                />
            )}
        </div>
    )
}
