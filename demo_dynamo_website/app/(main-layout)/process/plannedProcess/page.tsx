"use client"

import ProcessTable from "@/components/ProcessTable"
import AddProcessForm from "../components/addNewProcess"
import DetailProcess from "../components/detailProcess"
import EditProcessForm from "../components/editProcess"
import { usePlannedProcess } from "../hooks/usePlannedProcess"

export default function PlannedProcessTable() {
    // PlannedProcess Data
    const {
        data: process,
        page,
        totalPages,
        loading,
        nextPage,
        prevPage,
    } = usePlannedProcess()

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
            page={page}
            totalPages={totalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}


        />
    )
}
