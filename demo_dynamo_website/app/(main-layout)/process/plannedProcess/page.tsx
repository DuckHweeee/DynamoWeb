"use client"

import ProcessTable from "@/components/ProcessTable"
import { usePlannedProcess } from "../hooks/usePlannedProcess"
import AddProcessForm from "../components/addNewProcess"
import DetailProcess from "../components/detailProcess"
import EditProcessForm from "../components/editProcess"

export default function PlannedProcessTable() {
    // PlannedProcess Data
    const { data: process } = usePlannedProcess()

    return (
        <ProcessTable
            data={process}
            title="Quản lý kế hoạch gia công"
            showAddButton={true}
            showActions={true}
            showViewHistory={false}
            AddComponent={AddProcessForm}
            EditComponent={EditProcessForm}
            DetailComponent={DetailProcess}
        />
    )
}
