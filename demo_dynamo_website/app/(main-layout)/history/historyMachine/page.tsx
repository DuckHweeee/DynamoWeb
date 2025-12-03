"use client"

import React, { useState } from "react"
import { MachineTable } from "@/components/MachineTable"
import MachineProcessHistoryTable from "./components/MachineProcessHistoryTable"
import { useMachine } from "@/hooks/useMachine"
import { Toaster } from "@/components/ui/sonner"

export default function HistoryMachinePage() {
    const [selectedMachine, setSelectedMachine] = useState<{
        id: string
        name: string
    } | null>(null)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)

    // Fetch machine data
    const { data: machines, loading, error } = useMachine()

    const handleViewHistory = (machineId: string, machineName: string) => {
        setSelectedMachine({ id: machineId, name: machineName })
        setIsHistoryOpen(true)
    }

    const handleCloseHistory = () => {
        setIsHistoryOpen(false)
        setSelectedMachine(null)
    }

    return (
        // <div className="h-screen flex flex-col p-4 bg-gray-50">
        <div className="m-2 py-3 bg-white rounded-[10px] shadow h-screen">
            <Toaster />

            {/* Main Content */}
            <MachineTable
                data={machines}
                loading={loading}
                error={error}
                title="Lịch Sử Máy"
                showAddButton={false}
                showActions={false}
                showViewHistory={true}
                onViewHistory={handleViewHistory}
            />

            {/* Machine Process History Popup */}
            {selectedMachine && (
                <MachineProcessHistoryTable
                    isOpen={isHistoryOpen}
                    onClose={handleCloseHistory}
                    machineId={selectedMachine.id}
                    machineName={selectedMachine.name}
                />
            )}
        </div>
    )
}
