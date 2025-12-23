"use client"

import ProcessTable from "@/components/ProcessTable"
import EditProcessForm from "./components/editProcess"
import AddProcessForm from "./components/addNewProcess"
import DetailProcess from "./components/detailProcess"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ClipboardList, PencilLine } from "lucide-react";
import { useUnplannedProcess } from "../hooks/useUnPlannedProcess"
export default function UnPlannedProcessTable() {
    // UnPlannedProcess Data
    const {
        data: process,
        page,
        totalPages,
        loading,
        nextPage,
        prevPage,
    } = useUnplannedProcess()
    return (
        <>
            <ProcessTable
                data={process}
                title="Quản lý gia công"
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
        </>

    )
}

