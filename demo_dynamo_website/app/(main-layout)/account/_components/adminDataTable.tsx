"use client"

import { useState } from "react"
import { AdminTable } from "@/components/AdminTable"
import { useAdmin } from "@/hooks/useAdmin"
import { Admin } from "@/lib/type"
import { toast } from "sonner"

export default function AdminDataTable() {
    const { data: admins, loading, error, refetch } = useAdmin()
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDetailDialog, setShowDetailDialog] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)

    const handleAdd = () => {
        toast.info("Thêm quản trị viên - Chức năng đang phát triển")
        // Implement add functionality
    }

    const handleEdit = (admin: Admin) => {
        setSelectedAdmin(admin)
        setShowEditDialog(true)
        toast.info(`Chỉnh sửa quản trị viên: ${admin.fullname}`)
        // Implement edit functionality
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

    const handleViewHistory = (adminId: string, adminName: string) => {
        toast.info(`Xem lịch sử của: ${adminName} - Chức năng đang phát triển`)
        // Implement view history functionality
    }

    const handleCloseEditDialog = () => {
        setShowEditDialog(false)
        setSelectedAdmin(null)
    }

    const handleCloseDetailDialog = () => {
        setShowDetailDialog(false)
        setSelectedAdmin(null)
    }

    // Sample edit form component
    const EditForm = selectedAdmin && (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium">Tên đăng nhập</label>
                <input 
                    type="text" 
                    defaultValue={selectedAdmin.username}
                    className="px-3 py-2 border rounded-md"
                    readOnly
                />
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">Họ và tên</label>
                <input 
                    type="text" 
                    defaultValue={selectedAdmin.fullname}
                    className="px-3 py-2 border rounded-md"
                />
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <input 
                    type="email" 
                    defaultValue={selectedAdmin.email}
                    className="px-3 py-2 border rounded-md"
                />
            </div>
            <div className="flex gap-2 justify-end">
                <button 
                    onClick={handleCloseEditDialog}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                    Hủy
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Lưu
                </button>
            </div>
        </div>
    )

    // Sample detail form component
    const DetailForm = selectedAdmin && (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">ID</label>
                <p className="text-sm">{selectedAdmin.id}</p>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
                <p className="text-sm">{selectedAdmin.username}</p>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                <p className="text-sm">{selectedAdmin.fullname}</p>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm">{selectedAdmin.email}</p>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Vai trò</label>
                <div className="flex flex-wrap gap-2">
                    {selectedAdmin.role && selectedAdmin.role.length > 0 ? (
                        selectedAdmin.role.map((role, index) => (
                            <span 
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                                {role.name.replace('ROLE_', '')}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm">Chưa có vai trò</span>
                    )}
                </div>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Ngày tạo</label>
                <p className="text-sm">{new Date(selectedAdmin.createdDate).toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Ngày cập nhật</label>
                <p className="text-sm">{new Date(selectedAdmin.updatedDate).toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="flex justify-end">
                <button 
                    onClick={handleCloseDetailDialog}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                    Đóng
                </button>
            </div>
        </div>
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
                onViewHistory={handleViewHistory}
                editForm={EditForm}
                detailForm={DetailForm}
                showEditDialog={showEditDialog}
                showDetailDialog={showDetailDialog}
                onCloseEditDialog={handleCloseEditDialog}
                onCloseDetailDialog={handleCloseDetailDialog}
            />
        </div>
    )
}