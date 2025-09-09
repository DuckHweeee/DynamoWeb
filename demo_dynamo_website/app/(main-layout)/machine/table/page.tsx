"use client"

import React from "react"
import { useMachine } from "../../../../hooks/useMachine"
import { MachineTable } from "@/components/MachineTable"
import EditMachineForm from "../components/editMachine"
import AddMachineForm from "../components/addNewMachine"
import DetailMachineForm from "../components/detailMachine"

export default function MachineTablePage() {
    // Machine Data
    const { data: machine } = useMachine()

    return (
        <MachineTable
            data={machine}
            title="Hiện Trạng Máy Móc"
            showAddButton={true}
            showActions={true}
            showViewHistory={false}
            AddComponent={AddMachineForm}
            EditComponent={EditMachineForm}
            DetailComponent={DetailMachineForm}
        />
    )
}
