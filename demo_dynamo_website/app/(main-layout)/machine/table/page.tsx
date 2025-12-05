"use client"

import React from "react"
import { useMachine } from "../../../../hooks/useMachine"
import { MachineTable } from "@/components/MachineTable"
import EditMachineForm from "../components/editMachine"
import AddMachineForm from "../components/addNewMachine"
import DetailMachineForm from "../components/detailMachine"

export default function MachineTablePage() {
    const { data: machine, loading, error } = useMachine()

    const handleImportSuccess = () => {
        window.location.reload()
    }

    return (
        <MachineTable
            data={machine}
            title="Quản lý máy móc  "
            showAddButton={true}
            showActions={true}
            showViewHistory={false}
            showImportButton={true}
            onImportSuccess={handleImportSuccess}
            AddComponent={AddMachineForm}
            EditComponent={EditMachineForm}
            DetailComponent={DetailMachineForm}
        />
    )
}
