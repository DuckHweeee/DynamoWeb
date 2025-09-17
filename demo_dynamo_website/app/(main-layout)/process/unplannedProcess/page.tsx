"use client"

import ProcessTable from "@/components/ProcessTable"
import { useUnPlannedProcess } from "../hooks/useUnPlannedProcess"
import EditProcessForm from "./components/editProcess"
import AddProcessForm from "./components/addNewProcess"
import DetailProcess from "./components/detailProcess"

export default function UnPlannedProcessTable() {
    // UnPlannedProcess Data
    const { data: process } = useUnPlannedProcess()

    return (
        <ProcessTable
            data={process}
            title="Quản lý gia công"
            showAddButton={true}
            showActions={true}
            showViewHistory={false}
            AddComponent={AddProcessForm}
            EditComponent={EditProcessForm}
            DetailComponent={DetailProcess}
        />
    )
}

