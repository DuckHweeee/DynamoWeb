"use client"

import React from "react"
import { useStaff } from "@/hooks/useStaff"
import { OperatorTable } from "@/components/OperatorTable"

interface StaffTableProps {
    onViewHistory: (id: string, name: string) => void
}

export function StaffTable({ onViewHistory }: StaffTableProps) {
    // Fetch staff data
    const { data: staffData, loading, error } = useStaff()
    
    return (
        <OperatorTable
            data={staffData}
            loading={loading}
            error={error}
            showAddButton={false}
            showActions={false}
            showViewHistory={true}
            title="Lịch Sử Nhân Viên"
            onViewHistory={onViewHistory}
        />
    )
}
