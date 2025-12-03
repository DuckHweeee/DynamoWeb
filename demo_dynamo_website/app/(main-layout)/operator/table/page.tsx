"use client"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Staff } from "@/lib/type"
import { useStaff } from "../hooks/useStaff"
import { OperatorTable } from "@/components/OperatorTable"
import EditOperatorForm from "../components/editOperator"
import AddOperatorForm from "../components/addNewOperator"
import DetailStaffForm from "../components/detailOperator"

export default function OperatorTablePage() {
    const router = useRouter()

    // Staff Data
    const { data: staff, loading, error } = useStaff()

    const handleImportSuccess = () => {
        window.location.reload()
    }

    // Add new Staff
    const [showAddForm, setShowAddForm] = useState(false)
    // Edit Staff
    const [editingOperator, setEditingOperator] = useState<Staff | null>(null)
    const [showEditForm, setShowEditForm] = useState(false)
    // Detail Staff
    const [detailStaff, setDetailStaff] = useState<Staff | null>(null)
    const [showDetailForm, setShowDetailForm] = useState(false)

    const handleAdd = () => {
        setShowAddForm(true)
    }

    const handleEdit = (staff: Staff) => {
        setEditingOperator(staff)
        setShowEditForm(true)
    }

    const handleDetail = (staff: Staff) => {
        setDetailStaff(staff)
        setShowDetailForm(true)
    }

    const handleCloseEditDialog = () => {
        setShowEditForm(false)
        setEditingOperator(null)
    }

    const handleCloseDetailDialog = () => {
        setShowDetailForm(false)
        setDetailStaff(null)
    }

    // Forms
    const editForm = editingOperator ? (
        <EditOperatorForm
            staffList={staff}
            idStaffString={editingOperator?.id}
            onUpdate={(updated) => {
                const index = staff.findIndex(op => op.id === updated.id)
                if (index !== -1) staff[index] = updated
                handleCloseEditDialog()
            }}
            onCancel={handleCloseEditDialog}
        />
    ) : null

    const detailForm = detailStaff ? (
        <DetailStaffForm
            staff={detailStaff}
            onCancel={handleCloseDetailDialog}
        />
    ) : null

    const addForm = (
        <AddOperatorForm
            onAdd={(newOp) => {
                staff.push(newOp)
                router.refresh()
                setShowAddForm(false)
            }}
            onCancel={() => setShowAddForm(false)}
        />
    )

    return (
        <>
            <OperatorTable
                data={staff}
                loading={loading}
                error={error}
                showAddButton={true}
                showActions={true}
                showViewHistory={false}
                title="Danh Sách Nhân Viên"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDetail={handleDetail}
                editForm={editForm}
                detailForm={detailForm}
                showEditDialog={showEditForm}
                showDetailDialog={showDetailForm}
                onCloseEditDialog={handleCloseEditDialog}
                onCloseDetailDialog={handleCloseDetailDialog}
                showImportButton={true}
                onImportSuccess={handleImportSuccess}
            />

            {/* Add Dialog */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddForm(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-[1550px]:max-w-6xl min-[1550px]:max-w-7xl p-6">
                        <h2 className="text-3xl text-[#084188] font-semibold mb-4">Thêm nhân viên mới</h2>
                        {addForm}
                    </div>
                </div>
            )}
        </>
    )
}
