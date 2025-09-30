"use client"

import { useState } from "react"
import { AdminTable } from "@/components/AdminTable"
import { useAdmin } from "@/hooks/useAdmin"
import { Admin } from "@/lib/type"
import { toast } from "sonner"
import RegisterForm from "./RegisterForm"
import EditAdminForm from "./EditAdminForm"
import DetailAdminForm from "./DetailAdminForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function UserDataTable() {
    const { data: admins, loading, error, refetch } = useAdmin()
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDetailDialog, setShowDetailDialog] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)

    const handleAdd = () => {
        setShowAddDialog(true)
    }

    const handleAddSuccess = () => {
        setShowAddDialog(false)
        refetch() // Refresh the data
        toast.success("Thêm người dùng thành công!")
    }

    const handleCloseAddDialog = () => {
        setShowAddDialog(false)
    }

    const handleEdit = (admin: Admin) => {
        setSelectedAdmin(admin)
        setShowEditDialog(true)
    }

    const handleEditSuccess = () => {
        setShowEditDialog(false)
        setSelectedAdmin(null)
        refetch() // Refresh the data
        toast.success("Cập nhật thông tin thành công!")
    }

    const handleDetail = (admin: Admin) => {
        setSelectedAdmin(admin)
        setShowDetailDialog(true)
    }

    const handleDelete = (admin: Admin) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa quản trị viên "${admin.fullname}"?`)) {
            toast.info(`Xóa quản trị viên: ${admin.fullname} - Chức năng đang phát triển`)
            // Implement delete functionality
        }
    }

    const handleCloseEditDialog = () => {
        setShowEditDialog(false)
        setSelectedAdmin(null)
    }

    const handleCloseDetailDialog = () => {
        setShowDetailDialog(false)
        setSelectedAdmin(null)
    }

    // Edit form component using the new EditAdminForm
    const EditForm = selectedAdmin && (
        <EditAdminForm
            admin={selectedAdmin}
            onSuccess={handleEditSuccess}
            onCancel={handleCloseEditDialog}
        />
    )

    // Detail form component using the new DetailAdminForm
    const DetailForm = selectedAdmin && (
        <DetailAdminForm
            admin={selectedAdmin}
            onClose={handleCloseDetailDialog}
        />
    )

    return (
        <div className="container mx-auto">
            <AdminTable
                data={admins}
                loading={loading}
                error={error}
                showAddButton={true}
                showActions={true}
                showViewHistory={false}
                title="Quản Lý Tài Khoản"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDetail={handleDetail}
                onDelete={handleDelete}
            />
            
            {/* Add User Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="w-full max-w-2xl !gap-5 pb-3">
                    <DialogHeader>
                        <DialogTitle className="text-3xl text-[#084188] font-semibold">
                            Thêm Người Dùng Mới
                        </DialogTitle>
                    </DialogHeader>
                    <RegisterForm 
                        onSuccess={handleAddSuccess}
                        onCancel={handleCloseAddDialog}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="w-full max-w-2xl !gap-5 pb-3">
                    <DialogHeader>
                        <DialogTitle className="text-3xl text-[#084188] font-semibold">
                            Chỉnh Sửa Thông Tin
                        </DialogTitle>
                    </DialogHeader>
                    {EditForm}
                </DialogContent>
            </Dialog>

            {/* Detail User Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="w-full max-w-2xl !gap-5 pb-3">
                    <DialogHeader>
                        <DialogTitle className="text-3xl text-[#084188] font-semibold">
                            Chi Tiết Thông Tin Người Dùng
                        </DialogTitle>
                    </DialogHeader>
                    {DetailForm}
                </DialogContent>
            </Dialog>
        </div>
    )
}