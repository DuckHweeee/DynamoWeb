"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Admin } from "@/lib/type";

interface DetailAdminFormProps {
  admin: Admin;
  onClose: () => void;
}

// Helper function to get role display name and badge variant
const getRoleDisplayInfo = (roleName: string) => {
  switch (roleName) {
    case "ROLE_ADMIN":
      return { displayName: "Quản lý", variant: "admin" as const };
    case "ROLE_USER":
      return { displayName: "Người vận hành", variant: "operator" as const };
    default:
      return { displayName: roleName.replace('ROLE_', ''), variant: "secondary" as const };
  }
};

export default function DetailAdminForm({ admin, onClose }: DetailAdminFormProps) {
  return (
    <div className="grid gap-4">
      {/* ID Field */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-600">ID</label>
        <p className="text-sm bg-gray-50 px-3 py-2 rounded-md">{admin.id}</p>
      </div>

      {/* Username Field */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
        <p className="text-sm bg-gray-50 px-3 py-2 rounded-md">{admin.username}</p>
      </div>

      {/* Fullname Field */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-600">Họ và tên</label>
        <p className="text-sm bg-gray-50 px-3 py-2 rounded-md">{admin.fullname}</p>
      </div>

      {/* Email Field */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-600">Email</label>
        <p className="text-sm bg-gray-50 px-3 py-2 rounded-md">{admin.email}</p>
      </div>

      {/* Role Field with Enhanced Badges */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-600">Vai trò</label>
        <div className="flex flex-wrap gap-2">
          {admin.role && admin.role.length > 0 ? (
            admin.role.map((role, index) => {
              const roleInfo = getRoleDisplayInfo(role.name);
              return (
                <Badge 
                  key={index}
                  variant={roleInfo.variant}
                  className="text-xs"
                >
                  {roleInfo.displayName}
                </Badge>
              );
            })
          ) : (
            <Badge variant="secondary" className="text-xs">
              Chưa có vai trò
            </Badge>
          )}
        </div>
      </div>

      {/* Created Date Field */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-600">Ngày tạo</label>
        <p className="text-sm bg-gray-50 px-3 py-2 rounded-md">
          {new Date(admin.createdDate).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Updated Date Field */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-600">Ngày cập nhật</label>
        <p className="text-sm bg-gray-50 px-3 py-2 rounded-md">
          {new Date(admin.updatedDate).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Action Button */}
      <div className="flex justify-end mt-4">
        <Button 
          variant="outline"
          onClick={onClose}
          className="px-6"
        >
          Đóng
        </Button>
      </div>
    </div>
  );
}
